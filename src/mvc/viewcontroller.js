/**
 * @fileoverview 控制view的基类
 * @author hector<zzh-83@163.com>
 */
goog.provide('rebar.mvc.ViewController');

goog.require('rebar.mvc.BaseController');
goog.require('rebar.model.Stateful');

/**
 * 该类的抽象源自iOS中的ViewController。
 * 对应浏览器端应用，目前还没有用到除ViewController之外的其他controller。
 *
 * @param {rebar.mvc.BaseView=} view
 * @constructor
 * @extends {rebar.mvc.BaseController}
 * @implements {rebar.model.Stateful}
 */
rebar.mvc.ViewController = function (view) {
    rebar.mvc.BaseController.call(this);

    /**
     * @type {rebar.mvc.BaseView}
     * @private
     */
    this.view_ = view || new rebar.mvc.BaseView();
};
goog.inherits(rebar.mvc.ViewController, rebar.mvc.BaseController);

/**
 * @return {rebar.mvc.BaseView}
 * @protected
 */
rebar.mvc.ViewController.prototype.getView = function () {
    return this.view_;
};

/**
 * @override
 */
rebar.mvc.ViewController.prototype.setState = function (state) {
    return this.view_.setState(state);
};

/**
 * @override
 */
rebar.mvc.ViewController.prototype.getState = function () {
    var ret = new rebar.model.StateModel();
    ret.mergeState(this.view_.getState());
    return ret;
};

