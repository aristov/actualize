(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["actualize"] = factory();
	else
		root["actualize"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @module actualize
 * @author Vyacheslav Aristov <vv.aristov@gmail.com>
 * @see {@link https://github.com/aristov/actualize}
 */
module.exports = __webpack_require__(1)


/***/ }),
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const setChildren = __webpack_require__(2)
const updateNode = __webpack_require__(5)

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


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = setChildren // avoiding empty exports for circular dependency

const getKeyIndex = __webpack_require__(3)
const setChildNodes = __webpack_require__(4)
const updateNode = __webpack_require__(5)

const { indexOf } = Array.prototype

/**
 * @param {*|Element} nodeA
 * @param {*|Element} nodeB
 * @param {{}} [options]
 */
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
      if(nodeWillUnmount?.(childA) !== false) {
        childA.remove()
        nodeDidUnmount?.(childA)
      }
    }
    childA = nextA
  }
  for(i = 0; i < childrenB.length; i++) {
    childB = childrenB[i]
    childA = indexA[getKey(childB)]
    if(childA) {
      continue
    }
    nextA = nodeA.children[i]
    if(nodeWillMount?.(childB) === false) {
      continue
    }
    if(nextA) {
      nextA.before(childB)
    }
    else nodeA.append(childB)
    nodeDidMount?.(childB)
  }
  for(i = 0; i < childrenB.length; i++) {
    childB = childrenB[i]
    childA = indexA[getKey(childB)]
    if(!childA) {
      continue
    }
    j = indexOf.call(nodeA.children, childA)
    if(i === j) {
      updateNode(childA, childB, options)
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


/***/ }),
/* 3 */
/***/ ((module) => {

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


/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const updateNode = __webpack_require__(5)

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


/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const setAttrs = __webpack_require__(6)
const setChildren = __webpack_require__(2)

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


/***/ }),
/* 6 */
/***/ ((module) => {

/**
 * @param {*|Element} nodeA
 * @param {*|Element} nodeB
 */
function setAttrs(nodeA, nodeB) {
  const names = new Set
  let attr, value
  for(attr of nodeA.attributes) {
    names.add(attr.name)
    value = nodeB.getAttribute(attr.name)
    if(value === null) {
      nodeA.removeAttribute(attr.name)
      continue
    }
    if(attr.value !== value) {
      attr.value = value
    }
  }
  for(attr of nodeB.attributes) {
    if(!names.has(attr.name)) {
      nodeA.setAttribute(attr.name, attr.value)
    }
  }
  switch(nodeA.tagName) {
    case 'OPTION':
      nodeA.selected = nodeB.selected
      break
    case 'INPUT':
      nodeA.checked = nodeB.checked
      nodeA.indeterminate = nodeB.indeterminate
    case 'TEXTAREA':
      nodeA.value = nodeB.value
  }
}

module.exports = setAttrs


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});