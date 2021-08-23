const inquirer = require('inquirer');

// questions
const questions = require('./lib/inquirerQuestions');

// menu
const menu = require('./lib/menu');

// Classes
const XmppClient = require('./classes/XmppClient');

// Handler
const algorithmHandler = require('./handlers');

// config
global.config = {
  node: '',
};
global.nodes = [];
global.broadcastedMessages = [];
global.receivedMessages = [];

// TODO remove default config
// eslint-disable-next-line import/order
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/k3v1n/Desktop/M&M/Redes/routing-simulator/routesTable.json'));
global.config.routes = config.routes;

inquirer
  .prompt(questions.serverInfo)
  .then(({ domain, port }) => {
    global.xmppClient = new XmppClient(domain, port);

    global.xmppClient.events.on('groupMessage', (message) => {
      const node = JSON.parse(message.message);
      console.log(node);

      const nodeIndex = global.nodes.findIndex((x) => x.node === node.node);

      if (nodeIndex >= 0) {
        global.nodes.splice(nodeIndex, 1);
      }

      global.nodes.push(node);
    });

    global.xmppClient.events.on('message', (message) => {
      const messageData = JSON.parse(message.message);

      if (messageData.from === global.config.node) {
        // Saved received message to me
        messageData.receivedDate = new Date();
        global.receivedMessages.push(messageData);
      } else {
        // Broadcast message
        messageData.route.push(global.config.node);
        let broadcastedTo = [];

        switch (messageData.algorithm) {
          case 'FLOOD':
            broadcastedTo = algorithmHandler.flood(messageData);
            break;
          default:
            console.log(messageData.algorithm);
            broadcastedTo = [];
            break;
        }

        global.broadcastedMessages.push({
          messageReceived: messageData,
          broadcastedTo,
        });
      }
    });
    menu();
  });

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err);
});

process.on('uncaughtRejection', (err) => {
  console.error('Unhandled Rejection', err);
});
