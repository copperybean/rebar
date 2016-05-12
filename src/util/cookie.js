/**
 * @fileoverview 操作cookie的封装
 * @author hector<zzh-83@163.com>
 */
goog.provide('rebar.util.cookie');

goog.require('goog.crypt.base64');
goog.require('goog.net.cookies');

/**
 * @param {string} name
 * @param {string=} defaultVal
 * @return {string|undefined}
 */
rebar.util.cookie.get = function (name, defaultVal) {
    var ret = goog.net.cookies.get(name, defaultVal);
    if (ret) {
        return decodeURIComponent(ret);
    }
    return defaultVal;
};

/**
 * 如果期望对某个参数的意义做进一步了解，请参看goog.net.Cookies.prototype.set
 * @param {string} name The name of cookie
 * @param {string} value The value of cookie
 * @param {number=} maxAge The max age in seconds
 * @param {?string=} path
 * @param {?string=} domain
 * @param {boolean=} secure
 * @return {boolean}
 */
rebar.util.cookie.set = function (name, value, maxAge, path, domain, secure) {
    value = encodeURIComponent(value);
    if (value.length > goog.net.Cookies.MAX_COOKIE_LENGTH) {
        return false;
    }
    path = rebar.util.cookie.defaultBasePath_ + (path || '');
    goog.net.cookies.set(name, value, maxAge, path, domain, secure);
    return true;
};

/**
 * @param {string} path
 */
rebar.util.cookie.setBasePath = function (path) {
    rebar.util.cookie.defaultBasePath_ = path;
};

/**
 * @type {string}
 * @private
 */
rebar.util.cookie.defaultBasePath_ = '';
