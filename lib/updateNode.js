const setAttrs = require('./setAttrs')
const setChildren = require('./setChildren')

const ELEMENT_NODE = 1
const TEXT_NODE = 3

/**
 * @param {*|Node} nodeA
 * @param {*|Node} nodeB
 * @param {{}} [options]
 * @retuns {Node}
 */
function updateNode(nodeA, nodeB, options) {
  const {
    getKey,
    nodeWillMount,
    nodeDidMount,
    nodeWillUnmount,
    nodeDidUnmount,
    nodeWillUpdate,
    nodeDidUpdate,
    childrenWillUpdate,
    childrenDidUpdate,
  } = options
  if(nodeA.nodeType === TEXT_NODE && nodeB.nodeType === TEXT_NODE) {
    if(nodeA.data !== nodeB.data) {
      if(nodeWillUpdate?.(nodeA, nodeB) !== false) {
        nodeA.data = nodeB.data
        nodeDidUpdate?.(nodeA, nodeB)
      }
    }
    return nodeA
  }
  if(nodeA.nodeType === ELEMENT_NODE && nodeB.nodeType === ELEMENT_NODE) {
    if(nodeA.tagName === nodeB.tagName && getKey(nodeA) === getKey(nodeB)) {
      if(nodeWillUpdate?.(nodeA, nodeB) !== false) {
        setAttrs(nodeA, nodeB)
        nodeDidUpdate?.(nodeA, nodeB)
      }
      if(childrenWillUpdate?.(nodeA, nodeB) !== false) {
        setChildren(nodeA, nodeB, options)
        childrenDidUpdate?.(nodeA, nodeB)
      }
      return nodeA
    }
  }
  if(nodeWillUnmount?.(nodeA) === false || nodeWillMount?.(nodeB) === false) {
    return nodeA
  }
  nodeA.replaceWith(nodeB)
  nodeDidUnmount?.(nodeA)
  nodeDidMount?.(nodeB)
  return nodeB
}

module.exports = updateNode
