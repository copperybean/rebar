/**
 * @fileoverview 弹出对话框
 * @author wangshouchuang
 */
goog.provide('rebar.ext.bt.Dialog');

goog.require('baidu.base.BaseView');
goog.require('baidu.base.DialogInterface');
goog.require('rebar.ext.bt.tpldialog');


/**
 * 构造函数
 * @constructor
 * @extends {baidu.base.BaseView}
 * @implements {baidu.base.DialogInterface}
 * @desc Public实例变量成员 在这里定义
 */
rebar.ext.bt.Dialog = function () {
    baidu.base.BaseView.call(this);

    /**
     * @private
     * @type {Function}
     */
    this.yesOnceCallback_ = null;

    /**
     * @private
     * @type {Function}
     */
    this.cancelOnceCallback_ = null;

    /**
     * @type {Element}
     * @private
     */
    this.titleDom_ = null;

    /**
     * @type {Element}
     * @private
     */
    this.contentDom_ = null;

    /**
     * @type {Element}
     * @private
     */
    this.yesBtn_ = null;

    /**
     * @type {Element}
     * @private
     */
    this.cancelBtn_ = null;
};
goog.inherits(rebar.ext.bt.Dialog, baidu.base.BaseView);

/**
 * @enum {string}
 */
rebar.ext.bt.Dialog.Events = {
    Shown: 'shown',
    Hidden: 'hidden',
    YesClick: 'yesClick',
    CancelClick: 'cancelClick'
};

/**
 * @param {string} msg The msg to show.
 * @param {string=} optTitle The optional title.
 */
rebar.ext.bt.Dialog.popupError = function (msg, optTitle) {
    (new rebar.ext.bt.Dialog()).setup(optTitle || '错误', msg, false, true).
        show();
};

/**
 * @override
 */
rebar.ext.bt.Dialog.prototype.focus = function () {
    this.yesBtn_.focus();
};

/**
 * @override
 */
rebar.ext.bt.Dialog.prototype.createDom = function () {
    rebar.ext.bt.Dialog.superClass_.createDom.call(this);

    this.titleDom_ = this.getDomByClass('modal-title');
    this.contentDom_ = this.getDomByClass('modal-body');
    this.yesBtn_ = this.getElement().querySelector('[data-btn="yes"]');
    this.cancelBtn_ = this.getElement().querySelector('[data-dismiss]');
};

/**
 * @override
 */
rebar.ext.bt.Dialog.prototype.getContentElement = function () {
    if (!this.getElement()) {
        this.createDom();
    }
    return this.contentDom_;
};

/**
 * @override
 */
rebar.ext.bt.Dialog.prototype.enterDocument = function () {
    rebar.ext.bt.Dialog.superClass_.enterDocument.call(this);

    $(this.getElement()).bind('shown.bs.modal', goog.bind(this.domShowing, this));
    $(this.getElement()).bind('hidden.bs.modal', goog.bind(this.domHiding, this));
    this.getHandler().listen(
        this.yesBtn_, goog.events.EventType.CLICK, this.yesBtnClick);
    this.getHandler().listen(
        this.cancelBtn_, goog.events.EventType.CLICK, this.cancelBtnClick);
};

/**
 * 弹出对话框
 * @param {bootstrap.modalParam=} options 标准的bootstrap设置
 * @override
 */
rebar.ext.bt.Dialog.prototype.show = function (options) {
    this.render();
    var defaults = {
        backdrop: 'static'
    };
    var settings = /** @type {bootstrap.modalParam} */($.extend({}, defaults, options || {}));

    $(this.getElement()).modal(settings);
};

/**
 * @override
 */
rebar.ext.bt.Dialog.prototype.close = function () {
    $(this.getElement()).modal('hide');
};

/**
 * 页面打开事件
 * @protected
 */
rebar.ext.bt.Dialog.prototype.domShowing = function (event) {
    this.dispatchEvent(rebar.ext.bt.Dialog.Events.Shown);
};

/**
 * 页面关闭事件
 * @protected
 */
rebar.ext.bt.Dialog.prototype.domHiding = function (event) {
    this.cancelOnceCallback_ = this.yesOnceCallback_ = null;
    this.remove();
    this.dispatchEvent(rebar.ext.bt.Dialog.Events.Hidden);
};

/**
 * @protected
 */
rebar.ext.bt.Dialog.prototype.yesBtnClick = function (event) {
    if (this.yesOnceCallback_) {
        if (this.yesOnceCallback_.call(window) === false) {
            return;
        }
        this.yesOnceCallback_ = null;
    }
    this.close();
    this.dispatchEvent(rebar.ext.bt.Dialog.Events.YesClick);
};

/**
 * @protected
 */
rebar.ext.bt.Dialog.prototype.cancelBtnClick = function (event) {
    if (this.cancelOnceCallback_) {
        this.cancelOnceCallback_.call(window);
        this.cancelOnceCallback_ = null;
    }
    this.dispatchEvent(rebar.ext.bt.Dialog.Events.CancelClick);
};

/**
 * 设置title或获取title
 * @param {string} title 弹出框标题
 * @return {string || rebar.ext.bt.Dialog}
 * @desc 不传入参数则获取title
 */
rebar.ext.bt.Dialog.prototype.title = function (title) {
    if (arguments.length === 0) {
        return this.titleDom_.innerText;
    } else {
        this.titleDom_.innerText = title;
        // 返回this维持jQuery操作链
        return this;
    }
};

/**
 * 设置content或获取content
 * @param {string} content 弹出框提示内容，可以是HTML
 * @return {string || rebar.ext.bt.Dialog}
 * @desc 不传入参数则获取content
 */
rebar.ext.bt.Dialog.prototype.content = function (content) {
    if (arguments.length === 0) {
        return this.contentDom_.innerHTML;
    } else {
        this.contentDom_.innerHTML = content;
        // 返回this维持jQuery操作链
        return this;
    }
};

/**
 * @param {boolean} enable
 */
rebar.ext.bt.Dialog.prototype.enableYesButton = function (enable) {
    if (enable) {
        goog.dom.classes.remove(this.yesBtn_, 'disabled');
    } else {
        goog.dom.classes.add(this.yesBtn_, 'disabled');
    }
};

/**
 * @override
 */
rebar.ext.bt.Dialog.prototype.setup = function (title, content, showCancel, showYes) {
    if (!this.getElement()) {
        this.createDom();
    }
    var argLength = arguments.length;
    if (argLength=== 0) {
        return this;
    }

    if (argLength >= 1) {
        this.titleDom_.innerText = title;
    }

    this.removeChildren();
    if (argLength >= 2) {
        this.contentDom_.innerHTML = '';
        if (content instanceof baidu.base.BaseView) {
            this.addChild(content, true);
        } else {
            this.contentDom_.innerHTML = content;
        }
    }

    // 默认显示
    if (showCancel === false) {
        goog.style.showElement(this.cancelBtn_, false);
    } else {
        if (goog.isFunction(showCancel)) {
            this.cancelOnceCallback_ = showCancel;
        }
        goog.style.showElement(this.cancelBtn_, true);
    }

    // 默认显示
    if (showYes === false) {
        goog.style.showElement(this.yesBtn_, false);
    } else {
        if (goog.isFunction(showYes)) {
            this.yesOnceCallback_ = showYes;
        }
        goog.style.showElement(this.yesBtn_, true);
    }
    return this;
};

/**
 * @override
 */
rebar.ext.bt.Dialog.prototype.buildDom = function () {
    var html = rebar.ext.bt.tpldialog.dialog({
        title: '提示',
        content: '',
        // 是否显示取消按钮
        cancelBtn: true,
        // 是否显示确定按钮
        yesBtn: true
    });
    return html;
};

