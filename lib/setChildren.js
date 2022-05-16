module.exports = setChildren // avoiding empty exports for circular dependency

const deep = require('./deep')
const getKeyIndex = require('./getKeyIndex')
const setChildNodes = require('./setChildNodes')
const updateNode = require('./updateNode')

const { indexOf } = Array.prototype

function setChildren(nodeA, nodeB, options) {
  const indexA = getKeyIndex(nodeA, options.getKey)
  const indexB = getKeyIndex(nodeB, options.getKey)
  if(!indexA || !indexB) {
    setChildNodes(nodeA, nodeB, options)
    return
  }
  const {
    getKey,
    nodeWillMount,
    nodeDidMount,
    nodeWillUnmount,
    nodeDidUnmount,
  } = options
  const childrenB = Array.from(nodeB.children)
  let childA = nodeA.firstElementChild
  let childB, nextA, i, j
  while(childA) {
    nextA = childA.nextElementSibling
    if(!indexB[getKey(childA)]) {
      nodeWillUnmount?.(childA)
      childA.remove()
      deep(childA, nodeDidUnmount)
    }
    childA = nextA
  }
  for(i = 0; i < childrenB.length; i++) {
    childB = childrenB[i]
    childA = indexA[getKey(childB)]
    if(childA) {
      updateNode(childA, childB, options)
      continue
    }
    nextA = nodeA.children[i]
    nodeWillMount?.(childB)
    if(nextA) {
      nextA.before(childB)
    }
    else nodeA.append(childB)
    deep(childB, nodeDidMount)
  }
  for(i = 0; i < childrenB.length; i++) {
    childB = childrenB[i]
    childA = indexA[getKey(childB)]
    if(!childA) {
      continue
    }
    j = indexOf.call(nodeA.children, childA)
    if(i === j) {
      continue
    }
    nextA = nodeA.children[i].nextElementSibling
    if(nextA) {
      if(childA !== nextA && childA.nextElementSibling !== nextA) {
        nextA.before(childA)
      }
    }
    else nodeA.append(childA)
    updateNode(childA, childB, options)
  }
}
