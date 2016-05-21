/// <reference path="../../typings/vendors.d.ts" />

import { toArray } from '../lib/utils.ts';

const GITHUB = {
    CONTAINER: 'blob-wrapper',
    FILENAME: 'js-permalink-shortcut',
    LINE: 'js-file-line',
    LINESHORT: 'LC',
    WRAPPER: 'text-wrapper-source'
}

const enum NODE {
    ELEMENT = 1,
    TEXT = 3
}

class GihubDomAPI implements GihubDomAPI {
    window: Window
    root: HTMLElement
    fileContent: string
    fileName: string
    constructor(window) {
        this.window = window;
        this.root = window.document.querySelector(`.${GITHUB.CONTAINER}`);

        this.fileContent = this.root.innerText;
        const permalinkContainer = window.document.querySelector(`.${GITHUB.FILENAME}`);
        this.fileName = permalinkContainer.getAttribute('href');
    }

    getRoot(){
        return this.root;
    }

    isCodePage(){
        return Boolean(this.root);
    }

    getFileContent(){
        return this.fileContent;
    }

    getFilename(){
        return this.fileName;
    }

    subscribe(event, fn){
        return this.window.addEventListener(event, fn);
    }

    unsubscribe(event, fn){
        return this.window.removeEventListener(event, fn);
    }

    clean(selectors){
        const selectorClasses = selectors.map((selector) => `.${selector}`);
        // we need intersection of many
        const elems = this.window.document.querySelectorAll(selectorClasses);
        toArray(elems).forEach((elem) => {
            elem.classList.remove(...selectors); // borrowed?
            if (elem.classList.contains(GITHUB.WRAPPER)){
                elem.parentNode.replaceChild(elem.firstChild, elem);
            }
        });
    }

    getElem(){
        const selection = this.window.getSelection();
         // forward to the end of the word. we need provide this info for tern.
         // after click on word: funct|ion 
         // after modifing: function|
        // selection.modify('move', 'forward', 'word');
        return selection.focusNode;
    }

    getLineNumber(elem){
        while(elem = elem.parentNode){
            if(elem.classList && elem.classList.contains(GITHUB.LINE)) {
                return parseInt(elem.getAttribute('id').replace(/^\w./,''), 10);
            }
        }
        return null;
    }

    getEndColumnPosition(elem){
        // vertical aligh to the line of code
        if(elem.classList && elem.classList.contains(GITHUB.LINE)){
            return 0;
        }

        while(!elem.parentElement.classList.contains(GITHUB.LINE)){
            elem = elem.parentElement;
        }

        var selection = this.window.getSelection();
        let pos = selection ? selection.focusOffset : 0;

        // count horizontal offset
        while(elem = elem.previousSibling){
            pos += this.getElemLength (elem);
        }

        return pos;
    }

    _iterateUnitlOffset(root, endOffset){
        let elem;
        let offset = 0;
        let lastElemOffset = 0;

        do {
            elem = elem ? elem.nextSibling : root.firstChild;
            lastElemOffset = this.getElemLength(elem);
            offset += lastElemOffset;
        } while (offset <= endOffset)

        offset -= lastElemOffset;

        return { elem, offset };
    }

    show(data, options){
        if (!data) {
            return;
        }
        const {scroll, className} = options;
        const line = data.start.line;
        const root = this.window.document.getElementById(`${GITHUB.LINESHORT}${line}`);
        const { elem, offset } = this._iterateUnitlOffset(root, data.start.character)

        switch(elem.nodeType){
            case NODE.ELEMENT:
                // chrome doesn't support mulitple select
                // proboably when it does, we should switch to selectNode
                // rng = document.createRange(); rng.selectRange(elem);
                elem.classList.add(className);
                break;

            case NODE.TEXT:
                const rng = this.window.document.createRange();
                rng.setStart(elem, data.start.character - offset);
                rng.setEnd(elem, data.start.character + data.length - offset);
                const highlightWrapper = this.window.document.createElement('span');
                highlightWrapper.classList.add(GITHUB.WRAPPER, className);
                rng.surroundContents(highlightWrapper);
                break;
        }
        if (scroll && data.kind === 'writtenReference') {
            const scrollTo = elem.nodeType === NODE.ELEMENT ? elem : elem.parentElement;
            scrollTo.scrollIntoViewIfNeeded();
        }
    }

    getElemLength(elem){
        switch(elem.nodeType){
            case NODE.ELEMENT:
                return elem.innerText.length;

            case NODE.TEXT:
                return elem.length;

            default :
                throw 'Unexpected type';
        }
    }
}

export default GihubDomAPI;
