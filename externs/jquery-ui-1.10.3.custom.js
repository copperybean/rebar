/**
 * @param {Object.<string, *>|string} optionOrMethod
 * @param {string=} optParam
 * @return {jQuery}
 */
jQuery.prototype.autocomplete = function (optionOrMethod, optParam) {};

$.ui;
$.ui.keyCode;
$.ui.keyCode.TAB;

/**
 * @constructor
 */
jQuery.AutoComplete = function () {
        /**
         * @type {Array|string|function (jQuery.AutoComplete.Request)}
         */
        this.source;
        /**
         * @type {number}
         */
        this.minLength;
        /**
         * @type {Function}
         */
        this.search;
        /**
         * @type {function (Event, Object.<string, *>)}
         */
        this.focus;
        /**
         * @type {function (Event, Object.<string, *>)}
         */
        this.select;
        /**
         * @type {jQuery.AutoComplete.PositionParam}
         */
        this.position;
};

/**
 * @constructor
 */
jQuery.AutoComplete.Request = function () {
        /**
         * @type {string}
         */
        this.term;
};

/**
 * @constructor
 */
jQuery.AutoComplete.PositionParam = function () {
        /**
         * @type {string}
         */
        this.collision;
};

/**
 * @constructor
 */
jQuery.AutoComplete.Data = function () {
        /**
         * @type {jQuery.AutoComplete.Menu}
         */
        this.menu;
};

/**
 * @constructor
 */
jQuery.AutoComplete.Menu = function () {
        /**
         * @type {boolean}
         */
        this.active;
};

/**
 * @constructor
 */
jQuery.SliderUI = function () {
        /**
         * @type {jQuery}
         */
        this.handle;

        /**
         * @type {number}
         */
        this.value;

        /**
         * @type {Array}
         */
        this.values;
}

/**
 * @constructor
 */
jQuery.slider = function () {
        /**
         * @type {string}
         */
        this.orientation;

        /**
         * @type {string}
         */
        this.range;

        /**
         * @type {string}
         */
        this.max;

        /**
         * @type {string}
         */
        this.min;

        /**
         * @type {number}
         */
        this.value;

        /**
         * @type {function ()}
         */
        this.change;

        /**
         * @type {function (Event, jQuery.SliderUI)}
         */
        this.slide;
};

/**
 * @constructor
 */
jQuery.datapicker = function () {

       /**
         * @type {boolean}
         */
        this.changeMonth;

        /**
         * @type {number}
         */
        this.numberOfMonths;

        /**
         * @type {string}
         */
        this.dateFormat;

        /**
         * @type {function(Object.<string, *>)}
         */
        this.onClose;
}


/**
 * @param {Object.<string, *> | string} var_args0
 * @param {string=} var_args1
 * @param {string | number=} var_args2
 * @return {number}
 */
jQuery.prototype.slider = function (var_args0, var_args1, var_args2) {};

/**
 * @param {Object.<string, *>} var_args
 */
jQuery.prototype.sortable = function (var_args) {};


/**
 * @param {Object.<string, *> | string} var_args0
 * @param {string=} var_args1
 * @param {string=} var_args2
 */
jQuery.prototype.datepicker = function (var_args0, var_args1, var_args2) {};
