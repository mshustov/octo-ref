[![Build Status](https://travis-ci.org/restrry/octo-ref.svg?branch=master)](https://travis-ci.org/restrry/octo-ref)

### Overview
Highlight definition and references on variables right on github pages!
![Highlight](http://q00.imgup.net/step0034f.gif)

Make available next hot keys:
- `alt + click` - just highlight
- `ctrl + click` | `cmd + click`(Mac) - jump to next usage place
- `alt + ctrl + click` | `alt + cmd + click`(Mac) - jump to definition
- `esc` - clean all highlights

### Limitations
1. Works for github
1. Works for `js`, `ts`, `jsx`, `es6` files.
1. Shipped as Chrome extension.

### Available settings:
- definition / reference highlight color

### Install
**Recommended way** it to install from [extensions store](http://bit.ly/8ReFFad)

### Alternatives
 - [Sourcegraph](https://chrome.google.com/webstore/detail/sourcegraph-for-github/dgjhfomjieaadpoljlnidmbgkdffpack?hl=en)

### Contributions
To build locally:
- clone repository
- `npm i`
- `npm run build`
- drag'n'drop `/build` folder to `chrome://extensions/`
