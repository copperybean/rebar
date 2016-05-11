/**
 * @fileoverview 弹出对话框
 * @author wangshouchuang
 */
goog.provide('baidu.base.BootStrapDialog');

goog.require('baidu.base.BaseView');
goog.require('baidu.base.DialogInterface');
goog.require('baidu.base.tplBootStrapDialog');


/**
 * 构造函数
 * @constructor
 * @extends {baidu.base.BaseView}
 * @implements {baidu.base.DialogInterface}
 * @desc Public实例变量成员 在这里定义
 */
baidu.base.BootStrapDialog = function () {
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
goog.inherits(baidu.base.BootStrapDialog, baidu.base.BaseView);

/**
 * @enum {string}
 */
baidu.base.BootStrapDialog.Events = {
    Shown: 'shown',
    Hidden: 'hidden',
    YesClick: 'yesClick',
    CancelClick: 'cancelClick'
};

/**
 * @param {string} msg The msg to show.
 * @param {string=} optTitle The optional title.
 */
baidu.base.BootStrapDialog.popupError = function (msg, optTitle) {
    (new baidu.base.BootStrapDialog()).setup(optTitle || '错误', msg, false, true).
        show();
};

/**
 * @override
 */
baidu.base.BootStrapDialog.prototype.focus = function () {
    this.yesBtn_.focus();
};

/**
 * @override
 */
baidu.base.BootStrapDialog.prototype.createDom = function () {
    baidu.base.BootStrapDialog.superClass_.createDom.call(this);

    this.titleDom_ = this.getDomByClass('modal-title');
    this.contentDom_ = this.getDomByClass('modal-body');
    this.yesBtn_ = this.getElement().querySelector('[data-btn="yes"]');
    this.cancelBtn_ = this.getElement().querySelector('[data-dismiss]');
};

/**
 * @override
 */
baidu.base.BootStrapDialog.prototype.getContentElement = function () {
    if (!this.getElement()) {
        this.createDom();
    }
    return this.contentDom_;
};

/**
 * @override
 */
baidu.base.BootStrapDialog.prototype.enterDocument = function () {
    baidu.base.BootStrapDialog.superClass_.enterDocument.call(this);

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
baidu.base.BootStrapDialog.prototype.show = function (options) {
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
baidu.base.BootStrapDialog.prototype.close = function () {
    $(this.getElement()).modal('hide');
};

/**
 * 页面打开事件
 * @protected
 */
baidu.base.BootStrapDialog.prototype.domShowing = function (event) {
    this.dispatchEvent(baidu.base.BootStrapDialog.Events.Shown);
};

/**
 * 页面关闭事件
 * @protected
 */
baidu.base.BootStrapDialog.prototype.domHiding = function (event) {
    this.cancelOnceCallback_ = this.yesOnceCallback_ = null;
    this.remove();
    this.dispatchEvent(baidu.base.BootStrapDialog.Events.Hidden);
};

/**
 * @protected
 */
baidu.base.BootStrapDialog.prototype.yesBtnClick = function (event) {
    if (this.yesOnceCallback_) {
        if (this.yesOnceCallback_.call(window) === false) {
            return;
        }
        this.yesOnceCallback_ = null;
    }
    this.close();
    this.dispatchEvent(baidu.base.BootStrapDialog.Events.YesClick);
};

/**
 * @protected
 */
baidu.base.BootStrapDialog.prototype.cancelBtnClick = function (event) {
    if (this.cancelOnceCallback_) {
        this.cancelOnceCallback_.call(window);
        this.cancelOnceCallback_ = null;
    }
    this.dispatchEvent(baidu.base.BootStrapDialog.Events.CancelClick);
};

/**
 * 设置title或获取title
 * @param {string} title 弹出框标题
 * @return {string || baidu.base.BootStrapDialog}
 * @desc 不传入参数则获取title
 */
baidu.base.BootStrapDialog.prototype.title = function (title) {
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
 * @return {string || baidu.base.BootStrapDialog}
 * @desc 不传入参数则获取content
 */
baidu.base.BootStrapDialog.prototype.content = function (content) {
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
baidu.base.BootStrapDialog.prototype.enableYesButton = function (enable) {
    if (enable) {
        goog.dom.classes.remove(this.yesBtn_, 'disabled');
    } else {
        goog.dom.classes.add(this.yesBtn_, 'disabled');
    }
};

/**
 * @override
 */
baidu.base.BootStrapDialog.prototype.setup = function (title, content, showCancel, showYes) {
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
baidu.base.BootStrapDialog.prototype.buildDom = function () {
    var html = baidu.base.tplBootStrapDialog.dialog({
        title: '提示',
        content: '',
        // 是否显示取消按钮
        cancelBtn: true,
        // 是否显示确定按钮
        yesBtn: true
    });
    return html;
};

