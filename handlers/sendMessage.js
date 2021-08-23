const inquirer = require('inquirer');
const chalk = require('chalk');

// Questions
const questions = require('../lib/inquirerQuestions');
const constants = require('../constants');

// Utils
const nodeUtils = require('../utils/node');

module.exports = () => new Promise((resolve) => {
  inquirer
    .prompt(questions.messageInfo())
    .then(async ({ message, to, algorithm }) => {
      const nodeRoute = global.config.routes.find(
        (x) => x.node === global.config.node,
      );

      if (!nodeRoute) {
        console.log(chalk.red('Node not exists on route table'));
        await inquirer.prompt(questions.pressAnyKey);
        return resolve(true);
      }

      const messageData = {
        from: global.config.node,
        to,
        message,
        route: [],
        algorithm,
        sendedDate: new Date(),
        extraData: {},
      };

      // Send message by flood
      if (algorithm === constants.algorithm.FLOOD) {
        messageData.extraData = await inquirer.prompt(questions.graphDiameter);

        nodeRoute.neighbor.forEach((neighbor) => {
          messageData.route = [neighbor];
          const toJID = nodeUtils.getNodeJid(neighbor.node);

          if (toJID) {
            global.xmppClient
              .sendMessage(toJID, JSON.stringify(messageData));
          } else {
            console.log(chalk.red(`Node ${neighbor.node} is not active yet`));
          }
        });
      }

      console.log(chalk.yellow('Message sent successfully'));
      await inquirer.prompt(questions.pressAnyKey);
      return resolve(true);
    });
});
