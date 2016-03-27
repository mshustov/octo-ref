var tern = require('tern');

var server = new tern.Server({
    async: true,
    defs: [],
    plugins: {}
});

chrome.extension.onMessage.addListener(function(request, sender, callback){
    switch(request.cmd){
        case 'register':
            // try? cb(err, status)
            server.addFile(sender.url, request.data.content);
            callback('registered');
            break;

        case 'definition':
        case 'refs':
            request.data.file = sender.url;
            console.log('--------', request.data);
            server.request({query: request.data, files: []}, function(error, data) {
                if (error) {
                    console.log('error while ' + request.cmd, error);
                }
                callback(data);
            });
            break;

        default:
            throw new Error('Unknown type');
    }
});

//chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//    console.log(sender.tab ?
//    "from a content script:" + sender.tab.url :
//        "from the extension");
//    sendResponse({farewell: "goodbye"});
//    debugger;
    //chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    //        console.log(response.farewell);
    //    });
    //});
//});
