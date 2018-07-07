import { controls, keyCode } from './utils';
class OctoRef {
    url: string
    domAPI: GithubDomAPI
    config: any
    // NOTE: could be update to TS 2.x
    static isDefinition(item: Highlight): boolean {
        return item.kind === 'writtenReference';
    }

    // TODO  make server lazy?
    constructor(adapter, config, url){
        this.domAPI = adapter;
        if(this.domAPI.isCodePage()){
            this.config = config;
            this.url = url;
            this.findDefinition= this.findDefinition.bind(this);
            this.highlight = this.highlight.bind(this);

            this.handleMousedown = this.handleMousedown.bind(this);
            this.handleClick = this.handleClick.bind(this);
            this.handleKeyup = this.handleKeyup.bind(this);

            this.addHandlers();
        }
    }

    addHandlers(){
        this.domAPI.subscribe('mousedown', this.handleMousedown);
        this.domAPI.subscribe('click', this.handleClick);
        this.domAPI.subscribe('keyup', this.handleKeyup);
    }

    removeHandlers(){
        this.domAPI.unsubscribe('mousedown', this.handleMousedown);
        this.domAPI.unsubscribe('click', this.handleClick);
        this.domAPI.unsubscribe('keyup', this.handleKeyup);
    }

    handleMousedown(e){
        this.clean();
    }

    getDesiredActions(e){
        // TODO create as a type to test in tests for example
        return {
            highlightOnly: Boolean(e[controls.highlight.value]),
            jumpToNextUsage: Boolean(e[controls.jump.value] && !e[controls.highlight.value]),
            jumpToDefinition: Boolean(e[controls.jump.value] && e[controls.highlight.value])
        }
    }

    handleClick(e){
        const actionsToDo = this.getDesiredActions(e);

        const hasActionToDo = Object.keys(actionsToDo).some(key => actionsToDo[key]);
        if(hasActionToDo) {
            this.findDefinition(actionsToDo);
        }
    }

    handleKeyup(e){
        if (e.keyCode === keyCode.ESC) {
            this.clean();
        }
    }

    clean(){
        const classNames = Object.keys(this.config.className).map((type) => this.config.className[type]);
        this.domAPI.clean(classNames);
    }

    findDefinition(actionToDo = {}){
        const position = this.domAPI.getSelectedElemPosition();
        const url = this.url;
        const content = this.domAPI.getFileContent()
        const {line, character} = position;

        // const response = this.server.getDefinition(url, line, character, content);

        // this.highlight(actionToDo, response, position);
        console.log('>>> findDefinition', url, JSON.stringify(position), this.domAPI.getFileContent());
        debugger
        this.send('definition',
            {
                end: position,
                url,
                // we used to cache content and didn't send it every time
                // but sometimes chrome restarts and we could lose data
                content: this.domAPI.getFileContent()
            },
            (data) => {
                console.log('>>> send cb', String(data), JSON.stringify(data));
                this.highlight(actionToDo, data, position);
            }
        );
    }

    send(cmd, data, cb){
        console.log('>>> send');
        // CHECKME: we should add extensionId, when we get it)
        chrome.runtime.sendMessage('ohmmdeimnfadblenffiiheeegbgddpok', { cmd, data }, cb);
    }

    highlight(actionToDo, rawData, position){
        if (!rawData) return

        const data = rawData.map(rawDataItem => Object.assign({}, rawDataItem, {
            start: this.domAPI.normalizeToAdapterFormat(rawDataItem.start)
        }));

        data.forEach((highlight) => {
            const isForDefinition = OctoRef.isDefinition(highlight);
            const className = this.config.getClassName(isForDefinition);

            this.domAPI.highlight( highlight, { className });
        })

        if(actionToDo.jumpToDefinition){
            const positionToJump = data.find(OctoRef.isDefinition);

            this.domAPI.jumpToDefinition(positionToJump);
        }

        if(actionToDo.jumpToNextUsage){
            const nextData = data.find(item => this.domAPI.checkIsNextUsage(item, position));
            const positionToJump = nextData || data[0];

            this.domAPI.jumpToDefinition(positionToJump);
        }
    }
}

export default OctoRef;
