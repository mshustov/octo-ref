import * as injection from 'github-injection';
import OctoRef from './lib/core';
import Styler from './lib/update-style';
import syncer from './lib/sync-storage';
import Adapter from './adapter/github';
import { endsWith } from './lib/utils';
import config from './config';

const template = (selector, color) =>
    `.${selector}
    {
        background-color: #${color};
        pointer-events: none;
    }`

const styler = new Styler(template);

const syncCallback = (data) => {
    if(!data){
        return;
    }

    config.settings = data;
    const { defColor, refColor } = data;
    styler.removeRules();
    styler.updateStyle({refColor, defColor});
}

syncer.getDataSetDefault('octoRef', config.settings, syncCallback);
syncer.subscribe('octoRef', syncCallback)

const isValidExtension = (str = '') => config.ext.some(endsWith.bind(null, str));

let instance;
injection(window, function() {
    const url = window.location.pathname;
    if (isValidExtension(url)){
        if(instance){
            instance.removeHandlers();
        }
        const adapter = new Adapter(window);
        instance = new OctoRef(adapter, config, window.location.pathname);
    }
});

