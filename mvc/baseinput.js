/**
 * @fileoverview 所有自定义输入的基类
 * @author wangshouchuang
 */
goog.provide('baidu.base.BaseInput');

goog.require('baidu.base.BaseView');

goog.require('goog.object');

/**
 * 构造函数
 * @constructor
 * @extends {baidu.base.BaseView}
 */
baidu.base.BaseInput = function () {
    baidu.base.BaseView.call(this);

    /**
     * @type {?function (baidu.base.BaseInput)}
     * @private
     */
    this.contentChangeCallback_ = null;

    /**
     * @type {boolean}
     * @private
     */
    this.domChangeListened_ = false;
};
goog.inherits(baidu.base.BaseInput, baidu.base.BaseView);

/**
 * 设置控件的值
 * @param {string} value
 */
baidu.base.BaseInput.prototype.setValue = function (value) {
    return '';
};

/**
 * 获取控件的值
 * @return {string}
 */
baidu.base.BaseInput.prototype.getValue = function () {
    return '';
};

/**
 * @param {function (baidu.base.BaseInput)} callback
 */
baidu.base.BaseInput.prototype.setChangeCallback = function (callback) {
    this.contentChangeCallback_ = callback;
    if (this.isInDocument() && !this.domChangeListened_
        && this.shouldListenDomChange()) {
        this.listenDomChange();
        this.domChangeListened_ = true;
    }
};

/**
 * @override
 */
baidu.base.BaseInput.prototype.enterDocument = function () {
    baidu.base.BaseInput.superClass_.enterDocument.call(this);
    if (this.shouldListenDomChange()) {
        this.listenDomChange();
        this.domChangeListened_ = true;
    } else {
        this.domChangeListened_ = false;
    }
};

/**
 * @protected
 */
baidu.base.BaseInput.prototype.listenDomChange = function () {
    // do nothing in base class
};

/**
 * @return {boolean}
 * @protected
 */
baidu.base.BaseInput.prototype.shouldListenDomChange = function () {
    return !!this.contentChangeCallback_;
};

/**
 * @protected
 */
baidu.base.BaseInput.prototype.contentChange = function () {
    if (this.contentChangeCallback_) {
        this.contentChangeCallback_.call(window, this);
    }
};

