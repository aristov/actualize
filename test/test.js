const test = require('ava')
const { div } = require('domb')
const actualize = require('..')

test('div => div', t => {
  const node = div()
  const result = actualize(node, div())
  t.is(result, node)
  t.is(result.outerHTML, '<div></div>')
})

test('div => div.foo', t => {
  const node = div()
  const result = actualize(node, div({ className : 'foo' }))
  t.is(result.outerHTML, '<div class="foo"></div>')
})

test('div.bar => div', t => {
  const node = div({ className : 'bar' })
  const result = actualize(node, div())
  t.is(result.outerHTML, '<div></div>')
})
