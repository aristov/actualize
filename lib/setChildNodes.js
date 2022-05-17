const deep = require('./deep')
const updateNode = require('./updateNode')

const TEXT_NODE = 3

/**
 * @param {*|Element} nodeA
 * @param {*|Element} nodeB
 * @param {{}} [options]
 */
function setChildNodes(nodeA, nodeB, options) {
  const {
    getKey,
    nodeWillMount,
    nodeDidMount,
    nodeWillUpdate,
    nodeDidUpdate,
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
    if(childA.nodeType === TEXT_NODE && childB.nodeType === TEXT_NODE) {
      if(childA.data !== childB.data) {
        nodeWillUpdate?.(childA, childB)
        childA.data = childB.data
        nodeDidUpdate?.(childA)
      }
      continue
    }
    if(childA.nodeType === childB.nodeType && childA.tagName === childB.tagName) {
      if(getKey(childA) === getKey(childB)) {
        updateNode(childA, childB, options)
        continue
      }
    }
    nodeWillUnmount?.(childA)
    nodeWillMount?.(childB)
    childA.replaceWith(childB)
    deep(childA, nodeDidUnmount)
    deep(childB, nodeDidMount)
  }
}

module.exports = setChildNodes
