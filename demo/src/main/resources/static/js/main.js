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
 * @fileoverview The entrance of whole demo
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.Main');

goog.require('rebar.demo.common.state');
goog.require('rebar.demo.controller.Index');
goog.require('rebar.demo.view.IndexPage');
goog.require('rebar.css.closurepromptcss');
goog.require('rebar.css.messageboxcss');
goog.require('rebar.prompt.ClosurePrompt');
goog.require('rebar.util.StatefulUri');
goog.require('rebar.util.cookie');

goog.require('goog.Uri');
goog.require('goog.userAgent.product');

/**
 * The main entrence of rebar demo
 * @constructor
 */
rebar.demo.Main = function () {

  /**
   * @type {rebar.util.StatefulUri}
   * @private
   */
  this.statefulUri_ = null;
};
goog.addSingletonGetter(rebar.demo.Main);

/**
 * Set the whole demo's state
 * @param {rebar.mvc.StateModel} state The state
 */
rebar.demo.Main.prototype.setState = function (state) {
  this.statefulUri_.updateState(state);
};

/**
 * Get current state
 * @return {rebar.mvc.StateModel}
 */
rebar.demo.Main.prototype.getState = function () {
  return this.statefulUri_.getState();
};

/**
 * Begin to serve demo to the user
 * @param {Element=} optElement The element to render page.
 * @param {Object=} optOptions The default options
 */
rebar.demo.Main.prototype.serve = function (optElement, optOptions) {
  if (this.statefulUri_) {
    throw 'Can not serve muliti times';
  }
  if (!this.checkBrowser_(optElement)) {
    return;
  }

  var indexController = this.initIndexController_(optElement);
  this.statefulUri_ = new rebar.util.StatefulUri(indexController);
  this.statefulUri_.updateState();
  indexController.serve();
};

/**
 * Initialize the index controller
 * @param {Element=} optElement The element container
 * @return {rebar.demo.controller.Index}
 * @private
 */
rebar.demo.Main.prototype.initIndexController_ = function (optElement) {
  var indexPage = new rebar.demo.view.IndexPage();
  indexPage.render(optElement);
  rebar.util.MessageBox.getInstance().setReferView(indexPage);
  return new rebar.demo.controller.Index(indexPage);
};

/**
 * Check if the browser is not supported
 * @param {Element=} optElement The element on which to show error info
 * @return {boolean}
 * @private
 */
rebar.demo.Main.prototype.checkBrowser_ = function (optElement) {
  var el = optElement || document.body;
  var browserSupported = goog.userAgent.product.FIREFOX ||
      goog.userAgent.product.CHROME ||
      goog.userAgent.product.SAFARI ||
      (goog.userAgent.product.IE &&
          goog.string.compareVersions(goog.userAgent.VERSION, '11') >= 0);
  if (goog.history.Html5History.isSupported() && browserSupported) {
    return true;
  }
  el.innerHTML = 'Your browser may not supported. '
    + 'The latest version of chrome is suggested: '
    + '<a href="https://www.google.com/chrome/browser/features.html"'
    + ' target=_blank>download</a>';
  return false;
};

(function () {
  var serve = function (optElement, optOptions) {
    var ins = rebar.demo.Main.getInstance();
    ins.serve(optElement, optOptions);
  };
  var rebarDemo = {};
  goog.exportSymbol('__rebarDemo', rebarDemo);
  goog.exportProperty(rebarDemo, 'serve', serve);
})();

