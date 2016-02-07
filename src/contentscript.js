const settings = {
    source: {
        className: 'extension-source',
        active: true,
        scroll: true
    },
    reference: {
        className: 'extension-reference',
        active: true,
        scroll: false
    }
};

const GITHUB = {
    CONTAINER: 'blob-wrapper',
    FILENAME: 'js-permalink-shortcut', // another for gist
    LINE: 'js-file-line',
    LINESHORT: 'LC'
}

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

class GitTern{
    constructor(options){
        this.addHandlers();
        this.send('register', {content: this.getFileContent()}, ()=>{});
    }

    addHandlers() {
        document.querySelector(`.${GITHUB.CONTAINER}`)
                .addEventListener('click', this.findDefinition.bind(this));
    }

    findDefinition(){
        Array.from(document.querySelectorAll(
            [`.${settings.reference.className}`, `.${settings.source.className}`]
        )).forEach((elem)=> this.cleanUp(elem));
        const selection = window.getSelection();
        selection.modify('move', 'forward', 'word'); // forward to the end of the word
        const elem = selection.focusNode;
        const line = this.getLineNumber(elem);
        const ch = this.getEndColumnPosition(elem);

        if (settings.source.active) {
            this.send(
                'definition',
                {
                    type: 'definition',
                    end: {line, ch},
                    lineCharPositions: true,
                    variable: null
                },
                (e) => this.showDefinition(e)
            );
        }
        if (settings.reference.active) {
            this.send(
                'refs',
                {
                    type: 'refs',
                    end: {line,ch},
                    lineCharPositions: true,
                    variable: null
                },
                (e) => this.showRefs(e)
            );
        }
    }

    send(cmd, data, cb){
        // FIX ME - add long live connection
        chrome.extension.sendMessage({ cmd, data }, cb);
    }

    _show(data, type){
        const {scroll, className} = settings[type];
        const line = data.start.line + 1;
        const root = document.getElementById(`${GITHUB.LINESHORT}${line}`);
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
                var rng = document.createRange();
                rng.setStart(elem, data.start.ch - offset);
                rng.setEnd(elem, data.end.ch - offset);
                var highlightWrapper = document.createElement('span');
                highlightWrapper.classList.add('text-wrapper-source', className);
                rng.surroundContents(highlightWrapper);
                if (scroll){
                    highlightWrapper.scrollIntoViewIfNeeded();
                }
                break;
        }
    }

    showRefs(data){
        if (data && data.refs){
            data.refs.forEach((ref) => this._show(ref, 'reference'));
        }
    }

    showDefinition(data){
        if (data && data.start && data.end){
            this._show(data, 'source')
        }
    }

    cleanUp(item){
        item.classList.remove(settings.source.className, settings.reference.className);
        if (item.classList.contains('text-wrapper-source')){
            item.parentNode.replaceChild(item.firstChild, item);
        }
    }

    getFileContent(){
        const fileContainer = document.getElementsByClassName(GITHUB.CONTAINER)[0];
        return fileContainer.innerText;
    }

    getFileName(){
        const permalinkContainer = document.getElementsByClassName(GITHUB.FILENAME)[0];
        return permalinkContainer.getAttribute('href');
    }

    getElemLength(elem){
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

    getEndColumnPosition(elem){
        const selection = window.getSelection();
        let pos = selection ? selection.focusOffset : 0;

        // vertical aligh to the line of code
        while(!elem.parentElement.classList.contains(GITHUB.LINE)){
            elem = elem.parentElement;
        }

        // count horizontal offset
        while(elem = elem.previousSibling){
            pos += this.getElemLength (elem);
        }

        return pos;
    }

    getLineNumber(elem){
        while(elem = elem.parentNode){
            if(elem.classList && elem.classList.contains(GITHUB.LINE)) {
                return parseInt(elem.getAttribute('id').replace(/^\w./,''), 10) - 1;
            }
        }
        return null;
    }
}

new GitTern();
