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

test('text node', t => {
  const nodeA = text('foo')
  const nodeB = text('bar')
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(nodeA.data, 'bar')
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

test('keys #1', t => {
  let li1, li2, li3
  const nodeA = ul([
    li1 = li({ id : 'li1', children : 'one' }),
    li2 = li({ id : 'li2', children : 'two' }),
    li3 = li({ id : 'li3', children : 'three' }),
  ])
  const nodeB = ul([
    li({ id : 'li1', className : 'foo', children : 'first' }),
    li({ id : 'li2', className : 'bar', children : 'second' }),
    li({ id : 'li3', className : 'wiz', children : 'third' }),
  ])
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(nodeA.children[0], li1)
  t.is(nodeA.children[1], li2)
  t.is(nodeA.children[2], li3)
  t.is(nodeA.childElementCount, 3)
  t.is(nodeA.outerHTML, '<ul><li id="li1" class="foo">first</li><li id="li2" class="bar">second</li><li id="li3" class="wiz">third</li></ul>')
})

test('keys #2', t => {
  let li1, li2, li3, li4
  const nodeA = ul([
    li1 = li({ id : 'li1', children : 'one' }),
    li2 = li({ id : 'li2', children : 'two' }),
    li3 = li({ id : 'li3', children : 'three' }),
  ])
  const nodeB = ul([
    li({ id : 'li2', children : 'second' }),
    li({ id : 'li3', children : 'third' }),
    li4 = li({ id : 'li4', children : 'fourth' }),
  ])
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(nodeA.children[0], li2)
  t.is(nodeA.children[1], li3)
  t.is(nodeA.children[2], li4)
  t.is(nodeA.childElementCount, 3)
  t.is(li1.parentNode, null)
  t.is(nodeA.outerHTML, '<ul><li id="li2">second</li><li id="li3">third</li><li id="li4">fourth</li></ul>')
})

test('keys #3', t => {
  let li0, li1, li2, li3
  const nodeA = ul([
    li1 = li({ id : 'li1', children : 'one' }),
    li2 = li({ id : 'li2', children : 'two' }),
    li3 = li({ id : 'li3', children : 'three' }),
  ])
  const nodeB = ul([
    li0 = li({ id : 'li0', children : 'zeroth' }),
    li({ id : 'li1', children : 'first' }),
    li({ id : 'li2', children : 'second' }),
  ])
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(nodeA.children[0], li0)
  t.is(nodeA.children[1], li1)
  t.is(nodeA.children[2], li2)
  t.is(nodeA.childElementCount, 3)
  t.is(li3.parentNode, null)
  t.is(nodeA.outerHTML, '<ul><li id="li0">zeroth</li><li id="li1">first</li><li id="li2">second</li></ul>')
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
  t.true(nodeWillUpdate.calledWithExactly(nodeA, nodeB))
  t.true(nodeDidUpdate.calledOnce)
  t.true(nodeDidUpdate.calledWithExactly(nodeA, nodeB))
  t.true(childrenWillUpdate.calledOnce)
  t.true(childrenWillUpdate.calledWithExactly(nodeA, nodeB))
  t.true(childrenDidUpdate.calledOnce)
  t.true(childrenDidUpdate.calledWithExactly(nodeA, nodeB))
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
  t.true(nodeWillMount.calledWithExactly(childB))
  t.true(nodeDidMount.calledOnce)
  t.true(nodeDidMount.calledWithExactly(childB))
  t.true(nodeWillUnmount.calledOnce)
  t.true(nodeWillUnmount.calledWithExactly(childA))
  t.true(nodeDidUnmount.calledOnce)
  t.true(nodeDidUnmount.calledWithExactly(childA))
})

test('hooks #3', t => {
  let li0A, li1A, li2A, li3A, li4A
  let li1B, li3B
  let oneA, threeA, oneB, threeB
  const nodeA = ul([
    li1A = li({ id : 'li1', children : oneA = text('one') }),
    li2A = li({ id : 'li2', children : 'two' }),
    li3A = li({ id : 'li3', children : threeA = text('three') }),
  ])
  const nodeB = ul([
    li0A = li({ id : 'li0', children : 'zeroth' }),
    li3B = li({ id : 'li3', children : threeB = text('third') }),
    li1B = li({ id : 'li1', children : oneB = text('first') }),
    li4A = li({ id : 'li4', children : 'fourth' }),
  ])
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
  t.true(nodeWillMount.calledTwice)
  t.true(nodeDidMount.calledTwice)
  t.true(nodeWillUnmount.calledOnce)
  t.true(nodeDidUnmount.calledOnce)
  t.is(nodeWillUpdate.callCount, 5)
  t.true(nodeWillUpdate.getCall(0).calledWithExactly(nodeA, nodeB))
  t.true(nodeWillUpdate.getCall(1).calledWithExactly(li3A, li3B))
  t.true(nodeWillUpdate.getCall(2).calledWithExactly(threeA, threeB))
  t.true(nodeWillUpdate.getCall(3).calledWithExactly(li1A, li1B))
  t.true(nodeWillUpdate.getCall(4).calledWithExactly(oneA, oneB))
  t.is(nodeDidUpdate.callCount, 5)
  t.true(nodeDidUpdate.getCall(0).calledWithExactly(nodeA, nodeB))
  t.true(nodeDidUpdate.getCall(1).calledWithExactly(li3A, li3B))
  t.true(nodeDidUpdate.getCall(2).calledWithExactly(threeA, threeB))
  t.true(nodeDidUpdate.getCall(3).calledWithExactly(li1A, li1B))
  t.true(nodeDidUpdate.getCall(4).calledWithExactly(oneA, oneB))
  t.true(childrenWillUpdate.calledThrice)
  t.true(childrenWillUpdate.getCall(0).calledWithExactly(nodeA, nodeB))
  t.true(childrenWillUpdate.getCall(1).calledWithExactly(li3A, li3B))
  t.true(childrenWillUpdate.getCall(2).calledWithExactly(li1A, li1B))
  t.true(childrenDidUpdate.calledThrice)
  t.true(childrenDidUpdate.getCall(0).calledWithExactly(li3A, li3B))
  t.true(childrenDidUpdate.getCall(1).calledWithExactly(li1A, li1B))
  t.true(childrenDidUpdate.getCall(2).calledWithExactly(nodeA, nodeB))
  t.is(nodeA.children[0], li0A)
  t.is(nodeA.children[1], li3A)
  t.is(nodeA.children[2], li1A)
  t.is(nodeA.children[3], li4A)
  t.is(nodeA.childElementCount, 4)
  t.is(nodeA.outerHTML, '<ul><li id="li0">zeroth</li><li id="li3">third</li><li id="li1">first</li><li id="li4">fourth</li></ul>')
})

test('hooks + keys', t => {
  let li1, li2, li3
  const nodeA = ul([
    li1 = li({ id : 'li1', children : 'one' }),
    li2 = li({ id : 'li2', children : 'two' }),
    li3 = li({ id : 'li3', children : 'three' }),
  ])
  const nodeB = ul([
    li({ id : 'li3', children : 'third' }),
    li({ id : 'li2', children : 'second' }),
    li({ id : 'li1', children : 'first' }),
  ])
  const result = actualize(nodeA, nodeB)
  t.is(result, nodeA)
  t.is(nodeA.children[0], li3)
  t.is(nodeA.children[1], li2)
  t.is(nodeA.children[2], li1)
  t.is(nodeA.childElementCount, 3)
  t.is(nodeA.outerHTML, '<ul><li id="li3">third</li><li id="li2">second</li><li id="li1">first</li></ul>')
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

test('nodeWillUpdate: false (Element)', t => {
  const nodeA = div({ className : 'foo', children : 'bat' })
  const nodeB = div({ className : 'bar', children : 'baz' })
  const result = actualize(nodeA, nodeB, {
    nodeWillUpdate : node => node.nodeType !== 1,
  })
  t.is(result, nodeA)
  t.is(result.outerHTML, '<div class="foo">baz</div>')
})

test('nodeWillUpdate: false (Text)', t => {
  const nodeA = div({ className : 'foo', children : 'bat' })
  const nodeB = div({ className : 'bar', children : 'baz' })
  const result = actualize(nodeA, nodeB, {
    nodeWillUpdate : node => node.nodeType !== 3,
  })
  t.is(result, nodeA)
  t.is(result.outerHTML, '<div class="bar">bat</div>')
})

test('childrenWillUpdate: false', t => {
  const nodeA = div({ className : 'foo', children : 'bat' })
  const nodeB = div({ className : 'bar', children : 'baz' })
  const result = actualize(nodeA, nodeB, {
    childrenWillUpdate : () => false,
  })
  t.is(result, nodeA)
  t.is(result.outerHTML, '<div class="bar">bat</div>')
})

test('nodeWillMount: false #1', t => {
  const nodeA = a('foo')
  const nodeB = b('bar')
  const container = div(nodeA)
  const result = actualize(nodeA, nodeB, {
    nodeWillMount : () => false,
  })
  t.is(result, nodeA)
  t.is(container.outerHTML, '<div><a>foo</a></div>')
})

test('nodeWillMount: false #2', t => {
  const nodeA = div()
  const nodeB = div(div('foo'))
  const result = actualize(nodeA, nodeB, {
    nodeWillMount : () => false,
  })
  t.is(result, nodeA)
  t.is(result.outerHTML, '<div></div>')
})

test('nodeWillUnmount: false #1', t => {
  const nodeA = a('foo')
  const nodeB = b('bar')
  const container = div(nodeA)
  const result = actualize(nodeA, nodeB, {
    nodeWillUnmount : () => false,
  })
  t.is(result, nodeA)
  t.is(container.outerHTML, '<div><a>foo</a></div>')
})

test('nodeWillUnmount: false #2', t => {
  const nodeA = div(div('foo'))
  const nodeB = div()
  const result = actualize(nodeA, nodeB, {
    nodeWillUnmount : () => false,
  })
  t.is(result, nodeA)
  t.is(result.outerHTML, '<div><div>foo</div></div>')
})

test('nodeWillMount: false (keys)', t => {
  let li1, li2, li3, li4
  const nodeA = ul([
    li1 = li({ id : 'li1', children : 'one' }),
    li2 = li({ id : 'li2', children : 'two' }),
    li3 = li({ id : 'li3', children : 'three' }),
  ])
  const nodeB = ul([
    li({ id : 'li2', children : 'second' }),
    li({ id : 'li3', children : 'third' }),
    li4 = li({ id : 'li4', children : 'fourth' }),
  ])
  const result = actualize(nodeA, nodeB, {
    nodeWillMount : () => false
  })
  t.is(result, nodeA)
  t.is(nodeA.childElementCount, 2)
  t.is(nodeA.children[0], li2)
  t.is(nodeA.children[1], li3)
  t.is(li1.parentNode, null)
  t.is(li4.parentNode, nodeB)
  t.is(nodeA.outerHTML, '<ul><li id="li2">second</li><li id="li3">third</li></ul>')
})

test('nodeWillUnmount: false (keys)', t => {
  let li1, li2, li3, li4
  const nodeA = ul([
    li1 = li({ id : 'li1', children : 'one' }),
    li2 = li({ id : 'li2', children : 'two' }),
    li3 = li({ id : 'li3', children : 'three' }),
  ])
  const nodeB = ul([
    li({ id : 'li2', children : 'second' }),
    li({ id : 'li3', children : 'third' }),
    li4 = li({ id : 'li4', children : 'fourth' }),
  ])
  const result = actualize(nodeA, nodeB, {
    nodeWillUnmount : () => false
  })
  t.is(result, nodeA)
  t.is(nodeA.childElementCount, 4)
  t.is(nodeA.children[0], li1)
  t.is(nodeA.children[1], li2)
  t.is(nodeA.children[2], li3)
  t.is(nodeA.children[3], li4)
  t.is(nodeA.outerHTML, '<ul><li id="li1">one</li><li id="li2">second</li><li id="li3">third</li><li id="li4">fourth</li></ul>')
})
