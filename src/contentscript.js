import injection from 'github-injection'; // TODO refactor this
import GitTern from './lib/core.js';
import Styler from './lib/update-style';
import Syncer from './lib/sync-storage';

// MOVE IT
const defaultSettings = {
    refColor: 'ffee00',
    defColor: 'e6c8ec',
    control: 'alt',
    scroll: false
};

const template = (selector, color) =>
    `.${selector}
    {
        border-radius: 3px;
        background-color: #${color};
    }`

const styler = new Styler(template);

new Syncer('gitTern', defaultSettings, (data)=>{
    if(!data){
        debugger;
    }
    const { defColor, refColor} = data;
    styler.removeRules();
    styler.updateStyle({refColor, defColor});
});

// module.exports  = function(global, options, cb) {
  // var instance  = new GitTern(window, {
  //   type: 'github'
  // });

const adaptersMap = {
    'github.com': 'github',
    'gist.github.com': 'gist-github'
};

const type = adaptersMap[window.location.hostname];

if (type) {
    const Adapter = require('./siteAdapter/' + type);
    injection(window, function() {
        new GitTern(window, Adapter);
    });
}
// };
