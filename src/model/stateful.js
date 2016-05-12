/**
 * @fileoverview 有状态的对象的接口
 * @author hector<zzh-83@163.com>
 */
/* jshint -W069 */
/* eslint-disable fecs-properties-quote */
/* eslint-disable fecs-dot-notation */
goog.provide('rebar.model.Stateful');

goog.require('rebar.mvc.BaseModel');

goog.require('goog.Uri');

/**
 * 用来实现一个有状态的应用，简单来说就是一个应用的任何状态（当然要控制粒度）都可以
 * 用一组简单的数据表示出来，同时通过这个状态数据能恢复应用的状态。
 * 拿longscheduler2.0来说，每个页面就应该有一个状态，这个状态数据就是记录在url里的，
 * 把url拷贝给另一个人，在浏览器打开的时候，js代码从url读出状态数据，就可以恢复到对应的页面。
 *
 * 注：由于切换页面时浏览器不刷新，所以不能通过传统的基于服务器端解析的url
 * @interface
 */
rebar.model.Stateful = function () {
};

/**
 * 设置当前状态，该方法的真正作用也应该是实现者继续调用该接口类型
 * 成员变量的setState来支持整个应用的状态化。
 *
 * @param {rebar.model.StateModel} state
 * @return {boolean} 如果参数不被支持则返回false
 */
rebar.model.Stateful.prototype.setState;

/**
 * 获取当前状态，该方法真正的作用应该是实现者继续调用该接口类型的成员
 * 变量的getState来实现整个应用的状态化。
 *
 * state的key不可以重复（因为会merge在一起放到url里），所以最好都定义在
 * rebar.model.Stateful.keys里
 * @return {rebar.model.StateModel}
 */
rebar.model.Stateful.prototype.getState;

/**
 * @param {Object.<string, string>=} optStateMap 初始数据.
 * @param {string=} optTitle 可以设置一个可选的title.
 * @constructor
 * @extends {rebar.mvc.BaseModel}
 */
rebar.model.StateModel = function (optStateMap, optTitle) {
    rebar.mvc.BaseModel.call(this);

    /**
     * @type {Object.<string, string>}
     * @private
     */
    this.stateMap_ = optStateMap || {};

    /**
     * @type {string}
     * @private
     */
    this.title_ = optTitle || '';
};
goog.inherits(rebar.model.StateModel, rebar.mvc.BaseModel);

/**
 * Create state model from url's query
 * @param {string} url The url
 * @return {rebar.model.StateModel}
 */
rebar.model.StateModel.createFromUrl = function (url) {
    var query = (new goog.Uri(url)).getQueryData();
    var obj = {};
    var keys = query.getKeys();
    goog.array.forEach(keys, function (k) {
        obj[k] = query.get(k);
    });
    return new rebar.model.StateModel(obj);
};

/**
 * 可以在一开始就调用该方法进行设置
 * @param {function (rebar.model.StateModel):string} callback
 */
rebar.model.StateModel.setToUrlCallback = function (callback) {
    rebar.model.StateModel.toUrlCallback_ = callback;
};

/**
 * @return {string}
 */
rebar.model.StateModel.prototype.getTitle = function () {
    return this.title_;
};

/**
 * @param {string} title The title.
 */
rebar.model.StateModel.prototype.setTitle = function (title) {
    this.title_ = title;
};

/**
 * @param {string} key
 * @return {boolean}
 */
rebar.model.StateModel.prototype.hasKey = function (key) {
    return goog.isDef(this.stateMap_[key]);
};

/**
 * @param {string} key
 * @param {string=} defaultVal
 * @return {string|undefined}
 */
rebar.model.StateModel.prototype.getStateItem = function (key, defaultVal) {
    return this.stateMap_[key] || defaultVal || undefined;
};

/**
 * @param {string} key
 * @param {string} state
 */
rebar.model.StateModel.prototype.setStateItem = function (key, state) {
    this.stateMap_[key] = state;
};

/**
 * @param {string} key
 */
rebar.model.StateModel.prototype.removeStateKey = function (key) {
    delete this.stateMap_[key];
};

/**
 * @param {rebar.model.StateModel} state
 */
rebar.model.StateModel.prototype.mergeState = function (state) {
    goog.object.extend(this.stateMap_, state.stateMap_);
};

/**
 * @param {rebar.model.StateModel} state
 * @return {boolean}
 */
rebar.model.StateModel.prototype.containsState = function (state) {
    for (var key in state.stateMap_) {
        if (this.stateMap_[key] !== state.stateMap_[key]) {
            return false;
        }
    }
    return true;
};

/**
 * @return {Object.<string, string>}
 */
rebar.model.StateModel.prototype.getStateMap = function () {
    return this.stateMap_;
};

/**
 * @override
 */
rebar.model.StateModel.prototype.toJson = function () {
    return {
        'map': this.stateMap_
    };
};

/**
 * @override
 */
rebar.model.StateModel.prototype.initWitJson = function (obj) {
    if (!obj) {
        return false;
    }
    this.stateMap_ = {};
    goog.object.extend(this.stateMap_, obj['map'] || {});
    return true;
};

/**
 * @return {string}
 */
rebar.model.StateModel.prototype.toUrl = function () {
    if (rebar.model.StateModel.toUrlCallback_) {
        return rebar.model.StateModel.toUrlCallback_.call(undefined, this);
    }
    var ret = new goog.Uri();
    goog.object.forEach(this.stateMap_, function (val, k) {
        ret.setParameterValue(k, val);
    });
    return ret.toString();
};

/**
 * @type {function (rebar.model.StateModel):string}
 */
rebar.model.StateModel.toUrlCallback_;

