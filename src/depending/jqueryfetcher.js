/**
 * @fileoverview ajax的基类，实现更方便的调用
 *
 * @author hector<zzh-83@163.com>
 */
goog.provide('baidu.base.JQueryFetcher');

goog.require('baidu.base.ClosureDialog');
goog.require('baidu.base.DialogInterface');
goog.require('baidu.base.MessageBox');

goog.require('goog.async.Delay');

/**
 * @param {string=} optBasePath
 * @constructor
 */
baidu.base.JQueryFetcher = function (optBasePath) {

    /**
     * @type {string}
     * @private
     */
    this.basePath_ = optBasePath || '';

    /**
     * @type {Object.<string, jQuery.jqXHR>}
     * @private
     */
    this.urlAjaxMap_ = {};
};

/**
 * @param {string} url
 * @param {string=} mutexQueue
 * @return {boolean}
 */
baidu.base.JQueryFetcher.prototype.isSendingRequest = function (url, mutexQueue) {
    return !!this.urlAjaxMap_[url + (mutexQueue || '')];
};

/**
 * 所有ajax入口
 * @param {Object.<string, *>} options jQuery的AJAX的参数
 *   参看JQueryFetcherSettings
 * @return {jQuery.jqXHR}
 * @desc 测试默认会使用mock ajax
 */
baidu.base.JQueryFetcher.prototype.ajax = function (options) {
    this.info_(options);

    var defaults = {
        type: 'GET',
        async: true,
        dataType: 'json',
        abortSameUrlAjax: true,
        popupError: true
    };
    var mutexKey = options.url + (options.mutexQueue || '');

    options = $.extend({}, defaults, options);
    var isRelativeUrl = options.url.search(/\w:\/\//) < 0;
    options.url = (isRelativeUrl ? this.basePath_ : '') + options.url;
    var loadingId = null;
    var loadingDelay = null;

    // ajax请求的默认设置
    var customErrorFun = options.error;
    options.error = goog.bind(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 401) {
            this.warn401Error();
        } else if (jqXHR.status >= 500 && jqXHR.status < 600) {
            this.warn5XXError(jqXHR.responseText, jqXHR.status);
        } else if (textStatus != 'abort' && jqXHR.status != 0) {
            // 弹出提示 或 打印日志
            if (options.popupError) {
                var content = jqXHR.status + ' ' + errorThrown + '</br>' + options.url;
                this.getErrorDialog(true).setup('异常', content, true, false).show();
            } else {
                this.info_(jqXHR);
                this.info_(textStatus);
                this.info_(errorThrown);
            }
        }

        if ($.isFunction(customErrorFun)) {
            customErrorFun.call(window, jqXHR, textStatus, errorThrown);
        }
    }, this);

    var customSuccessFun = options.success;
    options.success = goog.bind(function (data, textStatus, jqXHR) {
        if ($.isFunction(customSuccessFun)) {
            customSuccessFun.call(window, data, textStatus, jqXHR);
        }
    }, this);

    var customCompleteFunc = options.complete;
    options.complete = goog.bind(function (jqXHR, textStatus) {
        delete this.urlAjaxMap_[mutexKey];

        // 关闭提示
        if (loadingDelay && loadingDelay.isActive()) {
            loadingDelay.stop();
        } else if (goog.isNumber(loadingId)) {
            baidu.base.MessageBox.getInstance().hide(/** @type {number} */(loadingId));
        }

        if (goog.isFunction(customCompleteFunc)) {
            customCompleteFunc.call(window, jqXHR, textStatus);
        }
    }, this);

    if (options.abortSameUrlAjax && this.urlAjaxMap_[mutexKey]) {
        this.urlAjaxMap_[mutexKey].abort();
    }
    if (options.loadingInfo) {
        loadingDelay = new goog.async.Delay(function () {
            loadingId = baidu.base.MessageBox.getInstance().showLoading(options.loadingInfo);
        }, 500);
        loadingDelay.start();
    }
    this.urlAjaxMap_[mutexKey] = $.ajax(options);
    return this.urlAjaxMap_[mutexKey];
};

/**
 * 中断所有请求
 */
baidu.base.JQueryFetcher.prototype.abortAll = function () {
    for (var key in this.urlAjaxMap_) {
        this.urlAjaxMap_[key].abort();
    }
};

/**
 * @protected
 */
baidu.base.JQueryFetcher.prototype.warn401Error = function () {
    var msg = '您已经退出登陆，点击确定刷新页面';
    this.getErrorDialog(true).setup('未登陆', msg, true, function () {
        window.location.reload();
    }).show();
};

/**
 * @param {string} responseText
 * @param {number=} optResponseStatus
 * @protected
 */
baidu.base.JQueryFetcher.prototype.warn5XXError = function (responseText, optResponseStatus) {
    var m = '服务器发生错误';
    try {
        var exception = JSON.parse(responseText);
        var phpExceptionField = 'Exception', phpMsgField = 'message';
        if (exception && exception[phpExceptionField] &&
            exception[phpExceptionField][phpMsgField]) {
            m = exception[phpExceptionField][phpMsgField];
        }
    } catch (err) {
        // do nothing
    }
    this.getErrorDialog(true).setup('错误', m, false).show();
};

/**
 * @param {boolean=} optReset
 * @return {baidu.base.DialogInterface}
 * @protected
 */
baidu.base.JQueryFetcher.prototype.getErrorDialog = function (optReset) {
    if (optReset) {
        this.destroyErrorDialog_();
    }
    if (!baidu.base.JQueryFetcher.errorDialog_) {
        baidu.base.JQueryFetcher.errorDialog_ = this.buildErrorDialog();
    }
    return baidu.base.JQueryFetcher.errorDialog_;
};

/**
 * 生成错误对话框
 * @return {baidu.base.DialogInterface}
 * @protected
 */
baidu.base.JQueryFetcher.prototype.buildErrorDialog = function () {
    return new baidu.base.ClosureDialog();
};

/**
 * @private
 */
baidu.base.JQueryFetcher.prototype.destroyErrorDialog_ = function () {
    if (baidu.base.JQueryFetcher.errorDialog_) {
        baidu.base.JQueryFetcher.errorDialog_.dispose();
        baidu.base.JQueryFetcher.errorDialog_ = null;
    }
};

/**
 * @param {*} object
 * @private
 */
baidu.base.JQueryFetcher.prototype.info_ = function (object) {
    window.console.info(object);
};

/**
 * @type {baidu.base.DialogInterface}
 * @private
 */
baidu.base.JQueryFetcher.errorDialog_ = null;

/**
 * @extends {jQuery.ajaxSettings}
 */
baidu.base.JQueryFetcherSettings = {};

/**
 * @type {boolean}
 */
baidu.base.JQueryFetcherSettings.popupError = true;

/**
 * @type {string}
 */
baidu.base.JQueryFetcherSettings.mutexQueue = '';

/**
 * @type {string}
 */
baidu.base.JQueryFetcherSettings.loadingInfo = '';

/**
 * @type {boolean}
 */
baidu.base.JQueryFetcherSettings.abortSameUrlAjax = true;

