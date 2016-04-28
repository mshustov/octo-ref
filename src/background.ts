import Server from './lib/server';
const server = new Server({});
// cache is cleared on every browser restart due to manifest settings
const tabIdToUrl = {};

// extension
chrome.runtime.onMessage.addListener((request, sender, callback) => {
    switch(request.cmd){
        case 'register':
            var filename = sender.url;
            server.addFile(filename, request.data.content);
            // we don't want to request 'tab' permissions
            tabIdToUrl[sender.tab.id] = filename;
            callback('registered');
            break;

        case 'definition':
            var filename = sender.url;
            var result = server.getDefinition(filename, request.data.end.line, request.data.end.ch);
            callback(result);
            break;

        default:
            throw new Error('Unknown type');
    }
});

chrome.tabs.onRemoved.addListener(function(tabId){
    var filename = tabIdToUrl[tabId];
    server.removeFile(filename);
    delete tabIdToUrl[tabId];
})
