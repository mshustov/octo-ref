import * as injection from 'github-injection';
import OctoRef from './lib/core';
import Styler from './lib/update-style';
import template from './lib/template';
import syncer from './lib/sync-storage';
import Adapter from './adapter/github';
import config from './config';

const styler = new Styler(template);

const syncCallback = (data) => {
    config.settings = data;
    const { defColor, refColor } = data;

    styler.removeRules();
    styler.updateStyle({refColor, defColor});
}

syncer.getData('octoRef', syncCallback);
syncer.subscribe('octoRef', syncCallback)

const isValidExtension = (str = '') => config.ext.some(s => str.endsWith(s));

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

