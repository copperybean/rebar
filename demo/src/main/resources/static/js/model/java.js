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
 * @fileoverview The auto generated model classes from java do not
 * require theire fields' class, in order to avoid circulation requirement.
 * So we'd better require all these model classes here
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.model.java');

goog.require('rebar.demo.common.JQueryFetcher');
goog.require('rebar.demo.model.JobInstance');
goog.require('rebar.demo.model.java.RestResponse');
goog.require('rebar.demo.model.java.schedule.HiveJob');
goog.require('rebar.demo.model.java.schedule.JobInstance');
goog.require('rebar.util.MessageBox');

/**
 * create rest response instance from json object
 * @param {Object} jsonObj The json object
 * @param {Function=} optItemCls The class for data list element.
 * @return {rebar.demo.model.java.RestResponse}
 */
rebar.demo.model.java.restResponseFromJson = function (jsonObj, optItemCls) {
  var ret = new rebar.demo.model.java.RestResponse();
  ret.initWithJson(jsonObj);
  if (optItemCls) {
    ret.dataList = rebar.mvc.Model.initList(ret.dataList, optItemCls);
  }
  return ret;
};

/**
 * Fetch rest data with get method
 * @param {string} url The get url
 * @param {function(Array)} sucFun The function called when sucessed,
 *    parameter is the list of rest response
 * @param {Function=} optCls The data class of the list item in rest response
 * @param {string=} optFailTip The tip shown when failed
 */
rebar.demo.model.java.getRestData = function (url, sucFun, optCls, optFailTip) {
  (new rebar.demo.common.JQueryFetcher()).ajax({
    loadingInfo: 'fetching data...',
    url: url
  }).done(function (jsonObj) {
    var response = rebar.demo.model.java.restResponseFromJson(jsonObj, optCls);
    if (rebar.demo.model.java.RestResponse.Code.SUCCESSFUL == response.code) {
      sucFun.call(null, response.dataList);
      return;
    }
    var msg = (optFailTip || 'fetch data failed').trim();
    if (response.message) {
      msg += (msg.trim().endsWith('.') ? ' ' : '. ') + response.message;
    }
    rebar.util.MessageBox.getInstance().showTip(msg);
  });
};
