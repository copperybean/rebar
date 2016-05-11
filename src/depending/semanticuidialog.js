/**
 * @file The dialog implemented by semantic ui.
 *
 * @author zhangzhihong02
 */
goog.provide('baidu.base.SemanticUIDialog');

goog.require('baidu.base.BaseView');
goog.require('baidu.base.DialogInterface');
goog.require('baidu.base.tplSemanticUI');

/**
 * constructor
 * @param {boolean=} optHideCloseIcon hide icon
 * @constructor
 * @extends {baidu.base.BaseView}
 * @implements {baidu.base.DialogInterface}
 */
baidu.base.SemanticUIDialog = function (optHideCloseIcon) {
    baidu.base.BaseView.call(this);

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
goog.inherits(baidu.base.SemanticUIDialog, baidu.base.BaseView);

/**
 * @param {string} msg The msg to show.
 * @param {string=} optTitle The optional title.
 */
baidu.base.SemanticUIDialog.popupError = function (msg, optTitle) {
    var dialog = new baidu.base.SemanticUIDialog();
    dialog.setup(optTitle || '错误', msg, false, true).show();
};

/**
 * @override
 */
baidu.base.SemanticUIDialog.prototype.setup = function (
    title, content, optShowCancel, optShowYes) {
    if (!this.getElement()) {
        this.createDom();
    }
    this.getElement().querySelector('.header').innerHTML = title;
    var elContent = this.getElement().querySelector('.content');
    if (content instanceof baidu.base.BaseView) {
        this.addSubView(content, elContent);
    } else {
        elContent.innerHTML = content;
    }

    var elCancel = this.getDomById(baidu.base.suidc.ID_CANCEL_BTN);
    if (optShowCancel === false) {
        goog.style.showElement(elCancel, false);
    } else {
        if (goog.isFunction(optShowCancel)) {
            this.cancelOnceCallback_ = optShowCancel;
        }
        goog.style.showElement(elCancel, true);
    }

    var elYes = this.getDomById(baidu.base.suidc.ID_OK_BTN);
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
baidu.base.SemanticUIDialog.prototype.show = function () {
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
baidu.base.SemanticUIDialog.prototype.refresh = function () {
    $(this.getElement()).modal('refresh');
};

/**
 * @override
 */
baidu.base.SemanticUIDialog.prototype.close = function () {
    $(this.getElement()).modal('hide');
};

/**
 * @param {boolean} flag The switcher.
 */
baidu.base.SemanticUIDialog.prototype.enableYesButton = function (flag) {
    var el = this.getDomById(baidu.base.suidc.ID_OK_BTN);
    if (flag) {
        goog.dom.classes.remove(el, 'disabled');
    } else {
        goog.dom.classes.add(el, 'disabled');
    }
};

/**
 * @private
 */
baidu.base.SemanticUIDialog.prototype.onApprove_ = function () {
    if (this.yesOnceCallback_
        && this.yesOnceCallback_.call(null) === false) {
        return false;
    }
};

/**
 * @private
 */
baidu.base.SemanticUIDialog.prototype.onDeny_ = function () {
    if (this.cancelOnceCallback_
        && this.cancelOnceCallback_.call(null) === false) {
        return false;
    }
};

/**
 * @private
 */
baidu.base.SemanticUIDialog.prototype.onHidden_ = function () {
    this.cancelOnceCallback_ = this.yesOnceCallback_ = null;
    this.remove();
};

/**
 * @override
 */
baidu.base.SemanticUIDialog.prototype.renderDomWithIdPrefix = function () {
    return true;
};

/**
 * @override
 */
baidu.base.SemanticUIDialog.prototype.buildDom = function () {
    return baidu.base.tplSemanticUI.dialog({
        viewId: this.getId(),
        hideCloseIcon: this._hideCloseIcon
    });
};

/**
 * @override
 */
baidu.base.SemanticUIDialog.prototype.disposeInternal = function () {
    this.close();

    baidu.base.SemanticUIDialog.superClass_.disposeInternal.call(this);
};

/**
 * @enum {string}
 */
baidu.base.SemanticUIDialog.DomConst = {
    ID_CANCEL_BTN: 'c',
    ID_OK_BTN: 'o'
};
baidu.base.suidc = baidu.base.SemanticUIDialog.DomConst;
