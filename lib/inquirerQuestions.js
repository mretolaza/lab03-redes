const chalk = require('chalk');
const inquirer = require('inquirer');

const menuOptions = require('./menuOptions');

const {
  blue,
  green,
  red,
  yellow,
} = chalk;

module.exports = {
  connectedMenu: {
    name: 'selectedOption',
    type: 'rawlist',
    message: blue('Select an menu option'),
    choices: [
      new inquirer.Separator('----- TRAFFIC -----'),
      menuOptions.SEND_MESSAGE,
      menuOptions.VIEW_TRAFFIC,
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
  chatToListen: [{
    name: 'chatToListen',
    type: 'input',
    default: 'all',
    message: blue('Which chat you want to view?'),
  }, {
    name: 'groupChat',
    type: 'confirm',
    default: false,
    message: blue('Is group chat?'),
  }],
  exit: {
    name: 'exit',
    type: 'input',
    default: '',
    message: chalk.yellow.bold('Write exit to return to Menu'),
  },
  messageInfo: [{
    name: 'to',
    type: 'input',
    message: blue('Who do you want to write to'),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter username or room');
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
  }],
  username: {
    name: 'username',
    type: 'input',
    message: blue('Give me the username'),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter username');
    },
  },
  room: {
    name: 'room',
    type: 'input',
    message: blue('Which room would you like to join?'),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter room name');
    },
  },
  updateUserInfo: [{
    name: 'fn',
    type: 'input',
    message: blue('Full name'),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter your full name');
    },
  }, {
    name: 'bday',
    type: 'input',
    message: blue('Birthday'),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter your birthday');
    },
  }, {
    name: 'nickname',
    type: 'input',
    message: blue('Nickname'),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter your nickname');
    },
  }],
  confirm: (message) => ({
    name: 'confirmResult',
    type: 'confirm',
    message: blue(message),
    default: true,
  }),
  subscriptionList: () => ({
    name: 'subscriptionToManage',
    type: 'rawlist',
    message: chalk.blue('Manage subscription request'),
    choices: global.subscriptions.map(
      (subscription) => ({
        name: `${yellow(subscription.from)} wants to ${subscription.type === 'subscribe' ? green('add you as contact') : red('delete you from contacts')}`,
        value: subscription.from,
      }),
    ),
    validate(value) {
      if (value.length) {
        return true;
      }
      return chalk.red('Please select one request');
    },
  }),
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
  fileName: {
    name: 'fileName',
    type: 'input',
    message: blue('What do you want to name the file?'),
    validate(value) {
      if (value.length) {
        return true;
      }
      return red('Please enter the file name');
    },
  },
  fileList: () => ({
    name: 'fileId',
    type: 'rawlist',
    message: chalk.blue('Received files'),
    choices: global.files.map(
      (file) => ({
        name: `${yellow(file.from.split('/')[0])} sent ${green(file.fileName)}`,
        value: file.fileId,
      }),
    ),
    validate(value) {
      if (value.length) {
        return true;
      }
      return chalk.red('Please select one file to get');
    },
  }),
};
