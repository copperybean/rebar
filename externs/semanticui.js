/**
 * 弹出semantic ui的对话框
 * @param {Object.<string, *>|string} param The parameter of modal.
 */
jQuery.prototype.modal = function (param) {};

/**
 * checkbox 属性
 * @param {string=} action The action
 * @param {*=} arg1 The argument
 * @param {*=} arg2 The argument
 */
jQuery.prototype.checkbox = function (action, arg1, arg2) {};

var semanticui;

/**
 * The modal param api setting
 * @constructor
 */
semanticui.modalParamApiSetting = function () {
    /**
     * @type {string}
     */
    this.action;
    /**
     * @type {string}
     */
    this.url;
};

/**
 * @constructor
 */
semanticui.modalParam = function () {
    /**
     * @type {boolean}
     */
    this.allowMultiple;

    /**
     * @type {boolean}
     */
    this.closable;

    /**
     * @type {Function}
     */
    this.onDeny;

    /**
     * @type {Function}
     */
    this.onApprove;

    /**
     * @type {Function}
     */
    this.onHidden;

    /**
     * @type {Object}
     */
    this.apiSettings;

    /**
     * @type {Array}
     */
    this.searchFields;

    /** 
     * @type {boolean}
     */
    this.searchFullText;

    /**
     * @type {number}
     */
    this.searchDelay;

    /**
     * @type {number}
     */
    this.maxResults;

    /** 
     * @type {Function}
     */
    this.onSelect;

    /**
     * @type {Function}
     */
    this.onChecked;

    /**
     * @type {Function}
     */
    this.onUnchecked;

    /**
     * @type {string}
     */
    this.action;

    /**
     * @type {string}
     */
    this.url;
    /**
     * @type {boolean}
     */
    this.hoverable;
    /**
     * @type {string}
     */
    this.position;
};

/**
 * @param {Object.<string,*>=} settings
 */
jQuery.prototype.popup = function (settings) {};

/**
 * @param {Object.<string,*>=} settings
 */
jQuery.prototype.search = function (settings) {};

/**
 * sticky plugin
 * @param {Object.<string,*>=} settings settings
 */
jQuery.prototype.sticky = function (settings) {};

/**
 * @param {Object.<string, semanticui.FormValidateItem>|string} param
 */
jQuery.prototype.form = function (param) {};

/**
 * @constructor
 */
semanticui.FormValidateItem = function () {
    /**
     * @type {string}
     */
    this.identifier;
    /**
     * @type {Array.<semanticui.FormValidateItemRule>}
     */
    this.rules;
};

/**
 * @constructor
 */
semanticui.FormValidateItemRule = function () {
    /**
     * @type {string}
     */
    this.type;
    /**
     * @type {string}
     */
    this.prompt;
};

/**
 * @constructor
 */
semanticui.dropdownParam = function () {
    /**
     * @type {Function}
     */
    this.onChange;
    /**
     * @type {number}
     */
    this.maxSelections;
    /**
     * @type {Function}
     */
    this.onRemove;
    /**
     * @type {Function}
     */
    this.onAdd;
};


/**
 * @param {string|Object.<string,*>=} optSettingsOrMethod
 * @param {string=} optMethodParam
 */
jQuery.prototype.dropdown = function (optSettingsOrMethod, optMethodParam) {};

