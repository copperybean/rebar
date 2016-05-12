/**
 * @file The interface for dialog
 *
 * @author zhangzhihong02
 */
goog.provide('rebar.dialog.DialogInterface');

goog.require('goog.disposable.IDisposable');

/**
 * @interface
 * @extends {goog.disposable.IDisposable}
 */
rebar.dialog.DialogInterface = function () {
};

/**
 * @param {string} title The title of dialog.
 * @param {string|rebar.mvc.BaseView} content The content of dialog.
 * @param {boolean|Function=} optShowCancel Whether to show cancel button.
 *     If a function is passed in, then show cancel and call the function
 *     when cancel button clicked.
 * @param {boolean|Function=} optShowYes Whether to show yes button.
 *     The function type is same with cancel.
 * @return {rebar.dialog.DialogInterface}
 */
rebar.dialog.DialogInterface.prototype.setup;

/**
 * To show the dialog
 */
rebar.dialog.DialogInterface.prototype.show;

/**
 * To close the dialog
 */
rebar.dialog.DialogInterface.prototype.close;

