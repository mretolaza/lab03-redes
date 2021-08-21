const inquirer = require('inquirer');
const chalk = require('chalk');

// Questions
const questions = require('../lib/inquirerQuestions');

const login = (resolve) => {
  inquirer
    .prompt(questions.userInfo)
    .then(({ username, password, node }) => {
      global.xmppClient.connect(username, password)
        .then(async () => {
          global.config.node = node;

          global.xmppClient
            .sendGroupMessage('nodes', JSON.stringify({
              node,
              JID: global.xmppClient.jid,
            }));
          console.log(chalk.yellow('User is connected'));

          await inquirer.prompt(questions.pressAnyKey);
          resolve();
        });
    });
};

module.exports = () => new Promise((resolve) => {
  global.xmppClient.events.on('error', () => {
    console.log(chalk.red('Username or password incorrect'));
    login(resolve);
  });

  login(resolve);
});
