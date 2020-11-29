(function () {

    const googleTranslateShortForm = {
        init: function () {
            this.mainTimerId = null;
            this.secondaryTimerId = null;
            this.storage = new ChromeStorage();
            this.render();
            return this;
        },

        render: function () {
            this.renderAppPanel();
            this.renderMainInputCheckboxContainer();
            this.renderSecondaryInputCheckboxContainers();
        },

        renderMainInputCheckboxContainer: function () {
            const $container = this.getOutput().parent().parent();
            const $element = this.initMainInputCheckboxContainer();
            $element.appendTo($container);
            this.setMainInputTranslate();
        },

        renderSecondaryInputCheckboxContainers: function () {
            const action = function () {
                let that = this;
                let $elements = this.getSecondaryInputCheckboxContainers();
                let $additionalTranslates = $('.tw-bilingual-entry');
                $elements.remove();
                $.each($additionalTranslates, function (index, element) {
                    let $element = $(element);
                    let word = $element.find('span:first')
                        .find('span:first')
                        .html();
                    let $checkbox = that.initSecondaryInputCheckboxContainer();
                    $checkbox.find('input[type="checkbox"]')
                        .attr('data-word', word)
                        .attr('checked', false);
                    $checkbox.find('.secondary-word-translate')
                        .html(`(${word})`);
                    $checkbox.insertAfter($element);
                });
            };

            this.secondaryTimerId = this.setDelayedAction(this.secondaryTimerId, action, 800);
        },

        renderAppPanel: function () {
            const $container = $('#tw-container');
            const $panel = this.initControlPanel();
            $panel.insertAfter($container);
        },

        getContainer: function () {
            return $('#tw-main');
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

        getControlPanel: function () {
            return $('#dictionary-control-panel');
        },

        isExist: function () {
            return this.getContainer().length > 0;
        },

        isActiveCheckbox: function ($element) {
            return $element.prop('checked');
        },

        getTranslatedWordFromCheckbox: function ($element) {
            return $element.attr('data-word');
        },

        initMainInputCheckboxContainer: function () {
            return $(
                '<div id="main-input-chbx-wrapper" class="main-input-chbx-wrapper">' +
                    '<label for="main-input-chbx">' +
                        '<input id="main-input-chbx" data-word="" type="checkbox">' +
                        '<span>Добавить в словарь <span class="main-word-translate"></span></span>' +
                    '</label>' +
                '</div>'
            );
        },

        initSecondaryInputCheckboxContainer: function () {
            return $(
                '<div class="secondary-input-chbx-wrapper">' +
                    '<label>' +
                        '<input data-word="" type="checkbox">' +
                        '<span>Добавить в словарь <span class="secondary-word-translate"></span></span>' +
                    '</label>' +
                '</div>'
            );
        },

        initControlPanel: function () {
            return $(
                '<div id="dictionary-control-panel">'+
                    '<input id="custom-translate" type="text" placeholder="Собственный перевод" value="">'+
                    '<button class="tp-save-btn" type="button">Сохранить</button>' +
                    '<button class="tp-reload-btn" type="button">Перезагрузить</button>' +
                '</div>'
            );
        },

        getMainInputCheckboxContainer: function () {
            return $('#main-input-chbx-wrapper');
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
            return $('#main-input-chbx');
        },

        getTranslatedWord: function () {
            return this.getOutput()
                .find('span')
                .html()
                .toString()
                .toLowerCase();
        },

        getInputWord: function () {
            return (this.getInput().val() || '')
                .toString()
                .trim()
                .toLowerCase();
        },

        getCustomTranslate: function () {
            return $('#custom-translate');
        },

        getCustomTranslateValue: function () {
            return (this.getCustomTranslate().val() || '')
                .trim()
                .toLowerCase();
        },

        setMainInputTranslate: function () {
            const action = function () {
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
            };

            this.mainTimerId = this.setDelayedAction(this.mainTimerId, action, 800);
        },

        setDelayedAction: function(timer, func, delay, args = []) {
            clearTimeout(timer);
            // Для сохранения контектста this
            let action = func.bind(this);
            return setTimeout(action, delay, ...args);
        },

        clearForm: function() {
            this.getDeleteBtn().click();
            this.getCustomTranslate().val('');
        },

        bindEvents: function () {
            const $panel = this.getControlPanel();
            const $reloadBtn = $panel.find('.tp-reload-btn');
            const $saveBtn = $panel.find('.tp-save-btn');

            // Изменение слова для перевода
            this.getInput().on('keyup keypress blur change valueSet', () => {
                this.setMainInputTranslate();
                this.renderSecondaryInputCheckboxContainers();
            });

            // Свап языка
            this.getSwitchLang().on('click', () => {
                this.setMainInputTranslate();
                this.renderSecondaryInputCheckboxContainers();
            });

            // Удаление слова для перевода
            this.getDeleteBtn().on('click', () => {
                this.setMainInputTranslate();
                this.renderSecondaryInputCheckboxContainers();
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
            let input = this.getInputWord();
            let customTranslate = this.getCustomTranslateValue();
            let mainCheckbox = this.getMainInputCheckbox();
            let secondaryCheckboxes = this.getSecondaryInputCheckboxes();
            let translateCheckboxes = [mainCheckbox].concat(...secondaryCheckboxes);
            let translates = translateCheckboxes
                .filter(checkbox => this.isActiveCheckbox(checkbox))
                .map(checkbox => this.getTranslatedWordFromCheckbox(checkbox));

            if (customTranslate.length) {
                translates.push(customTranslate);
            }

            if (!input.length || !translates.length) {
                return result;
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

            let dictionary = await this.getDictionary();

            if (!Array.isArray(dictionary)) {
                dictionary = [];
            }

            dictionary.push(translate);
            this.saveDictionary(dictionary);
            this.clearForm();
        },

        getDictionaryKey: function () {
            return 'google_translate_dict';
        },

        getDictionary: async function () {
            const _default = JSON.stringify([]);
            let storageValue = await this.storage.get(this.getDictionaryKey());
            let json = storageValue || _default;
            return JSON.parse(json);
        },

        saveDictionary: function (dictionary) {
            this.storage.set(this.getDictionaryKey(), JSON.stringify(dictionary));
        },
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