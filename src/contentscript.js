import injection from 'github-injection'; // TODO refactor this
import GitTern from './lib/core.js';
import Styler from './lib/update-style';
import Syncer from './lib/sync-storage';
import config from './config';

const template = (selector, color) =>
    `.${selector}
    {
        border-radius: 3px;
        background-color: #${color};
    }`

const styler = new Styler(template);

new Syncer('gitTern', config.settings, (data)=>{
    if(!data){
        debugger;
    }

    config.settings = data;
    const { defColor, refColor } = data;
    styler.removeRules();
    styler.updateStyle({refColor, defColor});
});

const adaptersMap = {
    'github.com': 'github',
    'gist.github.com': 'gist-github'
};

const type = adaptersMap[window.location.hostname];
const validExt = ['js', 'jsx', 'es', 'es6'];

if (type) {
    const Adapter = require('./siteAdapter/' + type);
    let instance;
    injection(window, function() {
        if (validExt.some((ext) => window.location.pathname.endsWith(`.${ext}`))){
            if(instance){
                instance.removeHandlers();
            }
            instance = new GitTern(window, Adapter, config);
        }
    });
}
