/* eslint-disable no-process-exit */
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');

// question
const questions = require('./inquirerQuestions');
const menuOption = require('./menuOptions');

// handlers
const {
  login,
  sendMessage,
  setConfig,
} = require('../handlers');

const menu = () => {
  clear();

  console.log(
    chalk.yellow(
      figlet.textSync('ROUTING SIMULATOR', { horizontalLayout: 'full' }),
    ),
  );

  if (!global.xmppClient.connected) {
    inquirer
      .prompt(questions.disconnectedMenu)
      .then(async ({ selectedOption }) => {
        switch (selectedOption) {
          case menuOption.LOGIN:
            clear();
            await login();
            console.log('USER LOGGED IN');
            menu();
            break;
          case menuOption.EXIT:
            console.log(chalk.yellow('Bye bye!!!'));
            process.exit();
          default:
            console.log('Wrong option');
            break;
        }
      });
  } else if (global.config.routes && global.config.routes.length > 0) {
    inquirer
      .prompt(questions.configuredMenu)
      .then(async ({ selectedOption }) => {
        switch (selectedOption) {
          case menuOption.SEND_MESSAGE:
            clear();
            await sendMessage();
            menu();
            break;
          default:
            console.log('Wrong option');
            break;
        }
      });
  } else {
    inquirer
      .prompt(questions.connectedMenu)
      .then(async ({ selectedOption }) => {
        switch (selectedOption) {
          case menuOption.SET_CONFIG:
            clear();
            await setConfig();
            menu();
            break;
          default:
            console.log('Wrong option');
            break;
        }
      });
  }
};

module.exports = menu;
