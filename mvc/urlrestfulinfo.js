/**
 * @file 保存替换url内容，可以生成符合需要的url
 * @author chenhaolong<411150056@qq.com>
 */
/* jshint -W069 */
/* eslint-disable fecs-properties-quote */
/* eslint-disable fecs-dot-notation */
goog.provide('baidu.base.UrlRestfulInfo');

goog.require('baidu.base.BaseModel');


/**
 * 生成uri相关
 * @param {string} replaceTarget 被替换内容
 * @param {Object} fillMap 填充map，key:token，value:填充字符
 * @constructor
 * @extends {baidu.base.BaseModel}
 */
baidu.base.UrlRestfulInfo = function (replaceTarget, fillMap) {
    baidu.base.BaseModel.call(this);

    /**
     * @type {string|null} 被替换字符串
     */
    this.replaceTarget = replaceTarget;

    /**
     * @type {Object.<string, string>|null} map
     */
    this.fillMap = fillMap;
};
goog.inherits(baidu.base.UrlRestfulInfo, baidu.base.BaseModel);

/**
 * @override
 */
baidu.base.UrlRestfulInfo.prototype.toJson = function () {
    var ret = baidu.base.UrlRestfulInfo.superClass_.toJson.call(this);
    ret['replaceTarget'] = this.replaceTarget;
    ret['fillMap'] = this.fillMap;
    return ret;
};

/**
 * @override
 */
baidu.base.UrlRestfulInfo.prototype.initWitJson = function (obj) {
    if (!baidu.base.UrlRestfulInfo.superClass_.initWitJson.call(this, obj)) {
        return false;
    }
    this.replaceTarget = obj['replaceTarget'] || this.replaceTarget;
    this.fillMap = obj['fillMap'] || this.fillMap;
    return true;
};

/**
 * 生成restful uri
 * @param {string} uri uri
 * @param {string} token token
 * @return {string} new uri
 */
baidu.base.UrlRestfulInfo.prototype.generateUri = function (uri, token) {
    if (this.fillMap && this.replaceTarget && uri) {
        if (goog.string.startsWith(token, '?')) {
            token = token.substr(1, token.length - 1);
        }
        var tokenFromSubAddr = this.getTokenFromSubAddr();
        if (tokenFromSubAddr) {
            if (!token) {
                token = tokenFromSubAddr;
            } else {
                if (!goog.string.contains(token, tokenFromSubAddr)) {
                    token = tokenFromSubAddr + '&' + token;
                }
            }
        }
        if (!token) {
            return uri;
        }
        var keys = token.split('&');
        goog.array.forEach(keys, function (item) {
            var map = this.fillMap;
            if (map && map[item]) {
                if (undefined === this.replaceTarget) {
                    return;
                }
                uri = uri.replace(this.replaceTarget, map[item]);
            }
        }, this);
        // 将旧token替换
        if (goog.string.contains(uri, '?')) {
            return uri.split('?')[0] + '?' + token;
        }
        return uri + '?' + token;
    }
    return uri;
};

/**
 * 从uri中截取二级目录，获取需要添加的token
 * @return {string} new token
 */
baidu.base.UrlRestfulInfo.prototype.getTokenFromSubAddr = function () {
    var uri = window.location.href;
    // 获取二级目录，如果没有二级目录，则返回空字符串
    var subAddr = this.getSubAddr_(uri);
    if (subAddr) {
        if (goog.object.containsValue(this.fillMap, subAddr)) {
            var key;
            goog.object.findKey(this.fillMap, function (localValue, localKey) {
                if (localValue === subAddr) {
                    key = localKey;
                    return true;
                }
                return false;
            });
            // 如果有需要替换的二级目录，在这里进行替换
            if (key) {
                if (!goog.string.contains(uri, key)) {
                    return key;
                }
            }
        }
    }
    return '';
};

/**
 * 获取二级目录
 * @param {string} uri uri
 * @return {string} uri uri
 * @private
 */
baidu.base.UrlRestfulInfo.prototype.getSubAddr_ = function (uri) {
    if (goog.string.startsWith(uri, 'http')) {
        var localList1 = uri.split('/');
        if (localList1.length >= 4) {
            if (goog.string.contains(localList1[3], '?')) {
                return localList1[3].split('?')[0];
            }
            return localList1[3];
        }
    } else {
        var localList2 = uri.split('/');
        if (localList2.length >= 2) {
            if (goog.string.contains(localList2[1], '?')) {
                return localList2[1].split('?')[0];
            }
            return localList2[1];
        }
    }
    return '';
};

