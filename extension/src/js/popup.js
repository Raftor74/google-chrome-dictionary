(function () {
    $(document).ready(function () {
        const dictionaryKey = 'google_translate_dict';
        const storage = new ChromeStorage();
        const $copyBtn = $('#copy-btn');
        const $reloadBtn = $('#reload-btn');
        const $deleteBtn = $('#delete-btn');
        const $textarea = $('#words');

        async function getDictionary() {
            const _default = JSON.stringify([]);
            let storageValue = await storage.get(dictionaryKey);
            let json = storageValue || _default;
            return JSON.parse(json);
        }

        function clearDictionary() {
            storage.set(dictionaryKey, JSON.stringify([]));
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

            clearDictionary();
            insertDictionaryToTextArea();
        });

        insertDictionaryToTextArea();
    });
})();