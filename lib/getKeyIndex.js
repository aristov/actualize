const ELEMENT_NODE = 1

/**
 * @param {Node} node
 * @param {function} getKey
 * @return {{}|null}
 */
function getKeyIndex(node, getKey) {
  const index = {}
  let child, key
  for(child of node.childNodes) {
    if(child.nodeType !== ELEMENT_NODE) {
      return null
    }
    key = getKey(child)
    if(!key) {
      return null
    }
    index[key] = child
  }
  return index
}

module.exports = getKeyIndex
