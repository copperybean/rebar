/**
 * @constructor
 */
var CodeMirror = function () {};

/**
 * @param {string} value
 */
CodeMirror.prototype.setValue = function (value) {};
/**
 * @return {string}
 */
CodeMirror.prototype.getValue = function () {};

/**
 * @param {string} option
 * @param {*} value
 */
CodeMirror.prototype.setOption = function (option, value) {};

/**
 * @return {Element}
 */
CodeMirror.prototype.getWrapperElement = function () {};

CodeMirror.prototype.refresh = function () {};

/**
 * @param {string} type
 * @param {Function} func
 */
CodeMirror.prototype.on = function (type, func) {};

/**
 * @param {number} lineNum
 */
CodeMirror.prototype.lineInfo = function (lineNum) {};

/**
 * @param {number} lineNum
 * @param {string} name
 * @param {Element} htmlElement
 */
CodeMirror.prototype.setGutterMarker = function (lineNum, name, htmlElement) {};

/**
 * Codemirror的创建参数
 * @constructor
 */
CodeMirror.fromTextAreaArgs = function () {
    /**
     * @type {boolean}
     */
    this.lineNumbers;
    /**
     * @type {string}
     */
    this.mode;
    /**
     * @type {number}
     */
    this.tabSize;
    /**
     * @type {boolean}
     */
    this.smartIndent;
    /**
     * @type {boolean}
     */
    this.lineWrapping;
    /**
     * @type {Array.<string>}
     */
    this.gutters;
    /**
     * @type {boolean}
     */
    this.readOnly;
};

/**
 * @param {Element} textAreaDom
 * @param {Object.<string, *>} var_args
 * @return {CodeMirror}
 */
CodeMirror.fromTextArea = function (textAreaDom, var_args) {}
