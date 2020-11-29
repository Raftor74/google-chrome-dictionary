class ChromeStorage {

    async get(key) {
        return new Promise(resolve => {
            chrome.storage.local.get(key, data => {
                resolve(data[key]);
            });
        });
    }

    set(key, value) {
        let obj = {};
        obj[key] = value;
        chrome.storage.local.set(obj);
    }
}