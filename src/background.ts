import Server from './lib/server';
const server = new Server();
// cache is cleared on every browser restart due to manifest settings
const tabIdToUrl = {};

chrome.runtime.onMessage.addListener((request, sender, callback) => {
    const { url, content } = request.data; // NOTE: sender.url !== window.location.url

    switch(request.cmd){
        case 'register':
            // we don't want to request 'tab' permissions
            tabIdToUrl[sender.tab.id] = url;
            callback('registered');
            break;

        case 'definition':
            const {line, character} = request.data.end;
            const result = server.getDefinition(url, line, character, content);
            callback(result);
            break;

        default:
            throw new Error('Unknown type');
    }
});

chrome.tabs.onRemoved.addListener(function(tabId){
    const filename = tabIdToUrl[tabId];
    delete tabIdToUrl[tabId];
})
