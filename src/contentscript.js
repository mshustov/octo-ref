import injection from 'github-injection'; // TODO refactor this
import GitTern from './lib/core.js';
import updateStyle from './lib/update-style.js';

updateStyle();
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
