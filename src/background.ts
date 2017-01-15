import Server from './lib/server';
const server = new Server();

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
