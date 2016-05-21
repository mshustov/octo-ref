///<reference path="../../typings/vendors.d.ts"/>

const syncer : Syncer = {
    getData(rule, cb){
        chrome.storage.sync.get(rule, cb);
    },

    setData(data, cb){
        chrome.storage.sync.set(data, cb);
    },

    getDataSetDefault(rule, defaultValue, cb){
        // chrome.storage.sync.remove(rule);
        this.getData(rule, (data) => {
            let value = data[rule];
            if(!value) {
                value = defaultValue;
                this.setData({[rule]: value}, cb);
            }
            cb(value);
        });
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
