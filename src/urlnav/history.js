/**
 * @fileoverview 管理浏览器历史信息的类
 * @author hector<zzh-83@163.com>
 */
goog.provide('rebar.urlnav.History');

goog.require('goog.history.EventType');
goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');
goog.require('goog.events');

goog.require('goog.history.Html5History');
goog.require('goog.history.Html5History.TokenTransformer');


/**
 * Pay attention that this class is singleton.
 * In order to record different information in history token, information is
 * organized as key value pairs, the key and value is connected with "=", and
 * the different key value pairs are divided by "&".
 * So, if you set the history token directly by function
 * rebar.urlnav.History.prototype.setToken, please use the principle above.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
rebar.urlnav.History = function () {
    goog.events.EventTarget.call(this);
    /**
     * @type {goog.history.Html5History}
     * @private
     */
    this.html5History_ = this.getHtml5History_();

    /**
     * @type {goog.Uri.QueryData}
     * @private
     */
    this.tokenQuery_ = new goog.Uri.QueryData(this.getToken_());

    /**
     * @type {goog.Uri.QueryData}
     * @private
     */
    this.originalQuery_ = (new goog.Uri(window.location.href)).getQueryData();

    /**
     * @type {function(string, string): string|null}
     * @private
     */
    this.uriGenerator_ = null;

    /**
     * @type {function(): string|null}
     * @private
     */
    this.syncUriToken_ = null;
};
goog.inherits(rebar.urlnav.History, goog.events.EventTarget);
goog.addSingletonGetter(rebar.urlnav.History);

/**
 * Set a new key value pair and replace the old value.
 * @param {string|Object} keyOrMap Should be decoded string. If the parameter is
 *        Object, it will be treated as key value map.
 * @param {*=} value If the first parameter is Object, this one will be
 *        ignored.
 */
rebar.urlnav.History.prototype.setTokenItem = function (keyOrMap, value) {
    this.setInternalToken_(keyOrMap, value);
    this.setToken_(this.getUniformToken_());
};

/**
 * Update the key value pair in history token and replace the old value.
 * {@see goog.history.History.prototype.replaceToken}
 * @param {string|Object} keyOrMap
 *      {@see rebar.urlnav.History.prototype.setTokenItem}.
 * @param {*=} value {@see rebar.urlnav.History.prototype.setTokenItem}.
 */
rebar.urlnav.History.prototype.replaceTokenItem = function (keyOrMap,
    value) {
    this.setInternalToken_(keyOrMap, value);
    this.replaceToken_(this.getUniformToken_());
};

/**
 * Remove the token key.
 * @param {string|Array} key If key is Array, the parameter will be treated as
 *        an array of keys.
 * @param {boolean=} replace To replace corresponding token or not.
 */
rebar.urlnav.History.prototype.removeTokenItem = function (key, replace) {
    if (goog.isArray(key)) {
        for (var i in key) {
            this.tokenQuery_.remove(key[i]);
        }
    } else if (goog.isString(key)) {
        this.tokenQuery_.remove(key);
    }
    if (replace) {
        this.replaceToken_(this.getUniformToken_());
    } else {
        this.setToken_(this.getUniformToken_());
    }
};

/**
 * @param {string} key The key.
 * @param {*=} defaultVal The default value if the corresponding key does not
 *          exist.
 * @return {*} The first value associated with the key.
 */
rebar.urlnav.History.prototype.getTokenValue = function (key, defaultVal) {
    return this.tokenQuery_.get(key, this.originalQuery_.get(key, defaultVal));
};

/**
 * Get all values
 * @return {Object}
 */
rebar.urlnav.History.prototype.getUrlParams = function () {
    var ret = {};
    var keys = this.tokenQuery_.getKeys();
    for (var i in keys) {
        ret[keys[i]] = this.tokenQuery_.get(keys[i]);
    }
    return ret;
};

/**
 * Sets the history state.
 * @param {string|Object} token The history state identifier.
 * @param {string=} title Optional title to associate with history entry.
 * TODO check what this title is really used to.
 */
rebar.urlnav.History.prototype.setToken = function (token, title) {
    if (goog.isString(token)) {
        this.tokenQuery_ = new goog.Uri.QueryData(token + '');
    } else {
        this.tokenQuery_ = goog.Uri.QueryData.createFromMap(/** @type {Object} */(token) || {});
    }
    this.setToken_(this.getUniformToken_(), title);
};

/**
 * Replaces the current history state without affecting the rest of the history
 * stack.
 * @param {string|Object} token The history state identifier.
 * @param {string=} title Optional title to associate with history entry.
 */
rebar.urlnav.History.prototype.replaceToken = function (token, title) {
    if (goog.isString(token)) {
        this.tokenQuery_ = new goog.Uri.QueryData(token + '');
    } else {
        this.tokenQuery_ = goog.Uri.QueryData.createFromMap(/** @type {Object} */(token) || {});
    }
    this.replaceToken_(this.getUniformToken_(), title);
};

/**
 * Set the internal token
 * @param {string|Object} keyOrMap
 *      {@see rebar.urlnav.History.prototype.setTokenItem}
 * @param {*=} value {@see rebar.urlnav.History.prototype.setTokenItem}.
 */
rebar.urlnav.History.prototype.setInternalToken_ = function (keyOrMap, value) {
    if (goog.isObject(keyOrMap)) {
        for (var key in keyOrMap) {
            this.tokenQuery_.set(key, keyOrMap[key]);
        }
    } else {
        this.tokenQuery_.set(keyOrMap.toString(), value);
    }
};

/**
 * @return {string} The uniform token.
 * @private
 */
rebar.urlnav.History.prototype.getUniformToken_ = function () {
    var token = this.tokenQuery_.toString();
    var keyValues = token.split('&');
    keyValues.sort();
    return keyValues.join('&');
};

/**
 * The navigate event listener.
 * @param {goog.history.Event} event The history event.
 */
rebar.urlnav.History.prototype.onNavigate_ = function (event) {
    if (event.isNavigation) {
        this.tokenQuery_ = new goog.Uri.QueryData(this.getToken_());
    }
    this.dispatchEvent(event);
    event.preventDefault();
};

/**
 * @return {goog.history.Html5History}
 * @private
 */
rebar.urlnav.History.prototype.getHtml5History_ = function () {
    if (!goog.history.Html5History.isSupported()) {
        return null;
    }
    var transformer = this.uriGenerator_ === undefined || this.uriGenerator_ === null ?
                    new rebar.urlnav.History.TokenTransformer() :
                    new rebar.urlnav.History.TokenTransformer(this.uriGenerator_);
    var ret = new goog.history.Html5History(
              window, transformer);
    ret.setUseFragment(false);

    goog.events.listen(ret, goog.history.EventType.NAVIGATE,
        goog.bind(this.onNavigate_, this));
    ret.setEnabled(true);
    return ret;
};

/**
 * @return {string}
 * @private
 */
rebar.urlnav.History.prototype.getToken_ = function () {
    return this.html5History_ ? this.html5History_.getToken() : '';
};

/**
 * @param {string} token The token
 * @param {string=} optTitle The optional title
 * @private
 */
rebar.urlnav.History.prototype.setToken_ = function (token, optTitle) {
    this.html5History_ && this.html5History_.setToken(token, optTitle);
};

/**
 * @param {string} token The token
 * @param {string=} optTitle The optional title
 * @private
 */
rebar.urlnav.History.prototype.replaceToken_ = function (token, optTitle) {
    this.html5History_ && this.html5History_.replaceToken(token, optTitle);
};

/**
 * set uri generator
 * @param {function(string, string): string} uriGenerator callback to generate uri
 */
rebar.urlnav.History.prototype.setUriGenerator = function (uriGenerator) {
    this.uriGenerator_ = uriGenerator;
    this.html5History_ = this.getHtml5History_();
};

/**
 * set syncUriToken callback
 * @param {function(): string} syncUriTokenCallback callback to sync token
 */
rebar.urlnav.History.prototype.setSyncUriTokenCallback = function (syncUriTokenCallback) {
    this.syncUriToken_ = syncUriTokenCallback;
};

/**
 * @inheritDoc
 */
rebar.urlnav.History.prototype.disposeInternal = function () {
    this.html5History_ && this.html5History_.dispose();

    rebar.urlnav.History.superClass_.disposeInternal.call(this);
};

/**
 * synchronize token from uri
 */
rebar.urlnav.History.prototype.syncTokenFromUri = function () {
    if (this.syncUriToken_) {
        var token = this.syncUriToken_();
        if (token) {
            this.setToken_(token);
            this.tokenQuery_ = new goog.Uri.QueryData(this.getToken_());
        }
    }
};

/**
 * token transformer
 * @param {function(string, string): string=} optUriGenerator callback to generate uri
 * @constructor
 * @implements {goog.history.Html5History.TokenTransformer}
 */
rebar.urlnav.History.TokenTransformer = function (optUriGenerator) {
    this.uriGenerator_ = optUriGenerator;
};

/**
 * @override
 */
rebar.urlnav.History.TokenTransformer.prototype.retrieveToken = function (pathPrefix,
    location) {
    return location.search.replace(/^\?+/, '');
};

/**
 * @override
 */
rebar.urlnav.History.TokenTransformer.prototype.createUrl = function (token, pathPrefix, location) {
    var ret = window.location.href.replace(/(\?.*?)*(#(.*)|$)/,
        goog.partial(function (token, match, p1, p2, p3) {
            return (token ? '?' + token : '') + (p3 ? p2 : '');
        }, token));
    if (this.uriGenerator_ && token) {
        return this.uriGenerator_(ret, token);
    }
    return ret;
};

