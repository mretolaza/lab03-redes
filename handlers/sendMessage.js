const inquirer = require('inquirer');
const chalk = require('chalk');

// Questions
const questions = require('../lib/inquirerQuestions');

const sendMessage = (xmppClient, message, to, groupChat, notification) => {
  const toJID = '';

  if (notification) {
    xmppClient
      .sendNotification(toJID, message);
  } else if (groupChat) {
    xmppClient
      .sendGroupMessage(to, message);
  } else {
    xmppClient
      .sendMessage(toJID, message);
  }
};

module.exports = (xmppClient, groupChat, notification = false) => new Promise((resolve) => {
  inquirer
    .prompt(questions.messageInfo)
    .then(async ({ message, to }) => {
      sendMessage(xmppClient, message, to, groupChat, notification);

      console.log(chalk.yellow('Message sent successfully'));
      await inquirer.prompt(questions.pressAnyKey);
      resolve(true);
    });
});
