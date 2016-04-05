/**
 * @fileoverview 操作url的开放接口
 *
 * @author hector<zzh-83@163.com>
 */
goog.provide('baidu.base.UrlTool');

goog.require('baidu.base.History');
goog.require('goog.events');

/**
 * The boolean param a flag denoting whether the change is triggered by browser action.
 * @typedef function (boolean)
 */
baidu.base.UrlToolTokenChangeCallbackType;

/**
 * @constructor
 */
baidu.base.UrlTool = function () {

    /**
     * @type {baidu.base.UrlToolTokenChangeCallbackType}
     * @private
     */
    this.tokenChangeCallback_ = goog.nullFunction;

    goog.events.listen(baidu.base.History.getInstance(),
               goog.history.EventType.NAVIGATE,
               goog.bind(this.onNavigate_, this));
};
goog.addSingletonGetter(baidu.base.UrlTool);

/**
 * @param {baidu.base.UrlToolTokenChangeCallbackType} callback
 */
baidu.base.UrlTool.prototype.setUrlTokenChangeCallback = function (callback) {
    this.tokenChangeCallback_ = callback;
};

/**
 * 设置restful对应关系，当更改url时，替换相应的内容
 * @param {function (string, string): string} uriGenerator callback to generate uri
 */
baidu.base.UrlTool.prototype.setUriGenerator = function (uriGenerator) {
    var history = baidu.base.History.getInstance();
    history.setUriGenerator(uriGenerator);
};

/**
 * 设置同步uri token 回调
 * @param {function (): string} syncUriTokenCallback callback to generate uri
 */
baidu.base.UrlTool.prototype.setSyncUriTokenCallback = function (syncUriTokenCallback) {
    var history = baidu.base.History.getInstance();
    history.setSyncUriTokenCallback(syncUriTokenCallback);
};

/**
 * @return {Object.<string, string>}
 */
baidu.base.UrlTool.prototype.getUrlParams = function () {
    baidu.base.History.getInstance().syncTokenFromUri();
    return baidu.base.History.getInstance().getUrlParams();
};

/**
 * @param {Object} itemsMap @see baidu.base.History.prototype.setTokenItem
 * @param {boolean=} replace @see baidu.base.History.prototype.replaceTokenItem
 * @param {string=} pageTitle
 */
baidu.base.UrlTool.prototype.setQuery = function (itemsMap, replace, pageTitle) {
    if (replace) {
        baidu.base.History.getInstance().replaceToken(itemsMap, pageTitle);
    } else {
        baidu.base.History.getInstance().setToken(itemsMap, pageTitle);
    }
};

/**
 * @param {goog.events.Event} e
 * @private
 */
baidu.base.UrlTool.prototype.onNavigate_ = function (e) {
    this.tokenChangeCallback_.call(window, e.isNavigation);
};

(function () {
    // 生成外部调用接口
    var urltool = {};
    var instance = baidu.base.UrlTool.getInstance();
    goog.exportProperty(urltool, 'setUrlParams', goog.bind(instance.setQuery, instance));
    goog.exportProperty(
      urltool, 'urlTokenChange', goog.bind(instance.setUrlTokenChangeCallback, instance));
    goog.exportProperty(urltool, 'getUrlParams', goog.bind(instance.getUrlParams, instance));
    goog.exportSymbol('baidu_urltool', urltool);
    goog.exportSymbol('baiduUrltool', urltool);
}).call(window);
