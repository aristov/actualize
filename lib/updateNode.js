const setAttrs = require('./setAttrs')
const setChildren = require('./setChildren')

function updateNode(nodeA, nodeB, options) {
  const {
    nodeWillUpdate,
    nodeDidUpdate,
    childrenWillUpdate,
    childrenDidUpdate,
  } = options
  nodeWillUpdate?.(nodeA, nodeB)
  setAttrs(nodeA, nodeB, options)
  nodeDidUpdate?.(nodeA)
  childrenWillUpdate?.(nodeA, nodeB)
  setChildren(nodeA, nodeB, options)
  childrenDidUpdate?.(nodeA)
}

module.exports = updateNode
