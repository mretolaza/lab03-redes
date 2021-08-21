const inquirer = require('inquirer');
const chalk = require('chalk');

// Questions
const questions = require('../lib/inquirerQuestions');

const messageIn = (message) => {
  const from = message.groupChat ? message.from : message.from.split('/')[0];
  console.log(`
    ${chalk.red('>')} ${chalk.blue(from)} says: ${chalk.yellow.bold(message.message)} ${message.groupChat ? `on ${chalk.green(message.room.split('@')[0])}` : ''}`);
};

module.exports.viewMessages = (xmppClient) => new Promise((resolve) => {
  inquirer
    .prompt(questions.chatToListen)
    .then(({ chatToListen }) => {
      console.log(chalk.yellow.bold('OFFLINE MESSAGES'));
      global.offlineMessages.forEach(messageIn);

      console.log(chalk.yellow.bold('REALTIME MESSAGES'));

      inquirer.prompt(questions.exit).then(() => {
        xmppClient.events.off('message', messageIn);
        xmppClient.events.off('groupMessage', messageIn);
        xmppClient.events.off(
          'message',
          messageIn,
        );
        global.offlineMessages = [];

        resolve();
      });

      if (chatToListen === 'all') {
        xmppClient.events.on('message', messageIn);
        xmppClient.events.on('groupMessage', messageIn);
      }
    });
});

module.exports.viewNotifications = () => new Promise((resolve) => {
  console.log(chalk.yellow.bold('NOTIFICATIONS'));
  console.log();

  if (global.notifications.length === 0) {
    console.log(chalk.yellow.bold('There are no new notifications'));
    inquirer.prompt(questions.pressAnyKey).then(resolve);
    return;
  }

  global.notifications.forEach(messageIn);
  global.notifications = [];
  inquirer.prompt(questions.pressAnyKey).then(resolve);
});
