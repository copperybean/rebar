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
 * @fileoverview Wrapper of jquery ajax function, using jquery ajax mainly
 * because the promise provided.
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.common.JQueryFetcher');

goog.require('rebar.util.MessageBox');

goog.require('goog.async.Delay');
goog.require('goog.object');

/**
 * The ajax fetcher implemented by jquery
 * @param {string=} optBasePath
 * @constructor
 */
rebar.demo.common.JQueryFetcher = function (optBasePath) {

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
 * Whether this fetcher is fetching
 * @param {string=} optUrl The url to check
 * @param {string=} optMutexQueue The mutex queue
 * @return {boolean}
 */
rebar.demo.common.JQueryFetcher.prototype.isSendingRequest =
    function (optUrl, optMutexQueue) {
  if (optUrl) {
    return !!this.urlAjaxMap_[optUrl + (optMutexQueue || '')];
  }
  return !!goog.object.getAnyKey(this.urlAjaxMap_);
};

/**
 * The ajax function, the interface is almost same with the jquery's $.ajax
 * @param {Object.<string, *>} options The ajax options,
 *    extended jquery's ajax option, added some new feature.
 * @return {jQuery.jqXHR}
 */
rebar.demo.common.JQueryFetcher.prototype.ajax = function (options) {
  var defaults = {
    type: 'GET',
    async: true,
    dataType: 'json'
  };
  var mutexKey = options.url + (options.mutexQueue || '');

  options = $.extend({}, defaults, options);
  var isRelativeUrl = options.url.search(/\w:\/\//) < 0;
  options.url = (isRelativeUrl ? this.basePath_ : '') + options.url;
  var loadingId = null;
  var loadingDelay = null;

  var customErrorFun = options.error;
  options.error = goog.bind(function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.status == 401) {
      this.warn401Error();
    } else if (jqXHR.status >= 500 && jqXHR.status < 600) {
      this.warn5XXError(jqXHR.responseText, jqXHR.status);
    } else if (textStatus != 'abort' && jqXHR.status != 0) {
      var content = jqXHR.status + ' ' + errorThrown + '</br>';
      this.getErrorDialog(true).setup('Error', content, true, false);
      this.getErrorDialog().show();
    }

    if ($.isFunction(customErrorFun)) {
      customErrorFun.call(null, jqXHR, textStatus, errorThrown);
    }
  }, this);

  var customCompleteFunc = options.complete;
  options.complete = goog.bind(function (jqXHR, textStatus) {
    delete this.urlAjaxMap_[mutexKey];

    if (loadingDelay && loadingDelay.isActive()) {
      loadingDelay.stop();
    } else if (goog.isNumber(loadingId)) {
      rebar.util.MessageBox.getInstance().hide(+loadingId);
    }

    if (goog.isFunction(customCompleteFunc)) {
      customCompleteFunc.call(null, jqXHR, textStatus);
    }
  }, this);

  if (this.urlAjaxMap_[mutexKey]) {
    this.urlAjaxMap_[mutexKey].abort();
  }
  if (options.loadingInfo) {
    loadingDelay = new goog.async.Delay(function () {
      var msgIns = rebar.util.MessageBox.getInstance();
      loadingId = msgIns.showLoading(options.loadingInfo);
    }, 500);
    loadingDelay.start();
  }
  this.urlAjaxMap_[mutexKey] = $.ajax(options);
  return this.urlAjaxMap_[mutexKey];
};

/**
 * Abort all requests of this fetcher
 */
rebar.demo.common.JQueryFetcher.prototype.abortAll = function () {
  for (var key in this.urlAjaxMap_) {
    this.urlAjaxMap_[key].abort();
  }
};

/**
 * Show the error of http status 401, mainly because lost login
 * @protected
 */
rebar.demo.common.JQueryFetcher.prototype.warn401Error = function () {
  var msg = 'You have logout, press OK to refresh';
  this.getErrorDialog(true).setup('Auth fail', msg, true, function () {
    window.location.reload();
  }).show();
};

/**
 * Show the server error tip
 * @param {string} responseText
 * @param {number=} optResponseStatus
 * @protected
 */
rebar.demo.common.JQueryFetcher.prototype.warn5XXError =
    function (responseText, optResponseStatus) {
  var m = 'Web server internal error';
  this.getErrorDialog(true).setup('Error', m, false).show();
};

/**
 * Get the dialog to show error info
 * @param {boolean=} optReset Wheter to reset the instance.
 * @return {rebar.Prompt}
 * @protected
 */
rebar.demo.common.JQueryFetcher.prototype.getErrorDialog = function (optReset) {
  if (optReset && rebar.demo.common.JQueryFetcher.errorPrompt_) {
    rebar.demo.common.JQueryFetcher.errorPrompt_.dispose();
    rebar.demo.common.JQueryFetcher.errorPrompt_ = null;
  }
  if (!rebar.demo.common.JQueryFetcher.errorPrompt_) {
    rebar.demo.common.JQueryFetcher.errorPrompt_ = this.buildErrorDialog();
  }
  return rebar.demo.common.JQueryFetcher.errorPrompt_;
};

/**
 * Generate a new dialog instance
 * @return {rebar.Prompt}
 * @protected
 */
rebar.demo.common.JQueryFetcher.prototype.buildErrorDialog = function () {
  return new rebar.prompt.ClosurePrompt();
};

/**
 * @type {rebar.Prompt}
 * @private
 */
rebar.demo.common.JQueryFetcher.errorPrompt_ = null;

/**
 * @extends {jQuery.ajaxSettings}
 */
rebar.demo.common.JQueryFetcherSettings = {};

/**
 * A queue name can be specified, to cancel the running request with same name
 * @type {string}
 */
rebar.demo.common.JQueryFetcherSettings.mutexQueue = '';

/**
 * @type {string}
 */
rebar.demo.common.JQueryFetcherSettings.loadingInfo = '';

