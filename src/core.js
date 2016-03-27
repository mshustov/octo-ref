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

function GitTern (root, Adapter){
    this.findDefinition= this.findDefinition.bind(this);
    this.showDefinition = this.showDefinition.bind(this);
    this.showRefs = this.showRefs.bind(this);
    this.domAPI = new Adapter(root);
    // TODO remove handlers

    if(this.domAPI.isCodePage()){
        this.addHandlers();
        this.send('register',
            { content: this.domAPI.getFileContent() },
            (err, status) => console.log(status)
        );
    }
}

// FIX ME  change handler name
GitTern.prototype.addHandlers = function(type){
    this.domAPI.subscribe('click', this.clickHandler.bind(this));
}

GitTern.prototype.clickHandler = function(e){
    if(e && e.altKey) {
        this.findDefinition();
    }
}

GitTern.prototype.findDefinition = function(){
    const classNames = Object.keys(settings).map((type) => settings[type].className);
    this.domAPI.clean(classNames);
    const elem = this.domAPI.getElem();
    const line = this.domAPI.getLineNumber(elem);
    const ch = this.domAPI.getEndColumnPosition(elem);
    if (settings.source.active) {
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
    }
    if (settings.reference.active) {
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
}

GitTern.prototype.send = function(cmd, data, cb){
    // FIX ME - add long live connection
    chrome.extension.sendMessage({ cmd, data }, cb);
}

GitTern.prototype.showRefs = function(data){
    if (data && data.refs){
        const type = 'reference';
        const {scroll, className} = settings[type];
        data.refs.forEach((ref) => {
            this.domAPI.show( ref, {
                scroll,
                className
            });
        })
    }
}

GitTern.prototype.showDefinition = function(data){
    if (data && data.start && data.end){
        const type = 'source';
        const {scroll, className} = settings[type];
        this.domAPI.show( data, {
            scroll,
            className
        })
    }
}

module.exports = GitTern;
