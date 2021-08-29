module.exports.getNodeJid = (node) => {
  const nodeFound = global.nodes.find((x) => x.node === node);

  return nodeFound ? nodeFound.JID : nodeFound;
};

module.exports.getNodeName = (jid) => {
  const nodeFound = global.nodes.find((x) => x.JID === jid);

  return nodeFound ? nodeFound.node : nodeFound;
};
