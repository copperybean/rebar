/**
 * @fileoverview 所有自定义输入的基类
 * @author wangshouchuang
 */
goog.provide('rebar.mvc.BaseInput');

goog.require('rebar.mvc.BaseView');

goog.require('goog.object');

/**
 * 构造函数
 * @constructor
 * @extends {rebar.mvc.BaseView}
 */
rebar.mvc.BaseInput = function () {
    rebar.mvc.BaseView.call(this);

    /**
     * @type {?function (rebar.mvc.BaseInput)}
     * @private
     */
    this.contentChangeCallback_ = null;

    /**
     * @type {boolean}
     * @private
     */
    this.domChangeListened_ = false;
};
goog.inherits(rebar.mvc.BaseInput, rebar.mvc.BaseView);

/**
 * 设置控件的值
 * @param {string} value
 */
rebar.mvc.BaseInput.prototype.setValue = function (value) {
    return '';
};

/**
 * 获取控件的值
 * @return {string}
 */
rebar.mvc.BaseInput.prototype.getValue = function () {
    return '';
};

/**
 * @param {function (rebar.mvc.BaseInput)} callback
 */
rebar.mvc.BaseInput.prototype.setChangeCallback = function (callback) {
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
rebar.mvc.BaseInput.prototype.enterDocument = function () {
    rebar.mvc.BaseInput.superClass_.enterDocument.call(this);
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
rebar.mvc.BaseInput.prototype.listenDomChange = function () {
    // do nothing in base class
};

/**
 * @return {boolean}
 * @protected
 */
rebar.mvc.BaseInput.prototype.shouldListenDomChange = function () {
    return !!this.contentChangeCallback_;
};

/**
 * @protected
 */
rebar.mvc.BaseInput.prototype.contentChange = function () {
    if (this.contentChangeCallback_) {
        this.contentChangeCallback_.call(window, this);
    }
};

