// Copyright (c) 2017, Baidu Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A cookie utility
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.util.cookie');

goog.require('goog.crypt.base64');
goog.require('goog.net.cookies');

/**
 * Get cookie with name
 * @param {string} name The name of cookie
 * @param {string=} optDefaultVal The default value
 * @return {string|undefined}
 */
rebar.util.cookie.get = function (name, optDefaultVal) {
    var ret = goog.net.cookies.get(name, optDefaultVal);
    if (ret) {
        return decodeURIComponent(ret);
    }
    return optDefaultVal;
};

/**
 * Set the cookie
 * @param {string} name The name of cookie
 * @param {string} value The value of cookie
 * @param {number=} maxAge The max age in seconds
 * @param {?string=} path The path of cookie
 * @param {?string=} domain The domain
 * @param {boolean=} secure The secure
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
 * Set the base path for whole project
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
