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
const updateNode = __webpack_require__(6)

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
  options.getKey ??= getNodeId
  if(options.childrenOnly) {
    setChildren(nodeA, nodeB, options)
    return nodeA
  }
  return updateNode(nodeA, nodeB, options)
}

module.exports = actualize


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = setChildren // avoiding empty exports for circular dependency

const deep = __webpack_require__(3)
const getKeyIndex = __webpack_require__(4)
const setChildNodes = __webpack_require__(5)
const updateNode = __webpack_require__(6)

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


/***/ }),
/* 3 */
/***/ ((module) => {

/**
 * @param {*|Node} node
 * @param {function} [handler]
 */
function deep(node, handler) {
  if(!handler) {
    return
  }
  handler(node)
  if(!node.children) {
    return
  }
  for(const child of node.children) {
    deep(child, handler)
  }
}

module.exports = deep


/***/ }),
/* 4 */
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
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const deep = __webpack_require__(3)
const updateNode = __webpack_require__(6)

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


/***/ }),
/* 6 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const setAttrs = __webpack_require__(7)
const setChildren = __webpack_require__(2)
const deep = __webpack_require__(3)

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
      nodeWillUpdate?.(nodeA, nodeB)
      nodeA.data = nodeB.data
      nodeDidUpdate?.(nodeA)
    }
    return nodeA
  }
  if(nodeA.nodeType === ELEMENT_NODE && nodeB.nodeType === ELEMENT_NODE) {
    if(nodeA.tagName === nodeB.tagName && getKey(nodeA) === getKey(nodeB)) {
      nodeWillUpdate?.(nodeA, nodeB)
      setAttrs(nodeA, nodeB)
      nodeDidUpdate?.(nodeA)
      childrenWillUpdate?.(nodeA, nodeB)
      setChildren(nodeA, nodeB, options)
      childrenDidUpdate?.(nodeA)
      return nodeA
    }
  }
  nodeWillUnmount?.(nodeA)
  nodeWillMount?.(nodeB)
  nodeA.replaceWith(nodeB)
  deep(nodeA, nodeDidUnmount)
  deep(nodeB, nodeDidMount)
  return nodeB
}

module.exports = updateNode


/***/ }),
/* 7 */
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