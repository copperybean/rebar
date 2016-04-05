/**
 * @file The interface for dialog
 *
 * @author zhangzhihong02
 */
goog.provide('baidu.base.DialogInterface');

goog.require('goog.disposable.IDisposable');

/**
 * @interface
 * @extends {goog.disposable.IDisposable}
 */
baidu.base.DialogInterface = function () {
};

/**
 * @param {string} title The title of dialog.
 * @param {string|baidu.base.BaseView} content The content of dialog.
 * @param {boolean|Function=} optShowCancel Whether to show cancel button.
 *     If a function is passed in, then show cancel and call the function
 *     when cancel button clicked.
 * @param {boolean|Function=} optShowYes Whether to show yes button.
 *     The function type is same with cancel.
 * @return {baidu.base.DialogInterface}
 */
baidu.base.DialogInterface.prototype.setup;

/**
 * To show the dialog
 */
baidu.base.DialogInterface.prototype.show;

/**
 * To close the dialog
 */
baidu.base.DialogInterface.prototype.close;

