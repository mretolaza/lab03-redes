const chalk = require('chalk');
const inquirer = require('inquirer');
const constants = require('../constants');

const menuOptions = require('./menuOptions');

const {
  blue,
  green,
  red,
  yellow,
} = chalk;

module.exports = {
  configuredMenu: {
    name: 'selectedOption',
    type: 'rawlist',
    message: blue('Select an menu option'),
    choices: [
      new inquirer.Separator('----- TRAFFIC -----'),
      menuOptions.SEND_MESSAGE,
      menuOptions.VIEW_TRAFFIC,
    ],
  },
  connectedMenu: {
    name: 'selectedOption',
    type: 'rawlist',
    message: blue('Select an menu option'),
    choices: [
      new inquirer.Separator('----- CONFIGURATION -----'),
      menuOptions.SET_CONFIG,
    ],
  },
  disconnectedMenu: {
    name: 'selectedOption',
    type: 'rawlist',
    message: blue('Select an menu option'),
    choices: [
      menuOptions.LOGIN,
      menuOptions.EXIT,
    ],
  },
  userInfo: [{
    name: 'username',
    type: 'input',
    message: blue('Enter your username'),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter your username');
    },
  }, {
    name: 'password',
    type: 'password',
    message: blue('Enter your password'),
    default: '12345',
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter your password.');
    },
  }, {
    name: 'node',
    type: 'input',
    message: blue('Enter the node name'),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter the node.');
    },
  }],
  serverInfo: [{
    name: 'domain',
    type: 'input',
    default: 'alumchat.xyz',
    message: blue('Enter the server domain'),
  }, {
    name: 'host',
    type: 'input',
    default: 'alumchat.xyz',
    message: blue('Enter the host '),
  }, {
    name: 'port',
    type: 'input',
    default: '5222',
    message: blue('Enter the server port'),
  }],
  pressAnyKey: {
    name: 'anyKey',
    type: 'input',
    default: '',
    message: red('Press any key to continue'),
  },
  exit: {
    name: 'exit',
    type: 'input',
    default: '',
    message: chalk.yellow.bold('Write exit to return to Menu'),
  },
  messageInfo: () => [{
    name: 'to',
    type: 'rawlist',
    message: blue('Who do you want to write to'),
    choices: global.config.routes.map((route) => route.node),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter node');
    },
  }, {
    name: 'message',
    type: 'input',
    message: blue('What yo want to say?'),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter your message.');
    },
  }, {
    name: 'algorithm',
    type: 'rawlist',
    message: blue('What algorithm you want to use?'),
    choices: [{
      name: yellow('Flood'),
      value: constants.algorithm.FLOOD,
    }, {
      name: yellow('Distance Vector'),
      value: constants.algorithm.DISTANCE_VECTOR,
    }, {
      name: yellow('Link State'),
      value: constants.algorithm.LINK_STATE,
    }],
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please select a option.');
    },
  }],
  filePath: {
    name: 'filePath',
    type: 'input',
    message: blue('Where is the route table file?'),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter a valid file path');
    },
  },
  graphDiameter: {
    name: 'graphDiameter',
    type: 'number',
    message: blue('What is the graph diameter?'),
    validate(value) {
      if (value > 0) {
        return true;
      }
      return red('Please enter a valid diameter');
    },
  },
};
