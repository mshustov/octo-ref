import isEmptyObject from '../utils/is-empty-object';

class Syncer{
    constructor(rule, defaultValue, cb){
        // chrome.storage.sync.remove(rule);
        chrome.storage.sync.get(rule, function(data) {
            const value = data[rule];
            if(value) {
                data = defaultValue;
                chrome.storage.sync.set({[rule]: value});
            }
            cb(value);
        });

        chrome.storage.onChanged.addListener(function(changes, namespace) {
            for (var key in changes) {
                if (key === rule){
                    cb(changes[key].newValue)
                }
            }
        });
    }
}

export default Syncer;
