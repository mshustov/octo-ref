[![Build Status](https://travis-ci.org/restrry/octo-ref.svg?branch=master)](https://travis-ci.org/restrry/octo-ref)

### Overview
Highlight definition and refrences on variable right on github pages!

![Highlight](http://q00.imgup.net/step0034f.gif)

There is very basic implementaion based on [typescript](https://github.com/Microsoft/TypeScript) tool.
Extension supports `js`, `ts`, `jsx`, `es6` files.

Make available next hot keys:
- `alt + click` - just highlight
- `cmd + click` - jump to next usage place
- `alt + cmd + click` - jump to definition
- `esc` - clean highlightes

First version works for source pages on github site only.

### Available settings:
~~- click + control button(`alt|cmd`). default value: `alt`~~
~~- scroll to definition. default value: `false`~~
- definition / reference highlight color

### Install
drag'n'drop built file from /build folder to `chrome://extensions/`

### License
[WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-strip.jpg)
