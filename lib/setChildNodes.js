const updateNode = require('./updateNode')

/**
 * @param {*|Element} nodeA
 * @param {*|Element} nodeB
 * @param {{}} [options]
 */
function setChildNodes(nodeA, nodeB, options) {
  const {
    nodeWillMount,
    nodeDidMount,
    nodeWillUnmount,
    nodeDidUnmount,
  } = options
  const childNodesA = Array.from(nodeA.childNodes)
  const childNodesB = Array.from(nodeB.childNodes)
  const length = Math.max(childNodesA.length, childNodesB.length)
  let i, childA, childB
  for(i = 0; i < length; i++) {
    childA = childNodesA[i]
    childB = childNodesB[i]
    if(!childA) {
      if(nodeWillMount?.(childB) !== false) {
        nodeA.append(childB)
        nodeDidMount?.(childB)
      }
      continue
    }
    if(!childB) {
      if(nodeWillUnmount?.(childA) !== false) {
        childA.remove()
        nodeDidUnmount?.(childA)
      }
      continue
    }
    updateNode(childA, childB, options)
  }
}

module.exports = setChildNodes
