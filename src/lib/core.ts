///<reference path="../../typings/vendors.d.ts"/>
// TODO: enum 
// next logic:
// alt  - highlight stuff
// cmd  - highlight stuff + jump to definition
// alt + cmd  - highlight stuff + jump to next usage

import { controlKey, keyCode } from './utils.ts';

const isDefinition = (item:Highlight): boolean => item.kind === 'writtenReference';
const getClassName = (config: any, type: Highlight): string => {
    return isDefinition(type) ?
        config.className.source :
        config.className.reference
}

function isNextUsage (item: Highlight, currentPosition: Location): boolean{
    const isNext = item.start.line > currentPosition.line || 
        (
            item.start.line === currentPosition.line &&
            item.start.character > currentPosition.character
        )
    return isNext;
}

class OctoRef{
    url: string
    domAPI: GihubDomAPI
    config: any

    constructor(adapter, config, url){
        this.domAPI = adapter;
        if(this.domAPI.isCodePage()){
            this.url = url; //FIX ME merge config and url
            this.findDefinition= this.findDefinition.bind(this);
            this.doHighlight = this.doHighlight.bind(this); // TODO rename in highlight definition

            this.handleMousedown = this.handleMousedown.bind(this);
            this.handleClick = this.handleClick.bind(this);
            this.handleKeyup = this.handleKeyup.bind(this);

            this.config = config;
        
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
            highlightOnly: e[controlKey.alt], // ?
            jumpToNextUsage: e[controlKey.cmd] && !e[controlKey.alt],
            jumpToDefinition: e[controlKey.cmd] && e[controlKey.alt]
        }
    }

    handleClick(e){
        const shouldDo = this.getDesiredActions(e);

        const hasActionToDo = Object.keys(shouldDo).some(key => shouldDo[key]);
        if(hasActionToDo) {
            this.findDefinition(shouldDo);
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

    findDefinition(shouldDo = {}){
        const position = this.domAPI.getSelectedElemPosition();
        const url = this.url;
        this.send('definition',
            {
                end: position,
                url
            },
            (data) => {
                this.doHighlight(shouldDo, data, position);
            }
        );
    }

    send(cmd, data, cb){
        // CHECKME: we should add extensionId, when we get it)
        chrome.runtime.sendMessage({ cmd, data }, cb);
    }

    doHighlight(shouldDo, data, position){
        if (!data) return

        data.forEach((highlight) => {
            const className = getClassName(this.config, highlight);

            this.domAPI.highlight( highlight, { className });
        })

        if(shouldDo.jumpToDefinition){
            const defData = data.find(isDefinition);

            this.domAPI.jumpToDefinition(defData);
        }

        if(shouldDo.jumpToNextUsage){
            const nextData = data.find(item => isNextUsage(item, position));
            const jumpToPosition = nextData || data[0];

            this.domAPI.jumpToDefinition(jumpToPosition);
        }
    }
}

export default OctoRef;

/*
https://github.com/Microsoft/TypeScript/blob/32a9196354638400680897da5a8e0d6715440cae/lib/typescript.d.ts
https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
*/
     
