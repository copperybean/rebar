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
 * @fileoverview A util to store state info in uri
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.util.StatefulUri');

goog.require('rebar.mvc.StateModel');

goog.require('goog.Uri.QueryData');
goog.require('goog.history.Html5History');
goog.require('goog.history.Html5History.TokenTransformer');

/**
 * The stateful data is a key-value map, which can be stored
 * in uri. The default implementation is to store the map in
 * query of uri, the sub class can overwrite this behaivor.
 * @param {rebar.mvc.Stateful} statefulObj the stateful obj
 * @param {Window=} optWindow The window object.
 * @constructor
 */
rebar.util.StatefulUri = function (statefulObj, optWindow) {

  /**
   * @type {goog.history.Html5History}
   * @private
   */
  this.html5History_ = this.getHtml5History(optWindow);

  /**
   * @type {rebar.mvc.Stateful}
   * @private
   */
  this.statefulObj_ = statefulObj;

  /**
   * @type {Window}
   * @private
   */
  this.window_ = optWindow || window;
};

/**
 * Store the stateful state in uri
 * @param {rebar.mvc.StateModel=} optStateModel The state to update or
 *    update to the state in uri
 */
rebar.util.StatefulUri.prototype.updateState = function (optStateModel) {
  if (optStateModel) {
    this.statefulObj_.setState(optStateModel);
    var queryMap = optStateModel.getStateMap() || {};
    var query = goog.Uri.QueryData.createFromMap(queryMap).toString();
    this.html5History_.setToken(query, optStateModel.getTitle());
  } else {
    this.statefulObj_.setState(this.getState());
  }
};

/**
 * Get current state in uri
 * @return {rebar.mvc.StateModel}
 */
rebar.util.StatefulUri.prototype.getState = function () {
  var modelMap = {};
  var tokenQuery = new goog.Uri.QueryData(this.html5History_.getToken());
  goog.array.forEach(tokenQuery.getKeys(), function (key) {
    modelMap[key] = tokenQuery.get(key);
  });
  return new rebar.mvc.StateModel(modelMap, this.window_.document.title);
};

/**
 * The navigate event listener.
 * @param {goog.history.Event} e The history event.
 */
rebar.util.StatefulUri.prototype.onNavigate_ = function (e) {
  e.preventDefault();
  if (!e.isNavigation) {
    return;
  }
  this.updateState();
};

/**
 * Get the html5 history instance
 * @param {Window=} optWindow The window object.
 * @protected
 */
rebar.util.StatefulUri.prototype.getHtml5History = function (optWindow) {
  var ret = new goog.history.Html5History(
      optWindow, new rebar.util.StatefulUri.TokenTransformer())
  ret.setUseFragment(false);
  goog.events.listen(ret, goog.history.EventType.NAVIGATE,
      goog.bind(this.onNavigate_, this));
  ret.setEnabled(true);
  return ret;
};

/**
 * token transformer
 * @constructor
 * @implements {goog.history.Html5History.TokenTransformer}
 */
rebar.util.StatefulUri.TokenTransformer = function () {
};

/**
 * @override
 */
rebar.util.StatefulUri.TokenTransformer.prototype.retrieveToken =
    function (pathPrefix, location) {
  return location.search.replace(/^\?+/, '');
};

/**
 * @override
 */
rebar.util.StatefulUri.TokenTransformer.prototype.createUrl =
    function (token, pathPrefix, location) {
  var callback = function (match, p1, p2, p3) {
    return (token ? '?' + token : '') + (p3 ? p2 : '');
  };
  return location.href.replace(/(\?.*?)*(#(.*)|$)/, callback);
};
