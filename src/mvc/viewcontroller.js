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
 * @fileoverview The controller owing a view.
 * @author copperybean.zhang
 */
goog.provide('rebar.mvc.ViewController');

goog.require('rebar.mvc.Stateful');
goog.require('rebar.mvc.StateModel');
goog.require('rebar.mvc.Controller');
goog.require('rebar.mvc.View');

/**
 * A special controller managing view
 * @param {rebar.mvc.View=} view The controller's view
 * @constructor
 * @extends {rebar.mvc.Controller}
 * @implements {rebar.mvc.Stateful}
 */
rebar.mvc.ViewController = function (view) {
  rebar.mvc.Controller.call(this);

  /**
   * @type {rebar.mvc.View}
   * @private
   */
  this.view_ = view || new rebar.mvc.View();
};
goog.inherits(rebar.mvc.ViewController, rebar.mvc.Controller);

/**
 * Get the managing view
 * @return {rebar.mvc.View}
 * @protected
 */
rebar.mvc.ViewController.prototype.getView = function () {
  return this.view_;
};

/**
 * @override
 */
rebar.mvc.ViewController.prototype.setState = function (state) {
  this.view_.setState(state);
};

/**
 * @override
 */
rebar.mvc.ViewController.prototype.disposeInternal = function () {
  this.view_.dispose();
  this.view_ = null;
  rebar.mvc.ViewController.superClass_.disposeInternal.call(this);
};

