import * as injection from 'github-injection';
import OctoRef from './lib/core.js';
import Styler from './lib/update-style';
import syncer from './lib/sync-storage';
import Adapter from './adapter/github';
import { endsWith } from './lib/utils.ts';

const config = require('./config.json');

const template = (selector, color) =>
    `.${selector}
    {
        borderf-radius: 3px;
        background-color: ${color};
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

syncer.getDataSetDefault('octoRef', config.settings, callback);
syncer.subscribe('octoRef', callback)

const adaptersMap = {
    'github.com': 'github'
    // 'gist.github.com': 'gist-github' // TODO add adapter
};

const type = adaptersMap[window.location.hostname];
const isValidExtension = (str = '') => config.ext.some(endsWith.bind(null, str));

let instance;
injection(window, function() {
    const url = window.location.pathname;
    if (isValidExtension(url)){
        if(instance){
            instance.removeHandlers();
        }
        instance = new OctoRef(window, Adapter, config);
    }
});

