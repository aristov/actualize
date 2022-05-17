const setAttrs = require('./setAttrs')
const setChildren = require('./setChildren')

/**
 * @param {*|Element} nodeA
 * @param {*|Element} nodeB
 * @param {{}} [options]
 */
function updateNode(nodeA, nodeB, options) {
  const {
    nodeWillUpdate,
    nodeDidUpdate,
    childrenWillUpdate,
    childrenDidUpdate,
  } = options
  nodeWillUpdate?.(nodeA, nodeB)
  setAttrs(nodeA, nodeB)
  nodeDidUpdate?.(nodeA)
  childrenWillUpdate?.(nodeA, nodeB)
  setChildren(nodeA, nodeB, options)
  childrenDidUpdate?.(nodeA)
}

module.exports = updateNode
