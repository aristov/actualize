# actualize

[![NPM Version](https://img.shields.io/npm/v/actualize.svg)](https://www.npmjs.com/package/actualize)
[![Node.js CI](https://github.com/aristov/actualize/actions/workflows/node.js.yml/badge.svg)](https://github.com/aristov/actualize/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/aristov/actualize/badge.svg?branch=main)](https://coveralls.io/github/aristov/actualize?branch=main)

Actualize is a very efficient and fast DOM patching algorithm. It's inspired by [morphdom](https://www.npmjs.com/package/morphdom) and [nanomorph](https://www.npmjs.com/package/nanomorph).

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

## License

[The MIT License (MIT)](https://raw.githubusercontent.com/aristov/actualize/master/LICENSE)
