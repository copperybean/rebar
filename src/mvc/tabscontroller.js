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
 * @fileoverview Defines the tabs controller
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.mvc.TabsController');

goog.require('rebar.mvc.StateModel');
goog.require('rebar.mvc.Stateful');
goog.require('rebar.mvc.View');
goog.require('rebar.mvc.ViewController');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.object');

/**
 * General speaking, this class is just owing a batch of tabs, and support
 * switching between tabs. Indeed this class is designed to abstract the normal
 * page structure for web products, like in facebook, you can switch between
 * profile, home and find friends pages, each page can be implemented by a
 * tab and processing logics of itsself, the whole tabs controller is
 * responsible for the switching logic and loading from and saving to the uri
 * of the active tab.
 * @param {rebar.mvc.View=} optTabsView A tabs controller can owing a batch
 *    of tabs logically, and also can have a small area showing a view of
 *    itself, like the navigation bar at top of page in facebook.
 * @constructor
 * @extends {rebar.mvc.ViewController}
 */
rebar.mvc.TabsController = function (optTabsView) {
  rebar.mvc.ViewController.call(this, optTabsView);

  /**
   * @type {Object.<string, rebar.mvc.ViewController>}
   * @private
   */
  this.tabsMap_ = {};

  /**
   * @type {number}
   * @private
   */
  this.nextIndexName_ = 0;

  /**
   * @type {string}
   * @private
   */
  this.activeTabName_ = '';

  /**
   * @type {rebar.mvc.TabsController.Config}
   * @private
   */
  this.config_ = new rebar.mvc.TabsController.Config();
};
goog.inherits(rebar.mvc.TabsController, rebar.mvc.ViewController);

/**
 * set the config
 * @param {rebar.mvc.TabsController.Config} config the config
 */
rebar.mvc.TabsController.prototype.setConfig = function (config) {
  this.config_ = config || this.config_;
};

/**
 * @override
 */
rebar.mvc.TabsController.prototype.setState = function (state) {
  rebar.mvc.TabsController.superClass_.setState.call(this, state);

  if (!this.getStateKey()) {
    // this controller has not record tab info in state
    return;
  }
  var tabName = state.getValue(this.getStateKey());
  tabName = this.initTabByName(tabName || this.getDefaultTabName(), state);
  this.getTab(tabName).setState(state);
  if (this.getActiveTabName() !== tabName) {
    this.changeToTab(tabName);
  }
};

/**
 * Get the current active tab name
 * @return {string}
 */
rebar.mvc.TabsController.prototype.getActiveTabName = function () {
  return this.activeTabName_;
};

/**
 * Append a new tab
 * @param {rebar.mvc.ViewController} viewController The view controller object.
 * @param {string=} optName The name of this tab, if not provided, a default
 *    name will be generated, which is a number counted from 0.
 * @return {string} The result tab name
 */
rebar.mvc.TabsController.prototype.appendTab = function (
    viewController, optName) {
  var tabName = optName || this.nextVacantTabName();
  if (this.tabsMap_[tabName]) {
    return '';
  }
  this.tabsMap_[tabName] = viewController;
  viewController.setParentEventTarget(this);
  return tabName;
};

/**
 * Change active tab
 * @param {string} tabName The new active tab name
 */
rebar.mvc.TabsController.prototype.changeToTab = function (tabName) {
  if (tabName == this.activeTabName_) {
    if (this.tabsMap_[tabName]) {
      this.tabsMap_[tabName].reloadController();
    }
    return;
  }
  if (this.tabsMap_[this.activeTabName_]) {
    this.tabsMap_[this.activeTabName_].getView().remove();
    if (this.isControllerLoaded()) {
      this.tabsMap_[this.activeTabName_].unloadController();
    }
  }
  this.activeTabName_ = tabName;
  if (this.tabsMap_[this.activeTabName_]) {
    this.getView().addSubView(this.tabsMap_[this.activeTabName_].getView());
    if (this.isControllerLoaded()) {
      this.tabsMap_[this.activeTabName_].loadController();
    }
  }
  this.clearTransientTabs();
};

/**
 * Clear the tabs whose name is marked as transient, all inactive transient
 * tabs will be removed.
 */
rebar.mvc.TabsController.prototype.clearTransientTabs = function () {
  var names = this.config_.transientTabs || goog.object.getKeys(this.tabsMap_);
  goog.array.forEach(names, function (tabName) {
    this.removeInactiveTab(tabName);
  }, this);
};

/**
 * @override
 */
rebar.mvc.TabsController.prototype.loadController = function () {
  rebar.mvc.TabsController.superClass_.loadController.call(this);

  if (this.activeTabName_) {
    this.tabsMap_[this.activeTabName_].loadController();
    return;
  }
  var tabName = this.initTabByName(
      this.getDefaultTabName(), new rebar.mvc.StateModel());
  this.changeToTab(tabName);
};

/**
 * @override
 */
rebar.mvc.TabsController.prototype.unloadController = function () {
  rebar.mvc.TabsController.superClass_.unloadController.call(this);
  if (this.activeTabName_) {
    this.tabsMap_[this.activeTabName_].unloadController();
  }
};

/**
 * To remove a tab
 * @param {string} tabName The tab name
 * @return {rebar.mvc.ViewController} Return the tab to be removed.
 * @protected
 */
rebar.mvc.TabsController.prototype.removeInactiveTab = function (tabName) {
  if (!this.tabsMap_[tabName] || tabName === this.activeTabName_) {
    return null;
  }
  var ret = this.tabsMap_[tabName];
  this.tabsMap_[tabName].dispose();
  delete this.tabsMap_[tabName];
  return ret;
};

/**
 * State model indeed is a key-value map. So if we want to record the current
 * active tab name in the state model, we should have a key of this value. This
 * method provide a chance to subclass to record the current active tab name
 * in the state model.
 * @return {string} If empty value returned, then current active tab name will
 *    not be recorded in state model.
 * @protected
 */
rebar.mvc.TabsController.prototype.getStateKey = function () {
  return this.config_.stateKeyName || '';
};

/**
 * In some situation, tab name is not provided, such as loading a controller
 * first time, or value of state model corresponding to the state key is empty.
 * Then this tab name is used.
 * @return {string}
 * @protected
 */
rebar.mvc.TabsController.prototype.getDefaultTabName = function () {
  return this.config_.defaultTabName || '';
};

/**
 * Initiazlie the tab with specified name
 * @param {string} tabName The name of the tab
 * @param {rebar.mvc.StateModel} state The intialize state of the tab
 * @return {string} The result tab name initialized
 * @protected
 */
rebar.mvc.TabsController.prototype.initTabByName = function (tabName, state) {
  if (this.tabsMap_[tabName]) {
    return tabName;
  }
  var tab = this.createTab(tabName, state);
  if (!tab) {
    tab = new rebar.mvc.ViewController();
  }
  if (tab instanceof rebar.mvc.View) {
    tab = new rebar.mvc.ViewController(tab);
  }
  var appendTabName = this.appendTab(tab, tabName);
  goog.asserts.assert(!!appendTabName);
  goog.asserts.assert(!tabName || tabName == appendTabName);
  return appendTabName;
};

/**
 * Create the tab with specified name
 * @param {string} tabName The tab name
 * @param {rebar.mvc.StateModel} state The tab's state
 * @return {rebar.mvc.View|rebar.mvc.ViewController}
 * @protected
 */
rebar.mvc.TabsController.prototype.createTab = function (tabName, state) {
  return null;
};

/**
 * Get the tab with its name
 * @param {string} tabName The name of the tab
 * @return {rebar.mvc.ViewController}
 * @protected
 */
rebar.mvc.TabsController.prototype.getTab = function (tabName) {
  return this.tabsMap_[tabName];
};

/**
 * Get the valid index tab name
 * @return {string}
 * @protected
 */
rebar.mvc.TabsController.prototype.nextVacantTabName = function () {
  do {
    var name = this.nextIndexName_ + '';
    if (!this.tabsMap_[name]) {
      return name;
    }
    ++this.nextIndexName_;
  } while (true);
};

/**
 * The config
 * @param {string=} optStateKeyName The state key's name
 * @param {string=} optDefaultTabName the default tab name
 * @param {Array.<string>=} optTransientTabs The names of tab that
 *    will be destroyed when switched out, null means all tabs
 * @constructor
 */
rebar.mvc.TabsController.Config = function (
    optStateKeyName, optDefaultTabName, optTransientTabs) {
  /**
   * @type {string}
   */
  this.stateKeyName = optStateKeyName || '';

  /**
   * @type {string}
   */
  this.defaultTabName = optDefaultTabName || '';

  /**
   * @type {Array.<string>}
   */
  this.transientTabs = goog.isDef(optTransientTabs) ? optTransientTabs : [];
};

