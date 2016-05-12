/**
 * @fileoverview 操作url的开放接口
 *
 * @author hector<zzh-83@163.com>
 */
goog.provide('rebar.urlnav.UrlTool');

goog.require('rebar.urlnav.History');
goog.require('goog.events');

/**
 * The boolean param a flag denoting whether the change is triggered by browser action.
 * @typedef function (boolean)
 */
rebar.urlnav.UrlToolTokenChangeCallbackType;

/**
 * @constructor
 */
rebar.urlnav.UrlTool = function () {

    /**
     * @type {rebar.urlnav.UrlToolTokenChangeCallbackType}
     * @private
     */
    this.tokenChangeCallback_ = goog.nullFunction;

    goog.events.listen(rebar.urlnav.History.getInstance(),
               goog.history.EventType.NAVIGATE,
               goog.bind(this.onNavigate_, this));
};
goog.addSingletonGetter(rebar.urlnav.UrlTool);

/**
 * @param {rebar.urlnav.UrlToolTokenChangeCallbackType} callback
 */
rebar.urlnav.UrlTool.prototype.setUrlTokenChangeCallback = function (callback) {
    this.tokenChangeCallback_ = callback;
};

/**
 * 设置restful对应关系，当更改url时，替换相应的内容
 * @param {function (string, string): string} uriGenerator callback to generate uri
 */
rebar.urlnav.UrlTool.prototype.setUriGenerator = function (uriGenerator) {
    var history = rebar.urlnav.History.getInstance();
    history.setUriGenerator(uriGenerator);
};

/**
 * 设置同步uri token 回调
 * @param {function (): string} syncUriTokenCallback callback to generate uri
 */
rebar.urlnav.UrlTool.prototype.setSyncUriTokenCallback = function (syncUriTokenCallback) {
    var history = rebar.urlnav.History.getInstance();
    history.setSyncUriTokenCallback(syncUriTokenCallback);
};

/**
 * @return {Object.<string, string>}
 */
rebar.urlnav.UrlTool.prototype.getUrlParams = function () {
    rebar.urlnav.History.getInstance().syncTokenFromUri();
    return rebar.urlnav.History.getInstance().getUrlParams();
};

/**
 * @param {Object} itemsMap @see rebar.urlnav.History.prototype.setTokenItem
 * @param {boolean=} replace @see rebar.urlnav.History.prototype.replaceTokenItem
 * @param {string=} pageTitle
 */
rebar.urlnav.UrlTool.prototype.setQuery = function (itemsMap, replace, pageTitle) {
    if (replace) {
        rebar.urlnav.History.getInstance().replaceToken(itemsMap, pageTitle);
    } else {
        rebar.urlnav.History.getInstance().setToken(itemsMap, pageTitle);
    }
};

/**
 * @param {goog.events.Event} e
 * @private
 */
rebar.urlnav.UrlTool.prototype.onNavigate_ = function (e) {
    this.tokenChangeCallback_.call(window, e.isNavigation);
};

(function () {
    // 生成外部调用接口
    var urltool = {};
    var instance = rebar.urlnav.UrlTool.getInstance();
    goog.exportProperty(urltool, 'setUrlParams', goog.bind(instance.setQuery, instance));
    goog.exportProperty(
      urltool, 'urlTokenChange', goog.bind(instance.setUrlTokenChangeCallback, instance));
    goog.exportProperty(urltool, 'getUrlParams', goog.bind(instance.getUrlParams, instance));
    goog.exportSymbol('baidu_urltool', urltool);
    goog.exportSymbol('baiduUrltool', urltool);
}).call(window);
