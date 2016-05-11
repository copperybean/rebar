/**
 * @fileoverview 日志打印
 * @author hector<zzh-83@163.com>
 */
goog.provide('baidu.base.logger');

/**
 * @param {string} msg
 */
baidu.base.logger.info = function (msg) {
    window.console.info(msg);
};

/**
 * @param {string} msg
 */
baidu.base.logger.warn = function (msg) {
    window.console.warn(msg);
};

/**
 * @param {string} msg
 * @param {Error|Object=} exception
 */
baidu.base.logger.error = function (msg, exception) {
    window.console.error(exception ? [msg, exception] : msg);
};
