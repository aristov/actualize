const setChildren = require('./setChildren')
const updateNode = require('./updateNode')

const getNodeId = node => node.id

/**
 * @param {*|Element} treeA
 * @param {*|Element} treeB
 * @param {{}} [options]
 * @param {boolean} [options.childrenOnly]
 * @param {function} [options.getKey]
 * @param {function} [options.nodeWillUpdate]
 * @param {function} [options.nodeDidUpdate]
 * @param {function} [options.childrenWillUpdate]
 * @param {function} [options.childrenDidUpdate]
 * @param {function} [options.nodeWillMount]
 * @param {function} [options.nodeDidMount]
 * @param {function} [options.nodeWillUnmount]
 * @param {function} [options.nodeDidUnmount]
 * @return {Element}
 */
function actualize(treeA, treeB, options = {}) {
  if(!options.getKey) {
    options.getKey = getNodeId
  }
  if(options.childrenOnly) {
    setChildren(treeA, treeB, options)
    return treeA
  }
  return updateNode(treeA, treeB, options)
}

module.exports = actualize
