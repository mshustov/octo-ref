///<reference path="../../typings/vendors.d.ts"/>

class Styler implements Styler {
    sheet: CSSStyleSheet
    getTemplate: GetTemplate
    constructor(getTemplate){
        const style = document.createElement('style') as HTMLStyleElement;
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        this.sheet = style.sheet as CSSStyleSheet;
        this.getTemplate = getTemplate;
    }

    updateStyle(styles){
        Object.keys(styles).forEach((key, i)=> {
            const style = this.getTemplate(key, styles[key]);
            this.sheet.insertRule(style, i);
        })
    }

    removeRules(){
        let i = this.sheet.rules.length;
        while(i){
            this.sheet.deleteRule(--i);
        }
    }
}

export default Styler;
