const controlKey = {
    cmd: 'metaKey',
    alt: 'altKey'
}

const ESC = 27;

function GitTern (root, Adapter, config){
    this.findDefinition= this.findDefinition.bind(this);
    this.showDefinition = this.showDefinition.bind(this);
    this.showRefs = this.showRefs.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.keyupHandler = this.keyupHandler.bind(this);
    this.domAPI = new Adapter(root);
    this.config = config;
    // TODO remove handlers

    if(this.domAPI.isCodePage()){
        this.addHandlers();
        this.send(
            'register',
            { content: this.domAPI.getFileContent() },
            (err, status) => console.log(status)
        );
    }
}

// FIX ME  change handler name
GitTern.prototype.addHandlers = function(){
    this.domAPI.subscribe('click', this.clickHandler);
    this.domAPI.subscribe('keyup', this.keyupHandler);
}

GitTern.prototype.removeHandlers = function(){
    this.domAPI.unsubscribe('click', this.clickHandler);
    this.domAPI.unsubscribe('keyup', this.keyupHandler);
}

GitTern.prototype.clickHandler = function(e){
    var eventType = controlKey[this.config.settings.control];
    if(e[eventType]) {
        this.findDefinition();
    }
}

GitTern.prototype.keyupHandler = function(e){
    if (e.keyCode === ESC) {
        this.clean();
    }
}

GitTern.prototype.clean = function(){
    const classNames = Object.keys(this.config.className).map((type) => this.config.className[type]);
    this.domAPI.clean(classNames);
}

GitTern.prototype.findDefinition = function(){
    this.clean();
    const elem = this.domAPI.getElem();
    const line = this.domAPI.getLineNumber(elem);
    const ch = this.domAPI.getEndColumnPosition(elem);

    this.send(
        'definition',
        {
            type: 'definition',
            end: {line, ch},
            lineCharPositions: true,
            variable: null
        },
        this.showDefinition
    );

    this.send(
        'refs',
        {
            type: 'refs',
            end: {line, ch},
            lineCharPositions: true,
            variable: null
        },
        this.showRefs
    );
}

GitTern.prototype.send = function(cmd, data, cb){
    // FIX ME - add long live connection
    chrome.extension.sendMessage({ cmd, data }, cb);
}

GitTern.prototype.showRefs = function(data){
    if (data && data.refs){
        const type = 'reference';

        data.refs.forEach((ref) => {
            this.domAPI.show( ref, {
                className: this.config.className[type]
            });
        })
    }
}

GitTern.prototype.showDefinition = function(data){
    if (data && data.start && data.end){
        const type = 'source';

        this.domAPI.show( data, {
            scroll: this.config.settings.scroll,
            className: this.config.className[type]
        })
    }
}

module.exports = GitTern;
