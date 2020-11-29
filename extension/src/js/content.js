(function () {

    const googleTranslateShortForm = {
        init: function () {
            this.$container = $('#tw-main');
            this.$mainInputCheckboxContainer = this.initMainInputCheckbox();
            this.$appPanel = this.initTranslatePanel();
            this.render();
            return this;
        },

        render: function () {
            this.renderAppPanel();
            this.renderMainInputCheckbox();
            this.renderSecondaryInputCheckboxes();
        },

        renderMainInputCheckbox: function () {
            const $container = this.getOutput().parent().parent();
            this.getMainInputCheckboxContainer().appendTo($container);
            this.setMainInputTranslate();
        },

        renderSecondaryInputCheckboxes: function () {
            const $elements = this.getSecondaryInputCheckboxContainers();
            $elements.remove();
            setTimeout(function () {
                let that = this;
                const $additionalTranslates = $('.tw-bilingual-entry');
                $.each($additionalTranslates, function (index, element) {
                    let $element = $(element);
                    let word = $element.find('span:first')
                        .find('span:first')
                        .html();
                    let $checkbox = that.initSecondaryInputCheckbox();
                    $checkbox.find('input[type="checkbox"]')
                        .attr('data-word', word)
                        .attr('checked', false);
                    $checkbox.find('.secondary-word-translate')
                        .html(`(${word})`);
                    $checkbox.insertAfter($element);
                });
            }.bind(this), 300);
        },

        renderAppPanel: function () {
            const $container = $('#tw-container');
            const $panel = this.getAppPanel();
            $panel.insertAfter($container);
        },

        getContainer: function () {
            return this.$container;
        },

        getInput: function () {
            return $('#tw-source-text-ta');
        },

        getOutput: function () {
            return $('#tw-target-text');
        },

        getSwitchLang: function () {
            return $('#tw-swap');
        },

        getDeleteBtn: function () {
            return $('#tw-cst');
        },

        getPanel: function () {
            return $('#tw-plp');
        },

        getAppPanel: function () {
            return this.$appPanel;
        },

        isExist: function () {
            return this.getContainer().length > 0;
        },

        isActiveCheckbox: function ($element) {
            return $element.prop('checked');
        },

        getTranslatedWordFromCheckbox: function ($element) {
            return $element.data('word');
        },

        initMainInputCheckbox: function () {
            return $(
                '<div class="main-input-chbx-wrapper">' +
                    '<label for="main-input-chbx">' +
                        '<input id="main-input-chbx" data-word="" type="checkbox">' +
                        '<span>Добавить в словарь <span class="main-word-translate"></span></span>' +
                    '</label>' +
                '</div>'
            );
        },

        initSecondaryInputCheckbox: function () {
            return $(
                '<div class="secondary-input-chbx-wrapper">' +
                    '<label>' +
                        '<input data-word="" type="checkbox">' +
                        '<span>Добавить в словарь <span class="secondary-word-translate"></span></span>' +
                    '</label>' +
                '</div>'
            );
        },

        initTranslatePanel: function () {
            return $(
                '<div id="translate-panel">'+
                    '<input id="custom-translate" type="text" placeholder="Собственный перевод" value="">'+
                    '<button class="tp-save-btn" type="button">Сохранить</button>' +
                    '<button class="tp-reload-btn" type="button">Перезагрузить</button>' +
                '</div>'
            );
        },

        getMainInputCheckboxContainer: function () {
            return this.$mainInputCheckboxContainer;
        },

        getSecondaryInputCheckboxContainers: function () {
            return $('.secondary-input-chbx-wrapper');
        },

        getSecondaryInputCheckboxes: function () {
            let elements = [];
            let $checkboxes = this.getSecondaryInputCheckboxContainers().find('input[type="checkbox"]');
            $.each($checkboxes, function (index, value) {
                elements.push($(value));
            });
            return elements;
        },

        getMainInputCheckbox: function () {
            return this.getMainInputCheckboxContainer()
                .find('input[type="checkbox"]');
        },

        getTranslatedWord: function () {
            return this.getOutput()
                .find('span')
                .html();
        },

        getInputWord: function () {
            return (this.getInput().val() || '')
                .toString()
                .trim()
                .toLowerCase();
        },

        getCustomTranslate: function () {
            return ($('#custom-translate').val() || '')
                .trim()
                .toLowerCase();
        },

        setMainInputTranslate: function () {
            setTimeout(function () {
                const input = this.getInputWord();
                const isInputExist = input.length;
                const word = (isInputExist) ? this.getTranslatedWord() : '';
                const translate = (isInputExist) ? `(${word})` : '';
                this.getMainInputCheckboxContainer()
                    .find('.main-word-translate')
                    .html(translate);
                this.getMainInputCheckbox()
                    .attr('data-word', word);
                this.getMainInputCheckbox()
                    .prop('checked', isInputExist);
            }.bind(this), 300);
        },

        bindEvents: function () {
            const $panel = this.getAppPanel();
            const $reloadBtn = $panel.find('.tp-reload-btn');
            const $saveBtn = $panel.find('.tp-save-btn');

            // Изменение слова для перевода
            this.getInput().on('change keyup valueSet', () => {
                this.setMainInputTranslate();
                this.renderSecondaryInputCheckboxes();
            });

            // Свап языка
            this.getSwitchLang().on('click', () => {
                this.setMainInputTranslate();
                this.renderSecondaryInputCheckboxes();
            });

            // Удаление слова для перевода
            this.getDeleteBtn().on('click', () => {
                this.setMainInputTranslate();
                this.renderSecondaryInputCheckboxes();
            });

            // Перезагрузка словаря
            $reloadBtn.on('click', () => {
                this.setMainInputTranslate();
            });

            // Сохранение словаря
            $saveBtn.on('click', () => {
                this.saveTranslate();
            });
        },

        getTranslateAsString: function () {
            let result = '';
            const input = this.getInputWord();
            const customTranslate = this.getCustomTranslate();
            const checkboxes = {
                main: this.getMainInputCheckbox(),
                secondary: this.getSecondaryInputCheckboxes(),
            };
            const translateCheckboxes = [checkboxes.main].concat(...checkboxes.secondary);
            let translates = translateCheckboxes
                .filter(checkbox => this.isActiveCheckbox(checkbox))
                .map(checkbox => this.getTranslatedWordFromCheckbox(checkbox));

            if (!input.length || !translates.length) {
                return result;
            }

            if (customTranslate.length) {
                translates.push(customTranslate);
            }

            result = `${input} - ${translates.join(';')}`;
            return result;
        },
        
        saveTranslate: async function () {
            const translate = this.getTranslateAsString();
            if (!translate.length) {
                alert("Не выбраны переводы для сохранения");
                return;
            }

            if (!confirm(`Сохранить перевод: ${translate}?`)) {
                return;
            }

            let dictionary = await this.getDictionary();

            if (!Array.isArray(dictionary)) {
                dictionary = [];
            }

            dictionary.push(translate);
            this.saveDictionary(dictionary);
            alert("Перевод добавлен!");
        },

        getDictionaryKey: function () {
            return 'google_translate_dict';
        },

        getDictionary: async function () {
            const key = this.getDictionaryKey();
            const _default = JSON.stringify([]);
            let storageValue = await this.getStorageValue(key);
            let json = storageValue || _default;
            return JSON.parse(json);
        },

        saveDictionary: function (dictionary) {
            this.setStorageValue(this.getDictionaryKey(), JSON.stringify(dictionary));
        },

        getStorageValue: async function (key) {
            return new Promise(resolve => {
                chrome.storage.local.get(key, data => {
                    resolve(data[key]);
                });
            });
        },

        setStorageValue: function (key, value) {
            let obj = {};
            obj[key] = value;
            chrome.storage.local.set(obj);
        }
    };

    const app = {
        init: function () {
            this.$shortForm = googleTranslateShortForm.init();
        },

        getShortForm: function () {
            return this.$shortForm;
        },

        run: function () {
            this.init();
            if (this.getShortForm().isExist()) {
                this.getShortForm().bindEvents();
            }
        },
    };

    app.run();

})();