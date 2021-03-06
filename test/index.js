var fs = require('fs')
var path = require('path')
var test = require('tape')
var micromark = require('micromark')
var syntax = require('..')
var html = require('../html')

var input = fs.readFileSync(path.join(__dirname, 'input.md'))
var output = fs.readFileSync(path.join(__dirname, 'output.html'), 'utf8')

test('markdown -> html (micromark)', function (t) {
  var defaults = syntax()

  t.deepEqual(
    micromark('a ~b~', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a <del>b</del></p>',
    'should support strikethrough w/ one tilde'
  )

  t.deepEqual(
    micromark('a ~~b~~', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a <del>b</del></p>',
    'should support strikethrough w/ two tildes'
  )

  t.deepEqual(
    micromark('a ~~~b~~~', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a ~~~b~~~</p>',
    'should not support strikethrough w/ three tildes'
  )

  t.deepEqual(
    micromark(input, {extensions: [defaults], htmlExtensions: [html]}),
    output,
    'should support strikethrough matching how GH does it'
  )

  t.deepEqual(
    micromark('a \\~~~b~~ c', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a ~<del>b</del> c</p>',
    'should support strikethrough w/ after an escaped tilde'
  )

  t.deepEqual(
    micromark('a ~~b ~~c~~ d~~ e', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a <del>b <del>c</del> d</del> e</p>',
    'should support nested strikethrough'
  )

  t.deepEqual(
    micromark('a ~-1~ b', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a <del>-1</del> b</p>',
    'should open if preceded by whitespace and followed by punctuation'
  )

  t.deepEqual(
    micromark('a ~b.~ c', {
      extensions: [defaults],
      htmlExtensions: [html]
    }),
    '<p>a <del>b.</del> c</p>',
    'should close if preceded by punctuation and followed by whitespace'
  )

  t.deepEqual(
    micromark('~b.~.', {
      extensions: [syntax({singleTilde: true})],
      htmlExtensions: [html]
    }),
    '<p><del>b.</del>.</p>',
    'should close if preceded and followed by punctuation (del)'
  )

  t.deepEqual(
    micromark('a ~b~ ~~c~~ d', {
      extensions: [syntax({singleTilde: false})],
      htmlExtensions: [html]
    }),
    '<p>a ~b~ <del>c</del> d</p>',
    'should not support strikethrough w/ one tilde if `singleTilde: false`'
  )

  t.deepEqual(
    micromark('a ~b~ ~~c~~ d', {
      extensions: [syntax({singleTilde: true})],
      htmlExtensions: [html]
    }),
    '<p>a <del>b</del> <del>c</del> d</p>',
    'should support strikethrough w/ one tilde if `singleTilde: true`'
  )

  t.end()
})
