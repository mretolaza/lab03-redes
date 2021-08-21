const inquirer = require('inquirer');

// questions
const questions = require('./lib/inquirerQuestions');

// menu
const menu = require('./lib/menu');

// Classes
const XmppClient = require('./classes/XmppClient');

// config
global.config = {
  node: '',
};
global.nodes = [];

// TODO remove default config
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
    menu();
  });

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err);
});

process.on('uncaughtRejection', (err) => {
  console.error('Unhandled Rejection', err);
});
