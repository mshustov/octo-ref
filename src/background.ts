import Server from './lib/server';
const server = new Server();
// cache is cleared on every browser restart due to manifest settings
const tabIdToUrl = {};

// extension
chrome.runtime.onMessage.addListener((request, sender, callback) => {
    const filename = request.data.url; // sender.url !== window.location.url
    switch(request.cmd){
        case 'register':
            server.addFile(filename, request.data.content);
            // we don't want to request 'tab' permissions
            tabIdToUrl[sender.tab.id] = filename;
            callback('registered');
            break;

        case 'definition':
            const {line, character} = request.data.end;
            const result = server.getDefinition(filename, line, character);
            callback(result);
            break;

        default:
            throw new Error('Unknown type');
    }
});

chrome.tabs.onRemoved.addListener(function(tabId){
    const filename = tabIdToUrl[tabId];
    server.removeFile(filename);
    delete tabIdToUrl[tabId];
})
