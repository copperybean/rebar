/**
 * @file extern file for bigdata
 *
 * @author rongweiwei
 */

/**
 * params
 * @constructor
 */
var modelParam = function () {
    /**
     * @type {userModel}
     */
    this.user;

    /**
     * @type {string}
     */
    this.basePath;

    /**
     * @type {string}
     */
    this.imgBasePath;

    /**
     * @type {number}
     */
    this.accessKey;

    /**
     * @type {string}
     */
    this.logoutUrl;
};

/**
 * userModel
 * @constructor
 */
var userModel = function () {
    /**
     * @type {string}
     */
    this.uicName;

    /**
     * @type {string}
     */
    this.gianoGroup;
};

var baiduBigdata = {};

/**
 * 渲染导航条
 * @param {Element} el The element on which to render bigdata navbar
 * @param {Object} options The options
 * @return {Element} element
 */
baiduBigdata.bigdataNavBar;

/**
 * Giano登录
 * @param {string} curGroup 当前用户组
 * @param {Array.<string>} groups 用户组列表
 */
baiduBigdata.gianoLogin = function (curGroup, groups) {};

/**
 * 调查问卷
 * @param {string} user 用户名
 * @param {string} optBasePath 地址
 */
baiduBigdata.bigdataSurvey = function (user, optBasePath) {};

