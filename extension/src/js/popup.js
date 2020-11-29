(function () {
    $(document).ready(function () {
        const $copyBtn = $('#copy-btn');
        const $reloadBtn = $('#reload-btn');
        const $deleteBtn = $('#delete-btn');
        const $textarea = $('#words');

        async function getStorageValue(key) {
            return new Promise(resolve => {
                chrome.storage.local.get(key, data => {
                    resolve(data[key]);
                });
            });
        }

        function setStorageValue(key, value) {
            let obj = {};
            obj[key] = value;
            chrome.storage.local.set(obj);
        }

        function getDictionaryKey() {
            return 'google_translate_dict';
        }

        async function getDictionary() {
            const _default = JSON.stringify([]);
            let storageValue = await getStorageValue(getDictionaryKey());
            let json = storageValue || _default;
            return JSON.parse(json);
        }
        
        async function insertDictionaryToTextArea() {
            let dictionary = await getDictionary();
            $textarea.val(dictionary.join('\r\n'));
        }

        $reloadBtn.on('click', function () {
            insertDictionaryToTextArea();
        });

        $copyBtn.on('click', function () {
            $textarea.select();
            document.execCommand("copy");
            alert('Текст скопирован в буффер обмена');
        });

        $deleteBtn.on('click', function () {
            if (!confirm("Очистить словарь?")) {
               return;
            }

            setStorageValue(getDictionaryKey(), JSON.stringify([]));
            insertDictionaryToTextArea();
        });

        insertDictionaryToTextArea();
    });
})();