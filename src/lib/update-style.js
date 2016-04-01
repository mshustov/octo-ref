export default function () {
    var sheet = (function() {
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        return style.sheet;
    })();

    function createStyle(selector, color) {
        return `.${selector}
        {
            border-radius: 3px;
            background-color: #${color};
        }`;
    }

    function updateStyle(styles, deleteOld){
        // TODO overlay styles
        Object.keys(styles).forEach((key, i)=> {
            if (deleteOld) {
                try{
                    sheet.deleteRule(0);
                } catch (e) {}
            }
            const style = createStyle(key, styles[key]);
            sheet.insertRule(style, i);
        })
    }

    const defaultSettings = {
        refColor: 'ffee00',
        defColor: 'e6c8ec',
        control: 'alt',
        scroll: false
    };

    chrome.storage.local.remove('gitTern');
    // TODO should we change local --> sync?
    chrome.storage.local.get('gitTern', function(data) {
        if(!data.color) { // in case of empty {}
            data = defaultSettings;
            chrome.storage.local.set({gitTern: defaultSettings});
        }
        updateStyle(data.color);
    });


    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            if (key === 'gitTern'){
                debugger;
                updateStyle(changes[key].newValue.color, true);
            }
        }
    });
}
// }
