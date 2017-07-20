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
 * @fileoverview A model class to abstract the whole page's state
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.mvc.StateModel');

goog.require('rebar.mvc.Model');

/**
 * This class mainly stored the key-value format data, to represent any page
 * state
 * TODO refactor all uri related methods
 * @param {Object.<string, string>=} optStateMap The initial data
 * @param {string=} optTitle The state can have a title
 * @constructor
 * @extends {rebar.mvc.Model}
 */
rebar.mvc.StateModel = function (optStateMap, optTitle) {
  rebar.mvc.Model.call(this);

  /**
   * @type {Object.<string, string>}
   * @private
   */
  this.stateMap_ = optStateMap || {};

  /**
   * @type {string}
   * @private
   */
  this.title_ = optTitle || '';
};
goog.inherits(rebar.mvc.StateModel, rebar.mvc.Model);

/**
 * Create state model from url's query
 * @param {string} url The url
 * @return {rebar.mvc.StateModel}
 */
rebar.mvc.StateModel.createFromUrl = function (url) {
  var query = (new goog.Uri(url)).getQueryData();
  var obj = {};
  var keys = query.getKeys();
  goog.array.forEach(keys, function (k) {
    obj[k] = query.get(k);
  });
  return new rebar.mvc.StateModel(obj);
};

/**
 * 可以在一开始就调用该方法进行设置
 * @param {function (rebar.mvc.StateModel):string} callback
 */
rebar.mvc.StateModel.setToUrlCallback = function (callback) {
  rebar.mvc.StateModel.toUrlCallback_ = callback;
};

/**
 * Get the title of the state
 * @return {string}
 */
rebar.mvc.StateModel.prototype.getTitle = function () {
  return this.title_;
};

/**
 * Set the title of the state
 * @param {string} title The title.
 */
rebar.mvc.StateModel.prototype.setTitle = function (title) {
  this.title_ = title;
};

/**
 * Whether the key exists in state
 * @param {string} key
 * @return {boolean}
 */
rebar.mvc.StateModel.prototype.hasKey = function (key) {
  return goog.isDef(this.stateMap_[key]);
};

/**
 * Get the value of specified key
 * @param {string} key The key name
 * @param {string=} optDefaultVal
 * @return {string|undefined}
 */
rebar.mvc.StateModel.prototype.getValue = function (key, optDefaultVal) {
  return this.stateMap_[key] || optDefaultVal || undefined;
};

/**
 * Set the value of specified key
 * @param {string} key The name of the key
 * @param {string} val The value
 */
rebar.mvc.StateModel.prototype.setValue = function (key, val) {
  this.stateMap_[key] = val;
};

/**
 * Remove the key in state
 * @param {string} key The key name
 */
rebar.mvc.StateModel.prototype.removeKey = function (key) {
  delete this.stateMap_[key];
};

/**
 * Merge another state
 * @param {rebar.mvc.StateModel} state The state to be merged
 */
rebar.mvc.StateModel.prototype.mergeState = function (state) {
  goog.object.extend(this.stateMap_, state.stateMap_);
};

/**
 * Whether current state contains another state
 * @param {rebar.mvc.StateModel} state The state to be checked
 * @return {boolean}
 */
rebar.mvc.StateModel.prototype.containsState = function (state) {
  for (var key in state.stateMap_) {
    if (this.stateMap_[key] !== state.stateMap_[key]) {
      return false;
    }
  }
  return true;
};

/**
 * Get the state data as a map object
 * @return {Object.<string, string>}
 */
rebar.mvc.StateModel.prototype.getStateMap = function () {
  return this.stateMap_;
};

/**
 * @override
 */
rebar.mvc.StateModel.prototype.toJson = function () {
  return {
    'map': this.stateMap_,
    'title': this.title_
  };
};

/**
 * @override
 */
rebar.mvc.StateModel.prototype.initWithJson = function (obj) {
  if (!obj) {
    return false;
  }
  this.stateMap_ = {};
  goog.object.extend(this.stateMap_, obj['map'] || {});
  this.title_ = obj['title'] || this.title_;
  return true;
};

/**
 * @return {string}
 */
rebar.mvc.StateModel.prototype.toUrl = function () {
  if (rebar.mvc.StateModel.toUrlCallback_) {
    return rebar.mvc.StateModel.toUrlCallback_.call(undefined, this);
  }
  var ret = new goog.Uri();
  goog.object.forEach(this.stateMap_, function (val, k) {
    ret.setParameterValue(k, val);
  });
  return ret.toString();
};

/**
 * @type {function (rebar.mvc.StateModel):string}
 */
rebar.mvc.StateModel.toUrlCallback_;

