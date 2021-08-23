module.exports.getNodeJid = (node) => {
  const nodeFound = global.nodes.find((x) => x.node === node);

  return nodeFound ? nodeFound.JID : nodeFound;
};
