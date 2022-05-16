const setChildren = require('./setChildren')
const updateNode = require('./updateNode')

const getNodeId = node => node.id

function actualize(nodeA, nodeB, options = {}) {
  options.getKey ??= getNodeId
  if(options.childrenOnly) {
    setChildren(nodeA, nodeB, options)
    return nodeA
  }
  updateNode(nodeA, nodeB, options)
  return nodeA
}

module.exports = actualize
