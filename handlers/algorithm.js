const chalk = require('chalk');

// Utils
const nodeUtils = require('../utils/node');

module.exports.flood = async (from, messageData) => {
  const nodeRoute = global.config.routes.find(
    (x) => x.node === global.config.node,
  );
  const broadcastedTo = [];

  if (!nodeRoute) {
    console.log(chalk.red('Node not exists on route table'));
    return [];
  }

  if (
    messageData.extraData.graphDiameter >= messageData.route.length
    && messageData.to !== global.config.node
  ) {
    nodeRoute.neighbor.forEach((neighbor) => {
      const toJID = nodeUtils.getNodeJid(neighbor.node);

      if (toJID !== from) {
        messageData.route.push(neighbor);

        if (toJID) {
          broadcastedTo.push(neighbor);
          global.xmppClient
            .sendMessage(toJID, JSON.stringify(messageData));
        } else {
          console.log(chalk.red(`Node ${neighbor.node} is not active yet`));
        }
      }
    });
  }

  return broadcastedTo;
};
