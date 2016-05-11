/**
 * @param {jQuery} dom
 * @param {Object.<string, *>=} options
 * @constructor
 */
var ZeroClipboard = function (dom, options) {};

/**
 * @param {string} event
 * @param {function (ZeroClipboard)} callback
 */
ZeroClipboard.prototype.on = function (event, callback) {};

/**
 * @param {string} text
 */
ZeroClipboard.prototype.setText = function (text) {};

ZeroClipboard.prototype.destroy = function () {};

/**
 * @constructor
 */
ZeroClipboard.Setting = function () {
        /**
         * @type {string}
         */
        this.moviePath;
};
