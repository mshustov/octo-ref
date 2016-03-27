var injection = require('github-injection'); // TODO refactor this
var GitTern = require('./core.js');

// module.exports  = function(global, options, cb) {
  // var instance  = new GitTern(window, {
  //   type: 'github'
  // });

var adaptersMap = {
    'github.com': 'github',
    'gist.github.com': 'gist-github'
};

var type = adaptersMap[window.location.hostname];

if (type) {
    var Adapter = require('./siteAdapter/' + type);
    injection(window, function() {
        var instance  = new GitTern(window, Adapter);
    });
}
// };
