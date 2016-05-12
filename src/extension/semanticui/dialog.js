/**
 * @file The dialog implemented by semantic ui.
 *
 * @author zhangzhihong02
 */
goog.provide('rebar.ext.sui.Dialog');

goog.require('rebar.mvc.BaseView');
goog.require('rebar.dialog.DialogInterface');
goog.require('rebar.ext.sui.tpl');

/**
 * constructor
 * @param {boolean=} optHideCloseIcon hide icon
 * @constructor
 * @extends {rebar.mvc.BaseView}
 * @implements {rebar.dialog.DialogInterface}
 */
rebar.ext.sui.Dialog = function (optHideCloseIcon) {
    rebar.mvc.BaseView.call(this);

    /**
     * @type {Function}
     * @private
     */
    this.cancelOnceCallback_ = null;

    /**
     * @type {Function}
     * @private
     */
    this.yesOnceCallback_ = null;

    /**
     * @type {boolean|undefined}
     * @private
     */
    this._hideCloseIcon = optHideCloseIcon;
};
goog.inherits(rebar.ext.sui.Dialog, rebar.mvc.BaseView);

/**
 * @param {string} msg The msg to show.
 * @param {string=} optTitle The optional title.
 */
rebar.ext.sui.Dialog.popupError = function (msg, optTitle) {
    var dialog = new rebar.ext.sui.Dialog();
    dialog.setup(optTitle || '错误', msg, false, true).show();
};

/**
 * @override
 */
rebar.ext.sui.Dialog.prototype.setup = function (
    title, content, optShowCancel, optShowYes) {
    if (!this.getElement()) {
        this.createDom();
    }
    this.getElement().querySelector('.header').innerHTML = title;
    var elContent = this.getElement().querySelector('.content');
    if (content instanceof rebar.mvc.BaseView) {
        this.addSubView(content, elContent);
    } else {
        elContent.innerHTML = content;
    }

    var elCancel = this.getDomById(rebar.ext.sui.ddc.ID_CANCEL_BTN);
    if (optShowCancel === false) {
        goog.style.showElement(elCancel, false);
    } else {
        if (goog.isFunction(optShowCancel)) {
            this.cancelOnceCallback_ = optShowCancel;
        }
        goog.style.showElement(elCancel, true);
    }

    var elYes = this.getDomById(rebar.ext.sui.ddc.ID_OK_BTN);
    if (optShowYes === false) {
        goog.style.showElement(elYes, false);
    } else {
        if (goog.isFunction(optShowYes)) {
            this.yesOnceCallback_ = optShowYes;
        }
        goog.style.showElement(elYes, true);
    }
    return this;
};

/**
 * @override
 */
rebar.ext.sui.Dialog.prototype.show = function () {
    this.render();
    $(this.getElement()).modal({
        allowMultiple: true,
        closable: false,
        onDeny: goog.bind(this.onDeny_, this),
        onApprove: goog.bind(this.onApprove_, this),
        onHidden: goog.bind(this.onHidden_, this)
    }).modal('show');
};

/**
 * 刷新
 */
rebar.ext.sui.Dialog.prototype.refresh = function () {
    $(this.getElement()).modal('refresh');
};

/**
 * @override
 */
rebar.ext.sui.Dialog.prototype.close = function () {
    $(this.getElement()).modal('hide');
};

/**
 * @param {boolean} flag The switcher.
 */
rebar.ext.sui.Dialog.prototype.enableYesButton = function (flag) {
    var el = this.getDomById(rebar.ext.sui.ddc.ID_OK_BTN);
    if (flag) {
        goog.dom.classes.remove(el, 'disabled');
    } else {
        goog.dom.classes.add(el, 'disabled');
    }
};

/**
 * @private
 */
rebar.ext.sui.Dialog.prototype.onApprove_ = function () {
    if (this.yesOnceCallback_
        && this.yesOnceCallback_.call(null) === false) {
        return false;
    }
};

/**
 * @private
 */
rebar.ext.sui.Dialog.prototype.onDeny_ = function () {
    if (this.cancelOnceCallback_
        && this.cancelOnceCallback_.call(null) === false) {
        return false;
    }
};

/**
 * @private
 */
rebar.ext.sui.Dialog.prototype.onHidden_ = function () {
    this.cancelOnceCallback_ = this.yesOnceCallback_ = null;
    this.remove();
};

/**
 * @override
 */
rebar.ext.sui.Dialog.prototype.renderDomWithIdPrefix = function () {
    return true;
};

/**
 * @override
 */
rebar.ext.sui.Dialog.prototype.buildDom = function () {
    return rebar.ext.sui.tpl.dialog({
        viewId: this.getId(),
        hideCloseIcon: this._hideCloseIcon
    });
};

/**
 * @override
 */
rebar.ext.sui.Dialog.prototype.disposeInternal = function () {
    this.close();

    rebar.ext.sui.Dialog.superClass_.disposeInternal.call(this);
};

/**
 * @enum {string}
 */
rebar.ext.sui.Dialog.DomConst = {
    ID_CANCEL_BTN: 'c',
    ID_OK_BTN: 'o'
};
rebar.ext.sui.ddc = rebar.ext.sui.Dialog.DomConst;
