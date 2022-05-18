const test = require('ava')
const { a, b, div, ul, li } = require('domb')
const actualize = require('..')

test('equal node', t => {
  const nodeA = div()
  const nodeB = div()
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(result.outerHTML, '<div></div>')
})

test('add attribute', t => {
  const nodeA = div()
  const nodeB = div({ className : 'foo' })
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(result.outerHTML, '<div class="foo"></div>')
})

test('remove attribute', t => {
  const nodeA = div({ className : 'bar' })
  const nodeB = div()
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(result.outerHTML, '<div></div>')
})

test('update attribute', t => {
  const nodeA = div({ className : 'foo' })
  const nodeB = div({ className : 'bar' })
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(result.outerHTML, '<div class="bar"></div>')
})

test('different tagName', t => {
  const nodeA = a({ href : 'https://example.com', children : 'Test' })
  const nodeB = b('Example')
  const container = div(nodeA)
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeB)
  t.is(container.outerHTML, '<div><b>Example</b></div>')
})

test('different nodeType', t => {
  const nodeA = a({ href : 'https://example.com', children : 'Test' })
  const nodeB = nodeA.ownerDocument.createTextNode('Example')
  const container = div(nodeA)
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeB)
  t.is(container.outerHTML, '<div>Example</div>')
})

test('key list', t => {
  let li2, li3, li4
  const nodeA = ul([
    li({ id : 'li1', children : 'one' }),
    li2 = li({ id : 'li2', children : 'two' }),
    li3 = li({ id : 'li3', children : 'three' }),
  ])
  const nodeB = ul([
    li({ id : 'li2', children : 'two' }),
    li({ id : 'li3', children : 'three' }),
    li4 = li({ id : 'li4', children : 'four' }),
  ])
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(nodeA.children[0], li2)
  t.is(nodeA.children[1], li3)
  t.is(nodeA.children[2], li4)
  t.is(nodeA.outerHTML, '<ul><li id="li2">two</li><li id="li3">three</li><li id="li4">four</li></ul>')
})
