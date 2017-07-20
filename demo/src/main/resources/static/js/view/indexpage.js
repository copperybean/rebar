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
 * @fileoverview The index page
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.view.IndexPage');

goog.require('rebar.demo.common.commoncss');
goog.require('rebar.demo.template.IndexPage');
goog.require('rebar.mvc.View');

/**
 * @constructor
 * @extends {rebar.mvc.View}
 */
rebar.demo.view.IndexPage = function () {
  rebar.mvc.View.call(this);

  /**
   * @type {Object.<string, rebar.mvc.StateModel>}
   * @private
   */
  this.tabLastState_ = {};
};
goog.inherits(rebar.demo.view.IndexPage, rebar.mvc.View);

/**
 * @override
 */
rebar.demo.view.IndexPage.prototype.enterDocument = function () {
  rebar.demo.view.IndexPage.superClass_.enterDocument.call(this);

  this.getHandler().listen(this.getDomById('navbar'),
      goog.events.EventType.CLICK, this.onClickNavbar_);
};

/**
 * @override
 */
rebar.demo.view.IndexPage.prototype.setState = function (state) {
  rebar.demo.view.IndexPage.superClass_.setState.call(this, state);

  var elActive = this.querySelector('.active', 'navbar');
  var stateTabName = state.getValue(
      rebar.demo.common.state.Keys.INDEX_TAB);
  var elStateTab = this.getDomByAttr('tabname', stateTabName, 'navbar');
  if (elStateTab && elActive.getAttribute('tabname') != stateTabName) {
    goog.dom.classlist.remove(elActive, 'active');
    goog.dom.classlist.add(elStateTab, 'active');
  }
};

/**
 * override
 */
rebar.demo.view.IndexPage.prototype.getContentElement = function () {
  return this.getDomById('container');
};

/**
 * @override
 */
rebar.demo.view.IndexPage.prototype.buildDom = function () {
  return rebar.demo.template.IndexPage.pageHtml({
    viewId: this.getId()
  });
};

/**
 * The navbar click handler
 * @param {goog.events.BrowserEvent} e The event.
 * @private
 */
rebar.demo.view.IndexPage.prototype.onClickNavbar_ = function (e) {
  var elTab = rebar.util.dom.getAncestorWithAttr(
      e.target, 'tabname', e.currentTarget);
  if (!elTab || !(elTab instanceof Element)) {
    return;
  }
  var rebarMain = rebar.demo.Main.getInstance();
  var elActive = this.querySelector('.active', 'navbar');
  var activeTabName = elActive.getAttribute('tabname');
  var tabName = elTab.getAttribute('tabname');
  var tabState = rebar.demo.common.state.indexPage(tabName);
  if (activeTabName != tabName) {
    this.tabLastState_[activeTabName] = rebarMain.getState();
    tabState = this.tabLastState_[tabName] || tabState;
  }
  rebarMain.setState(tabState);
};

/**
 * @enum {string}
 */
rebar.demo.view.IndexPage.TabName = {
  RUNNING_JOBS: 'r',
  JOB_LIST: 'l',
  CREATE_JOB: 'c'
};
