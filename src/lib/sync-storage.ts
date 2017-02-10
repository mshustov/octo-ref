const syncer : Syncer = {
    remove(rule){
        chrome.storage.sync.remove(rule);
    },
    getData(rule, cb){
        chrome.storage.sync.get(rule, (data) => cb(data[rule]));
    },

    setData(rule, data, cb){
        chrome.storage.sync.set({ [rule]: data }, cb);
    },

    subscribe(rule, cb) {
        chrome.storage.onChanged.addListener(function(changes) {
            for (var key in changes) {
                if (key === rule){
                    cb(changes[key].newValue)
                }
            }
        });
    }
}

export default syncer;
