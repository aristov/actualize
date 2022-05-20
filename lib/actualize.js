const setChildren = require('./setChildren')
const updateNode = require('./updateNode')

const getNodeId = node => node.id

/**
 * @param {*|Node} treeA node for updating
 * @param {*|Node} treeB node to which `treeA` should be updated
 * @param {{}} [options] actualize options
 * @param {boolean} [options.childrenOnly] Update only the child nodes of the `treeA`, the element itself will be skipped. The default value is `false`.
 * @param {function} [options.getKey] Called to get a custom key of the node in a child list.  The default value is `node.id`.
 * @param {function} [options.nodeWillMount] Called before a node from the `B` tree is mounted to the `A` tree.
 * @param {function} [options.nodeDidMount] Called after a node from the `B` tree has been mounted to the `A` tree.
 * @param {function} [options.nodeWillUnmount] Called before a node in the `A` tree is unmounted.
 * @param {function} [options.nodeDidUnmount] Called after a node in the `A` tree has been unmounted.
 * @param {function} [options.nodeWillUpdate] Called before updating a node in the `A` tree.
 * @param {function} [options.nodeDidUpdate] Called after updating a node in the `A` tree.
 * @param {function} [options.childrenWillUpdate] Called before updating the child nodes of an element in the `A` tree.
 * @param {function} [options.childrenDidUpdate] Called after updating the child nodes of an element in the `A` tree.
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
