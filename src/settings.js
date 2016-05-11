/**
 * @fileoverview jsbase模块的设置
 *
 * @author zhangzhihong02
 */
/* jshint -W069 */
/* eslint-disable fecs-properties-quote */
/* eslint-disable fecs-dot-notation */
goog.provide('baidu.base.Settings');

goog.require('baidu.base.BaseModel');

/**
 * @param {string=} optModuleResBasePath
 * @constructor
 * @extends {baidu.base.BaseModel}
 */
baidu.base.Settings = function (optModuleResBasePath) {
    this.moduleResBasePath = optModuleResBasePath || '';
};
goog.inherits(baidu.base.Settings, baidu.base.BaseModel);

/**
 * @type {baidu.base.Settings}
 * @private
 */
baidu.base.Settings.default_ = new baidu.base.Settings();

/**
 * @return {baidu.base.Settings}
 */
baidu.base.Settings.getDefault = function () {
    return baidu.base.Settings.default_;
};

/**
 * @param {baidu.base.Settings} ins
 */
baidu.base.Settings.setDefault = function (ins) {
    baidu.base.Settings.default_ = ins;
};

/**
 * @override
 */
baidu.base.Settings.prototype.toJson = function () {
    return {
        'moduleResBasePath': this.moduleResBasePath
    };
};

/**
 * @override
 */
baidu.base.Settings.prototype.initWitJson = function (obj) {
    if (!obj) {
        return false;
    }
    this.moduleResBasePath = obj['moduleResBasePath'];
    return true;
};
