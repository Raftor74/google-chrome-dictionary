class TranslateDictionary {
    constructor() {
        this.storage = new ChromeStorage();
    }

    get key() {
        return 'google_translate_dict';
    }

    async get() {
        const _default = JSON.stringify([]);
        let json = await this.storage.get(this.key) || _default;
        return JSON.parse(json);
    }

    set(dictionary_list) {
        this.storage.set(this.key, JSON.stringify(dictionary_list));
    }

    erase() {
        this.set([]);
    }
}