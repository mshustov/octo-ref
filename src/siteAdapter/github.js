const GITHUB = {
    CONTAINER: 'blob-wrapper',
    FILENAME: 'js-permalink-shortcut', // another for gist
    LINE: 'js-file-line',
    LINESHORT: 'LC',
    WRAPPER: 'text-wrapper-source'
}

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

function GihubDomAPI(window) {
    this.window = window;
    this.root = window.document.querySelector(`.${GITHUB.CONTAINER}`);

    // if(!this.isCodePage()) {
    //     return;
    // }

    this.fileContent = this.root.innerText;
    const permalinkContainer = window.document.querySelector(`.${GITHUB.FILENAME}`);
    this.fileName = permalinkContainer.getAttribute('href');
}

GihubDomAPI.prototype.getRoot = function(){
    return this.root;
}

GihubDomAPI.prototype.isCodePage = function(){
    return Boolean(this.root);
}

GihubDomAPI.prototype.getFileContent = function(){
    return this.fileContent;
}

GihubDomAPI.prototype.getFilename = function(){
    return this.fileName;
}

GihubDomAPI.prototype.subscribe = function(event, fn){
    return this.window.addEventListener(event, fn);
}

GihubDomAPI.prototype.unsubscribe = function(event, fn){
    return this.window.removeEventListener(event, fn);
}

GihubDomAPI.prototype.clean = function(selectors){
    // FIXME ADD class option to CONFIG??
    const selectorClasses = selectors.map((selector) => `.${selector}`);
    // we need intersection of many
    const elems = this.window.document.querySelectorAll(selectorClasses);
    return Array.from(elems).forEach((elem) => {
        // elem.classList.remove.apply(elem.classList, selectors); // borrowed?
        elem.classList.remove(...selectors); // borrowed?
        if (elem.classList.contains(GITHUB.WRAPPER)){
            elem.parentNode.replaceChild(elem.firstChild, elem);
        }
    });
}

GihubDomAPI.prototype.getElem = function(){
    const selection = this.window.getSelection();
     // forward to the end of the word. we need provide this info for tern.
     // after click on word: funct|ion 
     // after modifing: function|
    // selection.modify('move', 'forward', 'word');
    return selection.focusNode;
}

GihubDomAPI.prototype.getLineNumber = function(elem){
    while(elem = elem.parentNode){
        if(elem.classList && elem.classList.contains(GITHUB.LINE)) {
            return parseInt(elem.getAttribute('id').replace(/^\w./,''), 10) - 1;
        }
    }
    return null;
}

GihubDomAPI.prototype.getEndColumnPosition = function(elem){
    // vertical aligh to the line of code
    if(elem.classList && elem.classList.contains(GITHUB.LINE)){
        return 0;
    }

    while(!elem.parentElement.classList.contains(GITHUB.LINE)){
        elem = elem.parentElement;
    }

    var selection = this.window.getSelection();
    // selection.modify('move', 'forward', 'word');
    // debugger;
    let pos = selection ? selection.focusOffset : 0;

    // count horizontal offset
    while(elem = elem.previousSibling){
        pos += this.getElemLength (elem);
    }

    return pos;
}

GihubDomAPI.prototype.show = function(data, options){
    // skip highlight in case of block
    if (data.start.line !== data.end.line ){
        return;
    }

    const {scroll, className} = options;
    const line = data.start.line + 1;
    const root = this.window.document.getElementById(`${GITHUB.LINESHORT}${line}`);
    let elem;
    let offset = 0;
    let lastElemOffset=0;

    do {
        elem = elem ? elem.nextSibling : root.firstChild;
        lastElemOffset = this.getElemLength(elem);
        offset += lastElemOffset;
    } while (offset <= data.start.ch)

    offset -= lastElemOffset;

    switch(elem.nodeType){
        case ELEMENT_NODE:
            // chrome doesn't support mulitple select
            // proboably when it does, we should switch to selectNode
            // rng = document.createRange(); rng.selectRange(elem);
            elem.classList.add(className);
            if (scroll){
                elem.scrollIntoViewIfNeeded();
            }
            break;

        case TEXT_NODE:
            const rng = this.window.document.createRange();
            rng.setStart(elem, data.start.ch - offset);
            rng.setEnd(elem, data.end.ch - offset);
            const highlightWrapper = this.window.document.createElement('span');
            highlightWrapper.classList.add(GITHUB.WRAPPER, className);
            rng.surroundContents(highlightWrapper);
            if (scroll){
                highlightWrapper.scrollIntoViewIfNeeded();
            }
            break;
    }
}

GihubDomAPI.prototype.getElemLength = function(elem){
    switch(elem.nodeType){
        case ELEMENT_NODE:
            return elem.innerText.length;
            break;

        case TEXT_NODE:
            return elem.length;
            break;

        default :
            throw 'Unexpected type';
    }
}

module.exports = GihubDomAPI;
