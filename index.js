const inquirer = require('inquirer');
const {
  blue,
  green,
  yellow,
} = require('chalk');

// questions
const questions = require('./lib/inquirerQuestions');

// menu
const menu = require('./lib/menu');

// Classes
const XmppClient = require('./classes/XmppClient');

// Handler
const algorithmHandler = require('./handlers/algorithm');
const algorithmLS = require('./handlers/link_state_sm');

// Utils
const { getNodeName } = require('./utils/node');

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

const config = JSON.parse(fs.readFileSync('routesTable.json'));
global.config.routes = config.routes;


inquirer
  .prompt(questions.serverInfo)
  .then(({ domain, port, host }) => {
    global.xmppClient = new XmppClient(domain, port, host);

    global.xmppClient.events.on('groupMessage', (message) => {
      const node = JSON.parse(message.message);

      const nodeIndex = global.nodes.findIndex((x) => x.node === node.node);

      if (nodeIndex >= 0) {
        global.nodes.splice(nodeIndex, 1);
      }

      global.nodes.push(node);
    });

    global.xmppClient.events.on('message', async (message) => {
      const fromJid = message.from.split('/')[0];
      const messageData = JSON.parse(message.message);

      if (messageData.from === global.config.node) {
        // Saved received message to me
        messageData.receivedDate = new Date();
        global.receivedMessages.push(messageData);
      } else {
        // Broadcast message
        let broadcastedTo = [];

        switch (messageData.algorithm) {
          case 'FLOOD':
            broadcastedTo = await algorithmHandler.flood(fromJid, messageData);
            break;
          case 'LINK_STATE':
            await algorithmLS.sendMessageLS(messageData)
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

        console.log('\n\n', green('--- NEW MESSAGE ---'));
        console.log(`${blue('From')}           > ${yellow(messageData.from)}`);
        console.log(`${blue('To')}             > ${yellow(messageData.to)}`);
        console.log(`${blue('Message')}        > ${yellow(messageData.message)}`);
        console.log(`${blue('Received from')}  > ${yellow(getNodeName(fromJid))}`);
        console.log(`${blue('Broadcasted to')} > ${yellow(broadcastedTo.map((node) => `node: ${node.node} length: ${node.length}`).join('\n'))}`);
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
