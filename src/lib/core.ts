///<reference path="../../typings/vendors.d.ts"/>

import { controlKey, keyCode } from './utils';

class OctoRef{
    url: string
    domAPI: GithubDomAPI
    config: any
    // NOTE: could be update to TS 2.x
    static isDefinition(item: Highlight): boolean {
        return item.kind === 'writtenReference';
    }

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
            this.send('register',
                {
                    content: this.domAPI.getFileContent(),
                    url: this.url
                },
                (err, status) => console.log(status)
            );
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
        return {
            highlightOnly: e[controlKey.alt],
            jumpToNextUsage: e[controlKey.cmd] && !e[controlKey.alt],
            jumpToDefinition: e[controlKey.cmd] && e[controlKey.alt]
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
        this.send('definition',
            {
                end: position,
                url,
                content: this.domAPI.getFileContent()
            },
            (data) => {
                this.highlight(actionToDo, data, position);
            }
        );
    }

    send(cmd, data, cb){
        // CHECKME: we should add extensionId, when we get it)
        chrome.runtime.sendMessage({ cmd, data }, cb);
    }

    highlight(actionToDo, rawData, position){
        if (!rawData) return

        const data = rawData.map(rawDataItem => Object.assign({}, rawDataItem, {
            start: this.domAPI.normalizeToAdapterFormat(rawDataItem.start)
        }));

        data.forEach((highlight) => {
            const isForDefiniton = OctoRef.isDefinition(highlight);
            const className = this.config.getClassName(isForDefiniton);

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
