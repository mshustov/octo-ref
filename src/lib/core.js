const controlKey = {
    cmd: 'metaKey',
    alt: 'altKey'
}

const tsKind2Type = {
    'writtenReference': 'source',
    'reference': 'reference'
};

const ESC = 27;

class GitTern{
    constructor(root, Adapter, config){
        this.findDefinition= this.findDefinition.bind(this);
        this.showDefinition = this.showDefinition.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.domAPI = new Adapter(root);
        this.config = config;
        // TODO remove handlers

        if(this.domAPI.isCodePage()){
            this.addHandlers();
            this.send('register', { content: this.domAPI.getFileContent() }, (err, status) => console.log(status));
        }
    }

    addHandlers(){
        this.domAPI.subscribe('click', this.clickHandler);
        this.domAPI.subscribe('keyup', this.keyupHandler);
    }

    removeHandlers(){
        this.domAPI.unsubscribe('click', this.clickHandler);
        this.domAPI.unsubscribe('keyup', this.keyupHandler);
    }

    clickHandler(e){
        var eventType = controlKey[this.config.settings.control];
        if(e[eventType]) {
            this.findDefinition();
        }
    }

    keyupHandler(e){
        if (e.keyCode === ESC) {
            this.clean();
        }
    }

    clean(){
        const classNames = Object.keys(this.config.className).map((type) => this.config.className[type]);
        this.domAPI.clean(classNames);
    }

    findDefinition(){
        this.clean();
        const elem = this.domAPI.getElem();
        const line = this.domAPI.getLineNumber(elem);
        const ch = this.domAPI.getEndColumnPosition(elem);

        this.send('definition', {end: {line, ch}},this.showDefinition);
    }

    send(cmd, data, cb){
        // FIX ME - add long live connection
        chrome.extension.sendMessage({ cmd, data }, cb);
    }

    showDefinition(data){
        if (data && Array.isArray(data)){
            data.forEach((highlight) => {
                const type = tsKind2Type[highlight.kind];
                this.domAPI.show( highlight, {
                    scroll: this.config.settings.scroll,
                    className: this.config.className[type]
                });
            })
        }
    }
}

export default GitTern;
