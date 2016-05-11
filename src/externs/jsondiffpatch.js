/**
 * @file jsondiffpatch的extern声明文件
 * @author rongweiwei
 */

/**
 * 构造函数
 * @constructor
 */
var jsondiffpatch = function () {};

/**
 * 生成JSON的diff
 * @param {Object} jsonA JSON A
 * @param {Object} jsonB JSON B
 * @return {Object} delta
 */
jsondiffpatch.diff = function (jsonA, jsonB) {
    return {};
};

/**
 * 构造函数
 * @constructor
 */
jsondiffpatch.formatters = function () {};

/**
 * 构造函数
 * @constructor
 */
jsondiffpatch.formatters.html = function () {};

/**
 * 返回格式化结果
 * @param {Object} delta delta
 * @param {Object} json Old JSON
 * @return {string} HTML字符串
 */
jsondiffpatch.formatters.html.format = function (delta, json) {
    return '';
};

/**
 * 显示未变更的内容
 * @param {boolean=} show 是否显示
 * @param {Element=} node 节点
 */
jsondiffpatch.formatters.html.showUnchanged = function (show, node) {};

/**
 * 隐藏未变更的内容
 * @param {Element=} node 节点
 */
jsondiffpatch.formatters.html.hideUnchanged = function (node) {};

/**
 * 构造函数
 * @constructor
 */
jsondiffpatch.formatters.annotated = function () {};

/**
 * 返回格式化结果
 * @param {Object} delta delta
 * @param {Object} json Old JSON
 * @return {string} HTML字符串
 */
jsondiffpatch.formatters.annotated.format = function (delta, json) {
    return '';
};

