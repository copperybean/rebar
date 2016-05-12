/**
 * @fileoverview jsbase模块的设置
 *
 * @author zhangzhihong02
 */
/* jshint -W069 */
/* eslint-disable fecs-properties-quote */
/* eslint-disable fecs-dot-notation */
goog.provide('rebar.model.Settings');

goog.require('rebar.mvc.BaseModel');

/**
 * @param {string=} optModuleResBasePath
 * @constructor
 * @extends {rebar.mvc.BaseModel}
 */
rebar.model.Settings = function (optModuleResBasePath) {
    this.moduleResBasePath = optModuleResBasePath || '';
};
goog.inherits(rebar.model.Settings, rebar.mvc.BaseModel);

/**
 * @type {rebar.model.Settings}
 * @private
 */
rebar.model.Settings.default_ = new rebar.model.Settings();

/**
 * @return {rebar.model.Settings}
 */
rebar.model.Settings.getDefault = function () {
    return rebar.model.Settings.default_;
};

/**
 * @param {rebar.model.Settings} ins
 */
rebar.model.Settings.setDefault = function (ins) {
    rebar.model.Settings.default_ = ins;
};

/**
 * @override
 */
rebar.model.Settings.prototype.toJson = function () {
    return {
        'moduleResBasePath': this.moduleResBasePath
    };
};

/**
 * @override
 */
rebar.model.Settings.prototype.initWitJson = function (obj) {
    if (!obj) {
        return false;
    }
    this.moduleResBasePath = obj['moduleResBasePath'];
    return true;
};
