module.exports = {
  availabilityStatus: {
    AVAILABLE: 'chat',
    DO_NOT_DISTURB: 'dnd',
    EXTENDED_AWAY: 'xa',
    SHORT_AWAY: 'away',
    UNAVAILABLE: 'unavailable',
  },
  stanzaType: {
    IQ: 'iq',
    MESSAGE: 'message',
    PRESENCE: 'presence',
  },
  messageType: {
    CHAT: 'chat',
    ERROR: 'error',
    GROUP: 'groupchat',
    HEADLINE: 'headline',
    NORMAL: 'normal',
  },
  chatStatus: {
    ACTIVE: 'active',
    COMPOSING: 'composing',
    GONE: 'gone',
    INACTIVE: 'inactive',
    PAUSED: 'paused',
    STARTING: 'starting',
  },
  namespace: {
    CHAT_ROOMS: 'http://jabber.org/protocol/muc',
    CHAT_STATES: 'http://jabber.org/protocol/chatstates',
    CLIENT: 'jabber:client',
    DISCOVERY_INFO: 'http://jabber.org/protocol/disco#info',
    DISCOVERY_ITEMS: 'http://jabber.org/protocol/disco#items',
    REGISTER: 'jabber:iq:register',
    ROSTER: 'jabber:iq:roster',
    VCARD: 'vcard-temp',
  },
  iqType: {
    ERROR: 'error',
    GET: 'get',
    RESULT: 'result',
    SET: 'set',
  },
  subscribeType: {
    ACCEPT: 'subscribed',
    DENY: 'unsubscribed',
    REQUEST: 'subscribe',
  },
  algorithm: {
    FLOOD: 'FLOOD',
    DISTANCE_VECTOR: 'DISTANCE_VECTOR',
    LINK_STATE: 'LINK_STATE',
  },
};
