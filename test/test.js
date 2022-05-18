const test = require('ava')
const sinon = require('sinon')
const { a, b, div, ul, li, text, option, input, textarea } = require('domb')
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

test('other tagName', t => {
  const nodeA = a({ href : 'https://example.com', children : 'Test' })
  const nodeB = b('Example')
  const container = div(nodeA)
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeB)
  t.is(container.outerHTML, '<div><b>Example</b></div>')
})

test('other nodeType', t => {
  const nodeA = a({ href : 'https://example.com', children : 'Test' })
  const nodeB = text('Example')
  const container = div(nodeA)
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeB)
  t.is(container.outerHTML, '<div>Example</div>')
})

test('key list #1', t => {
  let li1, li2, li3, li4
  const nodeA = ul([
    li1 = li({ id : 'li1', children : 'one' }),
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
  t.is(nodeA.childElementCount, 3)
  t.is(li1.parentNode, null)
  t.is(nodeA.outerHTML, '<ul><li id="li2">two</li><li id="li3">three</li><li id="li4">four</li></ul>')
})

test('key list #2', t => {
  let li0, li1, li2, li3
  const nodeA = ul([
    li1 = li({ id : 'li1', children : 'one' }),
    li2 = li({ id : 'li2', children : 'two' }),
    li3 = li({ id : 'li3', children : 'three' }),
  ])
  const nodeB = ul([
    li0 = li({ id : 'li0', children : 'zero' }),
    li({ id : 'li1', children : 'one' }),
    li({ id : 'li2', children : 'two' }),
  ])
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(nodeA.children[0], li0)
  t.is(nodeA.children[1], li1)
  t.is(nodeA.children[2], li2)
  t.is(nodeA.childElementCount, 3)
  t.is(li3.parentNode, null)
  t.is(nodeA.outerHTML, '<ul><li id="li0">zero</li><li id="li1">one</li><li id="li2">two</li></ul>')
})

test('key list #3', t => {
  let li1, li2, li3
  const nodeA = ul([
    li1 = li({ id : 'li1', children : 'one' }),
    li2 = li({ id : 'li2', children : 'two' }),
    li3 = li({ id : 'li3', children : 'three' }),
  ])
  const nodeB = ul([
    li({ id : 'li3', children : 'three' }),
    li({ id : 'li2', children : 'two' }),
    li({ id : 'li1', children : 'one' }),
  ])
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(nodeA.children[0], li3)
  t.is(nodeA.children[1], li2)
  t.is(nodeA.children[2], li1)
  t.is(nodeA.childElementCount, 3)
  t.is(nodeA.outerHTML, '<ul><li id="li3">three</li><li id="li2">two</li><li id="li1">one</li></ul>')
})

test('text node', t => {
  const nodeA = text('foo')
  const nodeB = text('bar')
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(nodeA.data, 'bar')
})

test('append child', t => {
  const nodeA = div()
  const nodeB = div('Hello world!')
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.true(nodeA.hasChildNodes())
  t.is(nodeA.outerHTML, '<div>Hello world!</div>')
})

test('remove child', t => {
  const nodeA = div('Hello world!')
  const nodeB = div()
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.false(nodeA.hasChildNodes())
  t.is(nodeA.outerHTML, '<div></div>')
})

test('option', t => {
  const nodeA = option()
  const nodeB = option({ selected : true })
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.true(nodeA.selected)
  t.is(nodeA.outerHTML, '<option></option>')
})

test('input', t => {
  const nodeA = input({ type : 'checkbox' })
  const nodeB = input({ type : 'checkbox', checked : true, indeterminate : true })
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.true(nodeA.checked)
  t.true(nodeA.indeterminate)
  t.is(nodeA.outerHTML, '<input type="checkbox" value="on">')
})

test('textarea', t => {
  const nodeA = textarea({ value : 'foo' })
  const nodeB = textarea({ value : 'bar' })
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(nodeA.value, 'bar')
  t.is(nodeA.outerHTML, '<textarea></textarea>')
})

test('hooks #1', t => {
  const nodeA = div()
  const nodeB = div()
  const nodeWillMount = sinon.spy()
  const nodeDidMount = sinon.spy()
  const nodeWillUnmount = sinon.spy()
  const nodeDidUnmount = sinon.spy()
  const nodeWillUpdate = sinon.spy()
  const nodeDidUpdate = sinon.spy()
  const childrenWillUpdate = sinon.spy()
  const childrenDidUpdate = sinon.spy()
  const result = actualize(nodeA, nodeB, {
    nodeWillMount, nodeDidMount, nodeWillUnmount, nodeDidUnmount,
    nodeWillUpdate, nodeDidUpdate, childrenWillUpdate, childrenDidUpdate,
  })
  t.is(result, nodeA)
  t.true(nodeWillMount.notCalled)
  t.true(nodeDidMount.notCalled)
  t.true(nodeWillUnmount.notCalled)
  t.true(nodeDidUnmount.notCalled)
  t.true(nodeWillUpdate.calledOnce)
  t.true(nodeWillUpdate.calledWith(nodeA, nodeB))
  t.true(nodeDidUpdate.calledOnce)
  t.true(nodeDidUpdate.calledWith(nodeA))
  t.true(childrenWillUpdate.calledOnce)
  t.true(childrenWillUpdate.calledWith(nodeA, nodeB))
  t.true(childrenDidUpdate.calledOnce)
  t.true(childrenDidUpdate.calledWith(nodeA))
})

test('hooks #2', t => {
  const childA = a('foo')
  const childB = b('bar')
  const nodeA = div(childA)
  const nodeB = div(childB)
  const nodeWillMount = sinon.spy()
  const nodeDidMount = sinon.spy()
  const nodeWillUnmount = sinon.spy()
  const nodeDidUnmount = sinon.spy()
  const result = actualize(nodeA, nodeB, {
    nodeWillMount, nodeDidMount, nodeWillUnmount, nodeDidUnmount,
  })
  t.is(result, nodeA)
  t.true(nodeWillMount.calledOnce)
  t.true(nodeWillMount.calledWith(childB))
  t.true(nodeDidMount.calledOnce)
  t.true(nodeDidMount.calledWith(childB))
  t.true(nodeWillUnmount.calledOnce)
  t.true(nodeWillUnmount.calledWith(childA))
  t.true(nodeDidUnmount.calledOnce)
  t.true(nodeDidUnmount.calledWith(childA))
})

test('hooks #3', t => {
  const childA = a('foo')
  const childB = b(childA)
  const bar = text('bar')
  const nodeA = div(bar)
  const nodeB = div(childB)
  const nodeWillMount = sinon.spy()
  const nodeDidMount = sinon.spy()
  const nodeWillUnmount = sinon.spy()
  const nodeDidUnmount = sinon.spy()
  const result = actualize(nodeA, nodeB, {
    nodeWillMount, nodeDidMount, nodeWillUnmount, nodeDidUnmount,
  })
  t.is(result, nodeA)
  t.true(nodeWillMount.calledOnce)
  t.true(nodeWillMount.calledWith(childB))
  t.true(nodeDidMount.calledTwice)
  t.is(nodeDidMount.args[0][0], childB)
  t.is(nodeDidMount.args[1][0], childA)
  t.true(nodeWillUnmount.calledOnce)
  t.true(nodeWillUnmount.calledWith(bar))
  t.true(nodeDidUnmount.calledOnce)
  t.true(nodeDidUnmount.calledWith(bar))
})

test('childrenOnly', t => {
  const childA = a()
  const childB = b()
  const nodeA = div({ className : 'foo', children : [childA] })
  const nodeB = div({ className : 'bar', children : [childB] })
  const result = actualize(nodeA, nodeB, { childrenOnly : true })
  t.is(result, nodeA)
  t.is(nodeA.className, 'foo')
  t.is(nodeA.childElementCount, 1)
  t.is(nodeA.children[0], childB)
  t.is(nodeA.outerHTML, '<div class="foo"><b></b></div>')
})

test('getKey', t => {
  let li0, li1, li2, li3, li4
  const nodeA = ul([
    li1 = li({ 'data-key' : 'li1', children : 'one' }),
    li2 = li({ 'data-key' : 'li2', children : 'two' }),
    li3 = li({ 'data-key' : 'li3', children : 'three' }),
  ])
  const nodeB = ul([
    li0 = li({ 'data-key' : 'li0', children : 'zero' }),
    li({ 'data-key' : 'li2', children : 'two' }),
    li4 = li({ 'data-key' : 'li4', children : 'four' }),
  ])
  const getKey = node => node.dataset.key
  const result = actualize(nodeA, nodeB, { getKey })
  t.is(result, nodeA)
  t.is(nodeA.childElementCount, 3)
  t.is(nodeA.children[0], li0)
  t.is(nodeA.children[1], li2)
  t.is(nodeA.children[2], li4)
  t.is(li1.parentNode, null)
  t.is(li3.parentNode, null)
  t.is(nodeA.outerHTML, '<ul><li data-key="li0">zero</li><li data-key="li2">two</li><li data-key="li4">four</li></ul>')
})
