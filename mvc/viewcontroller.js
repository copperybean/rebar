/**
 * @fileoverview 控制view的基类
 * @author hector<zzh-83@163.com>
 */
goog.provide('baidu.base.ViewController');

goog.require('baidu.base.BaseController');
goog.require('baidu.base.Stateful');

/**
 * 该类的抽象源自iOS中的ViewController。
 * 对应浏览器端应用，目前还没有用到除ViewController之外的其他controller。
 *
 * @param {baidu.base.BaseView=} view
 * @constructor
 * @extends {baidu.base.BaseController}
 * @implements {baidu.base.Stateful}
 */
baidu.base.ViewController = function (view) {
    baidu.base.BaseController.call(this);

    /**
     * @type {baidu.base.BaseView}
     * @private
     */
    this.view_ = view || new baidu.base.BaseView();
};
goog.inherits(baidu.base.ViewController, baidu.base.BaseController);

/**
 * @return {baidu.base.BaseView}
 * @protected
 */
baidu.base.ViewController.prototype.getView = function () {
    return this.view_;
};

/**
 * @override
 */
baidu.base.ViewController.prototype.setState = function (state) {
    return this.view_.setState(state);
};

/**
 * @override
 */
baidu.base.ViewController.prototype.getState = function () {
    var ret = new baidu.base.StateModel();
    ret.mergeState(this.view_.getState());
    return ret;
};

/**
 * 获取导航状态，已有的用处是实现一个导航面包屑。
 * 如果该controller管理的是一组带有的层级关系的子controller，
 * 那么返回这样一个数组就可以用来渲染一个面包屑，
 * 面包屑的每一项都记录着对应的状态，点击时将整个应用设置为对应的状态即可。
 *
 * @return {Array.<baidu.base.NavigatePathModel>}
 */
baidu.base.ViewController.prototype.getNavigatePaths = function () {
    return [];
};

