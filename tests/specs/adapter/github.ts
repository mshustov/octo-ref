import * as sinon from 'sinon';
import * as chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import Adapter from '../../../src/adapter/github';

var adapter;

describe('github api', function(){
    beforeEach(function() {
        // Karma creates this global __html__ property that will hold all
        // of our HTML so we can populate the body during our tests
        if (window.__html__) {
            document.body.innerHTML = window.__html__['tests/fixtures/github-page.html'];
        }
        adapter = new Adapter(window);
        window.getSelection().removeAllRanges();
    });

    it('#getRoot should return root html element', function() {
        var root = adapter.getRoot();
        expect(root).to.be.an.instanceof(HTMLElement);
    });

    it('#getFilename should resolve filename', function() {
        var filename = adapter.getFilename();
        var fnBeginsAt = filename.lastIndexOf('/');
        assert.equal(filename.slice(fnBeginsAt), '/github-page.js');
    });

    it('#getLineNumber should return line number', function() {
        var elem = window.document.getElementById('LC13').querySelector('.pl-smi'); // greet
        var lineNumber = adapter.getLineNumber(elem);
        assert.equal(lineNumber, 13);
    });

    it('#getElem should return the deepest selected element', function() {
        var elem = window.document.getElementById('LC13').querySelector('.pl-smi'); // greet
        setSelection(window, elem);

        var selectedElem = adapter.getElem(); // textNode, childNode of elem
        assert.equal(selectedElem, elem.childNodes[0]);
    });

    it('#getElemPosition should return object with position on element. shape {line, character}', function() {
        var elem = window.document.getElementById('LC13').querySelector('.pl-smi'); // greet

        var selectedElem = adapter.getElemPosition(elem);
        assert.deepEqual(selectedElem, { line: 13, character: 15 });
    });

    it('#getEndColumnPosition should return end last position for element', function() {
        var elem = window.document.getElementById('LC21').querySelector('.pl-c1'); // join
        var charNumber = adapter.getEndColumnPosition(elem);
        assert.equal(charNumber, 19, 'without selection');

        setSelection(window, elem);
        var charNumber = adapter.getEndColumnPosition(elem);
        assert.equal(charNumber, 23, 'with selection');
    });

    it('#getElemLength should return length of elem content', function() {
        var elem = window.document.getElementById('LC21').querySelector('.pl-c1'); // join
        var contentLength = adapter.getElemLength(elem);
        assert.equal(contentLength, 4, 'for ELEMENT_NODE'); // 'null'

        contentLength = adapter.getElemLength(elem.nextSibling);
        assert.equal(contentLength, 11, 'for TEXT_NODE'); // ', options);'
    });

    it('#subscribe/#unsubscribe should subscibe/unsubscribe on event ', function() {
        var callback = sinon.spy();
        var elem = window.document.getElementById('LC17').querySelector('.pl-c1') as HTMLElement;

        adapter.subscribe('click', callback);
        elem.click();
        assert.isTrue(callback.calledOnce);

        adapter.unsubscribe('click', callback);
        elem.click();
        assert.isTrue(callback.calledOnce);
    });

    it('#show should add class name (wrap text node)', function() {
        var refs = {
            start: {character: 4, line: 2}, // hello
            length: 5
        };
        var options = {className: 'test-classname1'};

        adapter.highlight(refs, options);
        // should we use xpath?
        var selectedElem = window.document.querySelector('.test-classname1') as HTMLElement;
        assert.equal(selectedElem.innerText, 'hello', 'wrap textNode');

        refs = {
            start: {character: 8, line: 21}, // greet
            length: 5
        }
        options = {className: 'test-classname2'};
        adapter.highlight(refs, options);
        var selectedElem = window.document.querySelector('.test-classname2') as HTMLElement;
        assert.equal(selectedElem.innerText, 'greet', 'add className to element node');
    });

    it('#clean should remove all class names', function() {
        var refs = {
            start: {character: 4, line: 1}, // hello
            length: 5
        };
        var options = {className: 'test-classname1'};
        adapter.highlight(refs, options);
        var elems = window.document.getElementsByClassName('test-classname1');
        assert.equal(elems.length, 1, 'add class name');
        adapter.clean(['test-classname1'])
        assert.equal(elems.length, 0, 'remove class name');
    });
})

function setSelection(window, elem){
    var rng = window.document.createRange();
    rng.selectNode(elem)
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(rng);
}
