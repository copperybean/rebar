/**
 * @constructor
 */
var jQueryDatetimePicker = function () {};

/**
 * @constructor
 */
jQueryDatetimePicker.ConstructParam = function () {
        /**
         * @type {string}
         */
        this.format;
        /**
         * @type {boolean}
         */
        this.timepicker;
        /**
         * @type {number}
         */
        this.step;
        /**
         * @type {Function}
         */
        this.onChangeDateTime;
        /**
         * @type {Function}
         */
        this.onSelectTime;
        /**
         * @type {Function}
         */
        this.onClose;
        /**
         * @type {boolean}
         */
        this.datepicker;
        /**
         * @type {boolean}
         */
        this.closeOnDateSelect;
        /**
         * @type {boolean}
         */
        this.allowBlank;
        /**
         * @type {string}
         */
        this.lang;
        /**
         * @type {Function}
         */
        this.onSelectDate;
};

/**
 * @param {Object.<string, *>} var_args
 * @return {jQuery|string}
 */
jQuery.prototype.datetimepicker = function (var_args) {};
