const chalk = require('chalk');

// Utils
const nodeUtils = require('../utils/node');

module.exports.sendMessageLS = async (linkStateRoute, Message) => {

  linkStateRoute = Message.linkstate

  if (linkStateRoute.length == 0) {
    console.log(Message)
    return
  }

  const nextNode = linkStateRoute[0];

  toJID = nodeUtils.getNodeJid(nextNode);

  linkStateRoute = Array.prototype.slice.call(linkStateRoute.indexOf(nextNode), 1);

  Message.linkstate = linkStateRoute
  
  if (toJID) {
    global.xmppClient
      .sendMessage(toJID, JSON.stringify(Message));
  } else {
    console.log(chalk.red(`Node ${nextNode} is not active yet`));
  }

};