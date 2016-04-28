import * as injection from 'github-injection';
import GitTern from './lib/core.js';
import Styler from './lib/update-style';
import syncer from './lib/sync-storage';
import Adapter from './adapter/github.js';

const config = require('./config.json');


const template = (selector, color) =>
    `.${selector}
    {
        border-radius: 3px;
        background-color: #${color};
    }`

const styler = new Styler(template);

const callback = (data) => {
    if(!data){
        return;
    }

    config.settings = data;
    const { defColor, refColor } = data;
    styler.removeRules();
    styler.updateStyle({refColor, defColor});
}

syncer.getDataSetDefault('gitTern', config.settings, callback);
syncer.subscribe('gitTern', callback)

const adaptersMap = {
    'github.com': 'github'
    // 'gist.github.com': 'gist-github' // TODO add adapter
};

const type = adaptersMap[window.location.hostname];
const isValidExtension = (str = '') => config.ext.some((ext) => {
    // endsWith
    var index = str.lastIndexOf('.');
    return str.slice(index) === ext;
});

let instance;
injection(window, function() {
    const url = window.location.pathname;
    if (isValidExtension(url)){
        if(instance){
            instance.removeHandlers();
        }
        instance = new GitTern(window, Adapter, config);
    }
});

