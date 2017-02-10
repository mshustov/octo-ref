[![Build Status](https://travis-ci.org/restrry/octo-ref.svg?branch=master)](https://travis-ci.org/restrry/octo-ref)

### Overview
Highlight definition and refrences on variable right on github pages!

![Highlight](http://q00.imgup.net/step0034f.gif)

There is very basic implementaion based on [typescript](https://github.com/Microsoft/TypeScript) tool.
Extension supports `js`, `ts`, `jsx`, `es6` files.

Make available next hot keys:
- `alt + click` - just highlight
- `ctrl + click` | `cmd + click`(Mac) - jump to next usage place
- `alt + ctrl + click` | `alt + cmd + click`(Mac) - jump to definition
- `esc` - clean highlightes

First version works for source pages on github site only.

### Available settings:
- ~~click + control button(`alt|cmd`). default value: `alt`~~
- ~~scroll to definition. default value: `false`~~
- definition / reference highlight color

### Install
from [extensions store](http://bit.ly/8ReFFad)
or build localy:
- clone repo
- `npm i`
- `npm run build`
- drag'n'drop /build folder to `chrome://extensions/`

### Alternatives
 - [Sourcegraph](https://chrome.google.com/webstore/detail/sourcegraph-for-github/dgjhfomjieaadpoljlnidmbgkdffpack?hl=en)

### License
[WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-strip.jpg)
