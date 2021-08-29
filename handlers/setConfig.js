const chalk = require('chalk');
const fs = require('fs');
const inquirer = require('inquirer');

// Questions
const questions = require('../lib/inquirerQuestions');

const fileUtils = require('../utils/files');

module.exports = () => new Promise((resolve) => {
  inquirer
    .prompt(questions.filePath)
    .then(async ({ filePath }) => {
      if (!fileUtils.exits(filePath)) {
        console.log(chalk.yellow('File does not exists'));
        await inquirer.prompt(questions.pressAnyKey);
        return resolve(true);
      }

      if (fileUtils.getExtension(filePath) !== '.json') {
        console.log(chalk.yellow('The file should be JSON'));
        await inquirer.prompt(questions.pressAnyKey);
        return resolve(true);
      }

      let config = {};
      try {
        config = JSON.parse(fs.readFileSync(filePath));
      } catch (err) {
        console.log(chalk.red('Error on JSON, verify your file'));
        await inquirer.prompt(questions.pressAnyKey);
        return resolve(true);
      }

      global.config.routes = config.routes;

      console.log(chalk.yellow('Configuration loaded successfully'));
      await inquirer.prompt(questions.pressAnyKey);
      return resolve(true);
    });
});
