import syncer from './lib/sync-storage';
import config from './config';
import Server from './lib/server';

(function ensureSettings(rule, defaultValue){
    syncer.getData(rule, (data) => {
        if(!data) {
            syncer.setData(rule, defaultValue);
        }
    });
})('octoRef', config.settings);
const server = new Server();
// TODO check changes to browser namespace https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/sendMessage
chrome.runtime.onMessage.addListener((request, sender, callback) => {
    const { url, content } = request.data; // NOTE: sender.url !== window.location.url

    switch(request.cmd){

        case 'definition':
            const {line, character} = request.data.end;

            const result = server.getDefinition(url, line, character, content);
            callback(result);
            break;

        default:
            throw new Error('Unknown type');
    }
});
