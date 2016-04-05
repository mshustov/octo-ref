class Styler {
    constructor(getTemplate){
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        this.sheet = style.sheet;
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
