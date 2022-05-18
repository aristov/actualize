const deep = require('./deep')
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
      nodeWillMount?.(childB)
      nodeA.append(childB)
      deep(childB, nodeDidMount)
      continue
    }
    if(!childB) {
      nodeWillUnmount?.(childA)
      childA.remove()
      deep(childA, nodeDidUnmount)
      continue
    }
    updateNode(childA, childB, options)
  }
}

module.exports = setChildNodes
