/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { EventEmitter } = require('events');
const xml2json = require('xml2json');
const xmpp = require('node-xmpp-client');

const constants = require('../constants');

module.exports = class XmppClient {
  /**
   *
   * @param String domain
   */
  constructor(domain, port, host) {
    this.port = port;
    this.domain = domain;
    this.host = host;
    this.events = new EventEmitter();
    this.connected = false;
  }

  /**
   *
   * @param String username
   * @param String password
   */
  connect(username, password) {
    return new Promise((resolve) => {
      this.jid = `${username}@${this.domain}`;
      this.username = username;
      this.client = new xmpp.Client({
        jid: this.jid,
        password,
        host: this.host,
      });

      this.client.on('error', (error) => {
        console.log(error);
        this.events.emit('error', error);
      });

      this.client.on('online', (data) => {
        this.connected = true;

        this.setStanzaListener();
        this.setStatus(constants.availabilityStatus.AVAILABLE, 'Im ready');

        this.getUserInfo(this.jid)
          .then((vCard) => {
            this.nickname = vCard.nickname;
          });

        // keepalive
        if (this.client.connection.socket) {
          this.client.connection.socket.setTimeout(0);
          this.client.connection.socket.setKeepAlive(true, 5000);
        }

        resolve(data);
      });

      this.client.on('close', () => {
        this.events.emit('disconnected');
      });
    });
  }

  disconnect() {
    const presenceData = {
      presence: {
        type: 'unavailable',
      },
    };

    this.client.send(xml2json.toXml(presenceData));
    this.client.end();

    // Clear all user properties
    this.clearClientData();
  }

  clearClientData() {
    this.connected = false;
    this.client = null;
    this.username = '';
    this.jid = '';
  }

  setStanzaListener() {
    this.client.on('stanza', (stanza) => {
      if (stanza.is(constants.stanzaType.IQ)) {
        const stanzaJson = xml2json.toJson(stanza.root().toString(), { object: true });

        this.events.emit(stanzaJson.iq.id, { json: stanzaJson });
      } else if (stanza.is(constants.stanzaType.MESSAGE)) {
        const { message } = xml2json.toJson(stanza.root().toString(), { object: true });

        if (message.subject === 'file') {
          this.events.emit('file', {
            from: message.from,
            file: message.body,
            fileId: message.fileId,
            fileName: message.name,
            extension: message.extension,
          });
        } else if (message.body) {
          switch (message.type) {
            case constants.messageType.NORMAL:
            case constants.messageType.CHAT:
              this.events.emit('message', {
                from: message.from,
                message: message.body,
                groupChat: false,
              });
              this.events.emit(`message/${message.from.split('/')[0]}`, {
                from: message.from,
                message: message.body,
                groupChat: false,
              });
              break;
            case constants.messageType.GROUP:
              this.events.emit('groupMessage', {
                from: message.from.split('/')[1],
                room: message.from.split('/')[0],
                message: message.body,
                groupChat: true,
              });
              this.events.emit(`message/${message.from.split('/')[0]}`, {
                from: message.from.split('/')[1],
                room: message.from.split('/')[0],
                message: message.body,
                groupChat: true,
              });
              break;
            case constants.messageType.HEADLINE:
              this.events.emit('notification', {
                from: message.from,
                message: message.body,
              });
              break;
            default:
              this.events.emit(message.type, message);
              break;
          }
        }
      } else if (stanza.is(constants.stanzaType.PRESENCE)) {
        const { presence } = xml2json.toJson(stanza.root().toString(), { object: true });

        if (
          (presence.show && presence.from.split('/')[0] !== this.jid)
          || presence.type === constants.availabilityStatus.UNAVAILABLE
        ) {
          this.events.emit('presence', {
            from: presence.from,
            status: presence.show,
            message: presence.status,
            type: presence.type,
          });
        } else if (
          presence.type === constants.subscribeType.ACCEPT
          || presence.type === constants.subscribeType.DENY
          || presence.type === constants.subscribeType.REQUEST
        ) {
          this.events.emit('subscription', {
            from: presence.from,
            status: presence.show,
            message: presence.status,
            type: presence.type,
          });
        }
      }
    });
  }

  /**
   *
   * @param String show
   * @param String status
   */
  setStatus(show, status) {
    const presenceData = {
      presence: {
        show: { $t: show },
        status: { $t: status },
      },
    };

    this.client.send(xml2json.toXml(presenceData));
  }

  /**
   *
   * @param String username
   * @param String password
   * @returns
   */
  register(username, password) {
    return new Promise((resolve) => {
      const id = `register${Math.ceil(Math.random() * 99999)}`;
      const registerEvent = new EventEmitter();

      const client = new xmpp.Client({
        jid: `admin@${this.domain}`,
        password: '12345',
        host: this.domain,
        port: this.port,
      });

      client.on('online', () => {
        client.on('stanza', (stanza) => {
          if (stanza.is(constants.stanzaType.IQ)) {
            const stanzaJson = xml2json.toJson(stanza.root().toString(), { object: true });

            registerEvent.emit(stanzaJson.iq.id, { json: stanzaJson, stanza });
          }
        });

        const registryData = {
          iq: {
            type: constants.iqType.SET,
            id,
            to: this.domain,
            query: {
              xmlns: constants.namespace.REGISTER,
              username: {
                $t: username,
              },
              password: {
                $t: password,
              },
            },
          },
        };

        client.send(xml2json.toXml(registryData));

        registerEvent.on(id, ({ json }) => {
          client.end();
          resolve(JSON.stringify(json, null, ' '));
        });
      });
    });
  }

  deregister() {
    const id = `unregister${Math.ceil(Math.random() * 99999)}`;

    const deregisterData = {
      iq: {
        type: constants.iqType.SET,
        id,
        from: this.jid,
        to: this.domain,
        query: {
          xmlns: constants.namespace.REGISTER,
          remove: { $t: '' },
        },
      },
    };

    this.client.send(xml2json.toXml(deregisterData));
    this.clearClientData();
  }

  /**
   *
   * @param String to
   * @param String namespace
  */
  discovery(to, namespace) {
    return new Promise((resolve) => {
      const id = `discovery${Math.ceil(Math.random() * 99999)}`;
      const discoverQuery = {
        iq: {
          id,
          to,
          type: constants.iqType.GET,
          query: {
            xmlns: namespace,
          },
        },
      };

      this.client.send(xml2json.toXml(discoverQuery));

      this.events.once(id, ({ json }) => resolve(json));
    });
  }

  usersRoster() {
    return new Promise((resolve) => {
      const id = `roster${Math.ceil(Math.random() * 99999)}`;
      const rosterQuery = {
        iq: {
          from: this.jid,
          id,
          to: `search.${this.domain}`,
          type: constants.iqType.SET,
          query: {
            xmlns: 'jabber:iq:search',
            x: {
              xmlns: 'jabber:x:data',
              type: 'submit',
              field: [{
                type: 'hidden',
                var: 'FORM_TYPE',
                value: { $t: 'jabber:iq:search' },
              }, {
                var: 'Username',
                value: { $t: 1 },
              }, {
                var: 'search',
                value: { $t: '*' },
              }],
            },
          },
        },
      };

      this.client.send(xml2json.toXml(rosterQuery));

      this.events.once(id, ({ json: rooster }) => {
        resolve(rooster.iq.query.item);
      });
    });
  }

  contactRoster() {
    return new Promise((resolve) => {
      const id = `roster${Math.ceil(Math.random() * 99999)}`;
      const rosterQuery = {
        iq: {
          from: this.jid,
          id,
          to: this.jid,
          type: constants.iqType.GET,
          query: {
            xmlns: constants.namespace.ROSTER,
          },
        },
      };

      this.client.send(xml2json.toXml(rosterQuery));

      this.events.once(id, ({ json: rooster }) => {
        resolve(rooster.iq.query.item || []);
      });
    });
  }

  /**
   *
   * @param JID contactJid
   */
  addContact(contactJid) {
    const id = `addContact${Math.ceil(Math.random() * 99999)}`;
    const contactQuery = {
      iq: {
        id,
        from: this.jid,
        to: this.jid,
        type: constants.iqType.SET,
        query: {
          xmlns: constants.namespace.ROSTER,
          item: {
            jid: contactJid,
          },
        },
      },
    };

    this.client.send(xml2json.toXml(contactQuery));
    this.events.once('id', (data) => console.log(data));
    // this.subscribe(contactJid, constants.subscribeType.ACCEPT);
  }

  /**
   *
   * @param JID contactJid
   * @param String type
   */
  subscribe(contactJid, type) {
    const subscribeData = {
      presence: {
        to: contactJid,
        type,
      },
    };

    this.client.send(xml2json.toXml(subscribeData));
  }

  /**
   *
   * @param JID userToGet
   */
  getUserInfo(userToGet) {
    return new Promise((resolve) => {
      const id = `getUserInfo${Math.ceil(Math.random() * 99999)}`;
      const getInfoQuery = {
        iq: {
          id,
          from: this.jid,
          to: userToGet,
          type: constants.iqType.GET,
          vCard: {
            xmlns: constants.namespace.VCARD,
          },
        },
      };

      this.client.send(xml2json.toXml(getInfoQuery));

      this.events.once(id, ({ json }) => {
        delete json.iq.vCard.xmlns;
        resolve(json.iq.vCard);
      });
    });
  }

  /**
   *
   * @param Object dataToUpdate { nickname, bday=Birth Day,  fn=Full Name}
   * @returns
   */
  updateUserInfo(dataToUpdate) {
    return new Promise((resolve) => {
      const id = `updateData${Math.ceil(Math.random() * 99999)}`;
      this.nickname = dataToUpdate.nickname;

      const updateDataQuery = {
        iq: {
          id,
          from: this.jid,
          to: this.jid,
          type: constants.iqType.SET,
          vCard: {
            xmlns: constants.namespace.VCARD,
            ..._.mapValues(dataToUpdate, (value) => ({ $t: value })),
          },
        },
      };

      this.client.send(xml2json.toXml(updateDataQuery));

      this.events.once(id, ({ json: jsonResult }) => resolve(jsonResult));
    });
  }

  /**
   *
   * @param JID to
   * @param String file base64
   * @param String ext
   */
  sendFile(to, file, name, ext) {
    const fileId = `file${Math.ceil(Math.random() * 99999)}`;
    const messageData = {
      message: {
        from: this.jid,
        to,
        type: constants.messageType.CHAT,
        body: {
          $t: file,
        },
        fileId: {
          $t: fileId,
        },
        name: {
          $t: name,
        },
        extension: {
          $t: ext,
        },
        subject: { $t: 'file' },
      },
    };

    this.client.send(xml2json.toXml(messageData));
  }

  /**
   *
   * @param JID to
   * @param String message
   */
  sendMessage(to, message) {
    const messageData = {
      message: {
        from: this.jid,
        to,
        type: constants.messageType.CHAT,
        body: {
          $t: message,
        },
      },
    };

    this.client.send(xml2json.toXml(messageData));
  }

  /**
   *
   * @param JID to
   * @param String message
   */
  sendNotification(to, message) {
    const messageData = {
      message: {
        from: this.jid,
        to,
        type: constants.messageType.HEADLINE,
        body: {
          $t: message,
        },
      },
    };

    this.client.send(xml2json.toXml(messageData));
  }

  /**
   *
   * @param String to - Room Name
   * @param String message
   */
  sendGroupMessage(to, message) {
    const messageData = {
      message: {
        to: `${to}@conference.${this.domain}`,
        type: constants.messageType.GROUP,
        body: {
          $t: message,
        },
      },
    };

    this.joinToRoom(to);
    this.client.send(xml2json.toXml(messageData));
  }

  /**
   *
   * @param String room
   */
  joinToRoom(room) {
    const roomData = {
      presence: {
        from: this.jid,
        to: `${room}@conference.${this.domain}/${this.nickname}`,
        x: {
          xmlns: constants.namespace.CHAT_ROOMS,
        },
      },
    };

    this.client.send(xml2json.toXml(roomData));
  }
};
