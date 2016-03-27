var Adapter = require('../src/siteAdapter/github');
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
        var elem = window.document.getElementById('LC9').querySelector('.pl-smi');
        var lineNumber = adapter.getLineNumber(elem);
        assert.equal(lineNumber, 8);
    });

    it('#getElem should return the deepest selected element', function() {
        var elem = window.document.getElementById('LC13').querySelector('.pl-c1');
        setSelection(window, elem);

        var selectedElem = adapter.getElem(); // textNode, childNode of elem
        assert.equal(selectedElem, elem.childNodes[0]);
    });

    it('#getEndColumnPosition should return end last position for element', function() {
        var elem = window.document.getElementById('LC17').querySelector('.pl-c1');
        var charNumber = adapter.getEndColumnPosition(elem);
        assert.equal(charNumber, 19, 'without selection');

        setSelection(window, elem);
        var charNumber = adapter.getEndColumnPosition(elem);
        assert.equal(charNumber, 23, 'with selection');
    });

    it('#getElemLength should return length of elem content', function() {
        var elem = window.document.getElementById('LC17').querySelector('.pl-c1');
        var contentLength = adapter.getElemLength(elem);
        assert.equal(contentLength, 4, 'for ELEMENT_NODE'); // 'null'

        contentLength = adapter.getElemLength(elem.nextSibling);
        assert.equal(contentLength, 11, 'for TEXT_NODE'); // ', options);'
    });

    it('#subscribe/#unsubscribe should subscibe/unsubscribe on event ', function() {
        var callback = sinon.spy();
        var elem = window.document.getElementById('LC17').querySelector('.pl-c1');

        adapter.subscribe('click', callback);
        elem.click();
        assert.isTrue(callback.calledOnce);

        adapter.unsubscribe('click', callback);
        elem.click();
        assert.isTrue(callback.calledOnce);
    });

    it('#show should add class name (wrap text node)', function() {
        var refs = {
            start: {ch: 4, line:0}, // hello
            end: {ch: 9, line: 0}
        };
        var options = {className: 'test-classname1'};

        adapter.show(refs, options);
        var elem = window.document.getElementById('LC1').querySelector('.pl-c1');
        // should we use xpath?
        var selectedElem = window.document.querySelector('.test-classname1');
        assert.equal(selectedElem.innerText, 'hello', 'wrap textNode');

        refs = {
            start: {ch: 8, line: 16}, // greet
            end: {ch: 13, line: 16}
        }
        options = {className: 'test-classname2'};
        adapter.show(refs, options);
        var selectedElem = window.document.querySelector('.test-classname2');
        assert.equal(selectedElem.innerText, 'greet', 'add className to element node');
    });

    it('#clean should remove all class names', function() {
        var refs = {
            start: {ch: 4, line:0}, // hello
            end: {ch: 9, line: 0}
        };
        var options = {className: 'test-classname1'};
        adapter.show(refs, options);
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
