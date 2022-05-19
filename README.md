# actualize

[![NPM Version](https://img.shields.io/npm/v/actualize.svg)](https://www.npmjs.com/package/actualize)
[![Node.js CI](https://github.com/aristov/actualize/actions/workflows/node.js.yml/badge.svg)](https://github.com/aristov/actualize/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/aristov/actualize/badge.svg?branch=main)](https://coveralls.io/github/aristov/actualize?branch=main)

Actualize is a very efficient and fast DOM patching algorithm. It's inspired by [morphdom](https://www.npmjs.com/package/morphdom) and [nanomorph](https://www.npmjs.com/package/nanomorph).
It works with a real DOM, so a virtual DOM is not required.

## Installation

```shell
npm install actualize
```

## Usage

ES2015

```js
import actualize from 'actualize'
```

CommonJS

```js
const actualize = require('actualize')
```

Browser

```html
<script src="https://unpkg.com/actualize@latest/dist/actualize.js"></script>
```

It injects `actualize` global into your environment.

## Example

```js
import actualize from 'actualize'

const nodeA = document.createElement('button')
nodeA.textContent = 'Open'

const nodeB = document.createElement('button')
nodeB.className = 'pressed'
nodeB.textContent = 'Close'

nodeA.outerHTML === '<button>Open</button>' // true

actualize(nodeA, nodeB)

nodeA.outerHTML === '<button class="pressed">Close</button>' // true
```

## Reordering lists

Actualize uses keys to rearrange lists instead of creating and destroying an element that already exists.

## API

```js
actualize(treeA, treeB, options)
```

The `actualize` function supports the following arguments:

- `treeA` (Node) — node for updating
- `treeB` (Node) — node to which `treeA` should be updated
- `options` (object) — see below supported options 

The return value will usually be `treeA`. 
However, in situations where `treeA` is incompatible with `treeB` 
(either a different node type or a different tag name) then `treeB` will be returned.

This is used by `actualize` to rearrange elements instead of creating and destroying an element that already exists.

Supported options (all optional):

| Option               | Type                                  | Description                                                                                                   |
|----------------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `getKey`             | `function(node)`                      | Called to get a custom key of the node in a child list.  This default value is `node.id`.                     |
| `nodeWillMount`      | `function(nodeB)`                     | Called before a node from the `B` tree is mounted to the `A` tree.                                            |
| `nodeDidMount`       | `function(nodeB)`                     | Called after a node from the `B` tree has been mounted to the `A` tree.                                       |
| `nodeWillUpdate`     | <nobr>`function(nodeA, nodeB)`</nobr> | Called before updating a node in the `A` tree.                                                                |
| `nodeDidUpdate`      | <nobr>`function(nodeA, nodeB)`</nobr> | Called after updating a node in the `A` tree.                                                                 |
| `childrenWillUpdate` | <nobr>`function(nodeA, nodeB)`</nobr> | Called before updating the child nodes of an element in the `A` tree.                                         |
| `childrenDidUpdate`  | <nobr>`function(nodeA, nodeB)`</nobr> | Called after updating the child nodes of an element in the `A` tree.                                          |
| `nodeWillUnmount`    | `function(nodeA)`                     | Called before a node in the `A` tree is unmounted.                                                            |
| `nodeDidUnmount`     | `function(nodeA)`                     | Called after a node in the `A` tree has been unmounted.                                                       |
| `childrenOnly`       | `boolean`                             | Update only the child nodes of the `treeA`, the element itself will be skipped. The default value is `false`. |

## License

[The MIT License (MIT)](https://raw.githubusercontent.com/aristov/actualize/master/LICENSE)
