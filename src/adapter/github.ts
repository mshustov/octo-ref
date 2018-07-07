const GITHUB = {
    CONTAINER: '.blob-wrapper tbody',
    FILENAME: '.js-permalink-shortcut',
    LINE: 'js-file-line',
    LINESHORT: 'LC',
    WRAPPER: 'text-wrapper-source'
}

const enum NODE {
    ELEMENT = 1,
    TEXT = 3
}

class GithubDomAPI implements GithubDomAPI {
    window: Window
    root: Element
    fileContent: string
    fileName: string

    static getClosestElement (startElem) {
        let elem = startElem;
        while (elem.nodeType !== NODE.ELEMENT) {
            elem = elem.parentElement
        }
        return elem;
    }

    constructor(window) {
        this.window = window;
        window.adapter = this;
        window.ziga = 'zaga'
        console.log('>>> window.adapter', typeof this, new Date().toISOString());
        this.root = this.window.document.querySelector(GITHUB.CONTAINER);

        this.fileContent = this.calcFileContent(this.root);
        const permalinkContainer = this.window.document.querySelector(GITHUB.FILENAME);
        this.fileName = permalinkContainer.getAttribute('href');
    }

    calcFileContent(root){
        return Array.from(root.children)
            .map((i: HTMLElement): string => i.innerText)
            // due to GH Markup we can't get \n for empty comment string, so we force empty string to \n
            .map(str => str === '\n' ? '' : str)
            .join('\n');
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
        const elems = this.root.querySelectorAll(selectorClasses);
        Array.from(elems).forEach((elem: HTMLElement): void => {
            elem.classList.remove(...selectors);
            if (elem.classList.contains(GITHUB.WRAPPER)){
                elem.parentNode.replaceChild(elem.firstChild, elem);
            }
        });
    }

    getSelectedElemPosition(){
        const elem = this.getElem();
        const rawPosition = this.getElemPosition(elem);

        const position = this.normalizeFromAdapterFormat(rawPosition);

        return position;
    }

    // ts and github have differnt offsets
    normalizeFromAdapterFormat(position){
        return {
            line: position.line - 1,
            character: position.character - 1
        }
    }

    normalizeToAdapterFormat(position){
        return {
            line: position.line + 1,
            character: position.character
        }
    }

    getElem(){
        const selection = this.window.getSelection();
         // forward to the end of the word. we need provide this info for tern.
         // after click on word: funct|ion 
         // after modifing: function|
        // selection.modify('move', 'forward', 'word');
        return selection.focusNode;
    }

    getElemPosition(elem){
        const line = this.getLineNumber(elem);
        const character = this.getEndColumnPosition(elem);

        return { line, character };
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

    private _iterateUnitlOffset(root, endOffset){
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

    private _createDOMWrapper(className){
        const highlightWrapper = this.window.document.createElement('span');
        highlightWrapper.classList.add(GITHUB.WRAPPER, className);
        return highlightWrapper;
    }

    private _createHighlightDOMWrapper(elem, { start, end }, className){
        const rng = this.window.document.createRange();
        rng.setStart(elem, start);
        rng.setEnd(elem, end);

        const highlightWrapper = this._createDOMWrapper(className);
        rng.surroundContents(highlightWrapper);
    }

    private _getDOMMappring(data){
        const line = data.start.line;
        const root = this.window.document.getElementById(`${GITHUB.LINESHORT}${line}`);
        const { elem, offset } = this._iterateUnitlOffset(root, data.start.character)
        return { elem, offset };
    }

    highlight(data, options){
        const { elem, offset } = this._getDOMMappring(data);
        const { className } = options;
        switch(elem.nodeType){
            case NODE.ELEMENT:
                // chrome doesn't support mulitple select
                // probably when it does, we should switch to selectNode
                // google: Discontiguous selection is not supported.
                elem.classList.add(className);
                break;

            case NODE.TEXT:
                const start = data.start.character - offset;
                const end = data.start.character + data.length - offset;

                this._createHighlightDOMWrapper(elem, { start, end }, className)
                break;
        }
    }

    jumpToDefinition(data){
        const { elem } = this._getDOMMappring(data);

        const scrollTo = GithubDomAPI.getClosestElement(elem);
        scrollTo.scrollIntoViewIfNeeded();
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

    checkIsNextUsage (item, currentPosition) {
        // TODO probably it should be thought over to reduce casting cases
        const castedCurrentPosition = this.normalizeToAdapterFormat(currentPosition);
        const isNext = item.start.line > castedCurrentPosition.line || 
            (
                item.start.line === castedCurrentPosition.line &&
                item.start.character > castedCurrentPosition.character
            )
        return isNext;
    }
}

export default GithubDomAPI;
