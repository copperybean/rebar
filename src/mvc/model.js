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
 * @fileoverview Define the base class for model
 * @author copperybean.zhang
 */
goog.provide('rebar.mvc.Model');

goog.require('goog.json');

/**
 * An important feature supported by this class, is methods toJson and
 * initWithJson. Using these methods, you can serialize and desrialize a
 * model, this feature is useless for normal js programming, but very important
 * for the js programming with closure compiler advance level(
 * https://developers.google.com/closure/compiler/docs/api-tutorial3). In this
 * level, the fields name will be changed after compile, you will find it's
 * difficult when sending a model to server or processing the json data sent
 * from server. Now you can use toJson method to serialize these changed feild
 * names to normal field names when sending json data to server, and vice versa
 * when receiving json data.
 * @constructor
 */
rebar.mvc.Model = function () {
};

/**
 * Serialize the model instance to a pure json object. You should be careful
 * to the fields which is also a instance of this class(or sub class of this
 * class), the to json method should be called also for these fields.
 * @return {Object}
 */
rebar.mvc.Model.prototype.toJson = function () {
  return {};
};

/**
 * Serialize the model to json format string directly.
 * @return {string}
 */
rebar.mvc.Model.prototype.toJsonString = function () {
  return goog.json.serialize(this.toJson());
};

/**
 * Deserialize a model from json object. Like toJson, you should be careful
 * to the fields which is a instance of this class also. The initWithJson
 * method should be called also for these fields.
 * @param {Object} obj The object used to initialize.
 * @return {boolean} Returning false means initialize failed.
 */
rebar.mvc.Model.prototype.initWithJson = function (obj) {
  // do nothing in base class
  return !!obj;
};

/**
 * Deep clone the model
 * @return {rebar.mvc.Model}
 */
rebar.mvc.Model.prototype.deepClone = function () {
  var model = new this.constructor();
  model.initWithJson(goog.json.parse(this.toJsonString()));
  return model;
};

/**
 * Initialize a list of object derrived from rebar.mvc.Model
 * @param {Array|Object} objList
 * @param {Function=} ctor The constructor
 * @return {Array.<rebar.mvc.Model>}
 */
rebar.mvc.Model.prototype.initList = function (objList, ctor) {
  return rebar.mvc.Model.initList(objList, ctor || this.constructor);
};

/**
 * Serialize a list of model to json array
 * @param {Array.<rebar.mvc.Model>} list The model list
 * @return {Array.<Object>}
 */
rebar.mvc.Model.prototype.listToJson = function (list) {
  return rebar.mvc.Model.listToJson(list);
};

/**
 * Serialize a list of model to json array
 * @param {Array.<rebar.mvc.Model>} list
 * @return {Array.<Object>}
 */
rebar.mvc.Model.listToJson = function (list) {
  var ret = [];
  goog.array.forEach(list || [], function (item) {
    ret.push(item.toJson());
  });
  return ret;
};

/**
 * Initialize a list of object derrived from rebar.mvc.Model
 * @param {Array|Object} objList The object list
 * @param {Function} ctor The constructor of list item.
 * @return {Array.<rebar.mvc.Model>}
 */
rebar.mvc.Model.initList = function (objList, ctor) {
  var ret = [];
  goog.object.forEach(objList || [], function (obj) {
    var info = new ctor();
    info.initWithJson(obj);
    ret.push(info);
  });
  return ret;
};

/**
 * Sometimes, the abstraction of views may leads to some views requesting
 * same url almost sametime. In this situation, we can use this class to
 * optimize the requests to just one, making other same url request to wait
 * this request.
 * @constructor
 */
rebar.mvc.Model.CachedFetcher = function () {

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this.cachedData_ = {};

  /**
   * @type {Object.<string, Array.<Function>>}
   * @private
   */
  this.waitingCallbacks_ = {};
};

/**
 * Remember, if you just caring about requesting same url sametime, maybe some
 * library have implemented, like the ajax function of jquery.
 * @param {function(function(boolean, *))} fetcher The fetcher function.
 *     The function parameter is a callback used to be triggered when data
 *     has been fetched, the boolean parameter is used
 *     to indicate whether succeed
 * @param {string} key The key used to fetch data.
 * @param {function(boolean, *)} callback The callback function used
 * @param {boolean=} optRefresh Whether to refresh if the request is cached.
 */
rebar.mvc.Model.CachedFetcher.prototype.getByKey = function (
    fetcher, key, callback, optRefresh) {
  if (!optRefresh && this.cachedData_.hasOwnProperty(key)) {
    callback.call(null, true, this.cachedData_[key]);
    return;
  }

  if (!this.waitingCallbacks_[key]) {
    this.waitingCallbacks_[key] = [callback];
  } else {
    this.waitingCallbacks_[key].push(callback);
    return;
  }
  fetcher.call(null, goog.bind(function (succeed, data) {
    if (succeed) {
      this.cachedData_[key] = data;
    }
    var funs = this.waitingCallbacks_[key];
    delete this.waitingCallbacks_[key];
    goog.array.forEach(funs, goog.bind(function (f) {
      f.call(null, succeed, this.cachedData_[key]);
    }, this));
  }, this));
};

