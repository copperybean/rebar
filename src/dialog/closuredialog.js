/**
 * @file The dialog implemented with raw closure.
 *
 * @author rongweiwei
 */
/* jshint -W069 */
/* eslint-disable fecs-dot-notation */
/* eslint-disable new-cap */
goog.provide('rebar.dialog.ClosureDialog');

goog.require('rebar.dialog.DialogInterface');
goog.require('rebar.dialog.tplclosuredialog');
goog.require('rebar.util');

goog.require('goog.ui.Component');
goog.require('goog.ui.ModalPopup');

/**
 * 基于Closure封装的对话框
 * @constructor
 * @extends {goog.ui.ModalPopup}
 * @implements {rebar.dialog.DialogInterface}
 */
rebar.dialog.ClosureDialog = function () {
    goog.ui.ModalPopup.call(this);

    /**
     * @type {Function}
     * @private
     */
    this._cancelOnceCallback = null;

    /**
     * @type {Function}
     * @private
     */
    this._yesOnceCallback = null;
};
goog.inherits(rebar.dialog.ClosureDialog, goog.ui.ModalPopup);

/**
 * 弹出错误提示框
 * @param {string} msg The msg to show.
 * @param {string=} optTitle The optional title.
 */
rebar.dialog.ClosureDialog.popupError = function (msg, optTitle) {
    var dialog = new rebar.dialog.ClosureDialog();
    dialog.setup(optTitle || '错误', msg, false, true).show();
};

/**
 * @override
 */
rebar.dialog.ClosureDialog.prototype.setup = function (
    title, content, optShowCancel, optShowYes) {
    if (!this.getElement()) {
        this.createDom();
    }
    this.getElement().querySelector('.closure-dialog-header').innerHTML = title;
    var elContent = this.getElement().querySelector('.closure-dialog-content');
    if (content instanceof goog.ui.Component) {
        this.addChild(content);
        content.render(elContent);
    } else {
        elContent.innerHTML = content;
    }

    var elCancel = this._getDomById(rebar.dialog.cddc.ID_CANCEL_BTN);
    if (optShowCancel === false) {
        goog.style.showElement(elCancel, false);
    } else {
        if (goog.isFunction(optShowCancel)) {
            this._cancelOnceCallback = optShowCancel;
        }
        goog.style.showElement(elCancel, true);
    }

    var elYes = this._getDomById(rebar.dialog.cddc.ID_OK_BTN);
    if (optShowYes === false) {
        goog.style.showElement(elYes, false);
    } else {
        if (goog.isFunction(optShowYes)) {
            this._yesOnceCallback = optShowYes;
        }
        goog.style.showElement(elYes, true);
    }
    this.render();
    return this;
};

/**
 * @override
 */
rebar.dialog.ClosureDialog.prototype.enterDocument = function () {
    rebar.dialog.ClosureDialog.superClass_.enterDocument.call(this);

    var elYes = this._getDomById(rebar.dialog.cddc.ID_OK_BTN);
    this.getHandler().listen(elYes, goog.events.EventType.CLICK, function () {
        if (false !== this._onApprove()) {
            this._onHidden();
        }
    });

    var elCancel = this._getDomById(rebar.dialog.cddc.ID_CANCEL_BTN);
    this.getHandler().listen(elCancel, goog.events.EventType.CLICK, function () {
        if (false !== this._onCancel()) {
            this._onHidden();
        }
    });
};

/**
 * @override
 */
rebar.dialog.ClosureDialog.prototype.show = function () {
    this.setVisible(true);
    var elCancel = this._getDomById(rebar.dialog.cddc.ID_CANCEL_BTN);
    elCancel.focus();
};

/**
 * @override
 */
rebar.dialog.ClosureDialog.prototype.close = function () {
    this.setVisible(false);
};

/**
 * 启用确定按钮
 * @param {boolean} flag The switcher.
 */
rebar.dialog.ClosureDialog.prototype.enableYesButton = function (flag) {
    var el = this._getDomById(rebar.dialog.cddc.ID_OK_BTN);
    if (flag) {
        goog.dom.classes.remove(el, 'disabled');
    } else {
        goog.dom.classes.add(el, 'disabled');
    }
};

/**
 * @override
 */
rebar.dialog.ClosureDialog.prototype.createDom = function () {
    rebar.dialog.ClosureDialog.superClass_.createDom.call(this);

    var domHtml = rebar.dialog.tplclosuredialog.viewHtml();
    this.getElement().innerHTML = domHtml;
};

/**
 * 根据id获取元素
 * @param {string} id Id
 * @return {Element}
 * @private
 */
rebar.dialog.ClosureDialog.prototype._getDomById = function (id) {
    return this.getElement().querySelector('#' + id);
};

/**
 * 确定按钮处理函数
 * @return {boolean|undefined}
 * @private
 */
rebar.dialog.ClosureDialog.prototype._onApprove = function () {
    if (this._yesOnceCallback
        && this._yesOnceCallback.call(null) === false) {
        return false;
    }
};

/**
 * 取消按钮处理函数
 * @return {boolean|undefined}
 * @private
 */
rebar.dialog.ClosureDialog.prototype._onCancel = function () {
    if (this._cancelOnceCallback
        && this._cancelOnceCallback.call(null) === false) {
        return false;
    }
};

/**
 * 隐藏对话框处理函数
 * @private
 */
rebar.dialog.ClosureDialog.prototype._onHidden = function () {
    this._yesOnceCallback = null;
    this._cancelOnceCallback = null;
    this.dispose();
};

/**
 * @override
 */
rebar.dialog.ClosureDialog.prototype.disposeInternal = function () {
    rebar.dialog.ClosureDialog.superClass_.disposeInternal.call(this);
};

/**
 * @enum {string}
 */
rebar.dialog.ClosureDialog.DomConst = {
    ID_CANCEL_BTN: 'cancel-button',
    ID_OK_BTN: 'ok-button'
};
rebar.dialog.cddc = rebar.dialog.ClosureDialog.DomConst;

