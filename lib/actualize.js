const setChildren = require('./setChildren')
const updateNode = require('./updateNode')

const getNodeId = node => node.id

/**
 * @param {*|Element} nodeA
 * @param {*|Element} nodeB
 * @param {{}} [options]
 * @param {boolean} [options.childrenOnly]
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
function actualize(nodeA, nodeB, options = {}) {
  if(!options.getKey) {
    options.getKey = getNodeId
  }
  if(options.childrenOnly) {
    setChildren(nodeA, nodeB, options)
    return nodeA
  }
  return updateNode(nodeA, nodeB, options)
}

module.exports = actualize
