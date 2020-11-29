(function () {

    const popup = {
        init: function () {
            this.dictionary = new TranslateDictionary();
            this.$copyBtn = $('#copy-btn');
            this.$reloadBtn = $('#reload-btn');
            this.$deleteBtn = $('#delete-btn');
            this.$textarea = $('#words');
            this.bindEvents();
        },

        bindEvents: function () {
            this.$reloadBtn.on('click', () => {
                this.insertDictionaryToTextArea();
            });

            this.$copyBtn.on('click', () => {
                this.copyTextAreaTextToBuffer();
            });

            this.$deleteBtn.on('click', () => {
                if (!confirm("Очистить словарь?")) {
                    return;
                }

                this.eraseDictionary();
                this.insertDictionaryToTextArea();
            });
        },

        getDictionary: async function () {
            return await this.dictionary.get();
        },

        eraseDictionary: function () {
            this.dictionary.erase();
        },

        insertDictionaryToTextArea: async function () {
            let dictionary = await this.getDictionary();
            this.$textarea.val(dictionary.join('\r\n'));
        },

        copyTextAreaTextToBuffer: function () {
            this.$textarea.select();
            document.execCommand("copy");
        }
    };

    $(document).ready(function () {
        popup.init();
        popup.insertDictionaryToTextArea();
    });
})();