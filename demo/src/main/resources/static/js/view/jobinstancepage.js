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
 * @fileoverview the job instance page
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.view.JobInstancePage');

goog.require('rebar.demo.template.JobInstancePage');
goog.require('rebar.demo.view.JobInsLog');
goog.require('rebar.mvc.View');

/**
 * The job instance page
 * @constructor
 * @extends {rebar.mvc.View}
 */
rebar.demo.view.JobInstancePage = function () {
  rebar.mvc.View.call(this);

  /**
   * @type {rebar.demo.view.JobInsLog}
   * @private
   */
  this.instanceLog_ = new rebar.demo.view.JobInsLog();
};
goog.inherits(rebar.demo.view.JobInstancePage, rebar.mvc.View);

/**
 * @override
 */
rebar.demo.view.JobInstancePage.prototype.init = function () {
  rebar.demo.view.JobInstancePage.superClass_.init.call(this);

  this.addSubView(this.instanceLog_);
};

/**
 * @override
 */
rebar.demo.view.JobInstancePage.prototype.updateStateInDocument = function (s) {
  var key = rebar.demo.common.state.Keys.JOB_INSTANCE_ID;
  if (!s || !s.hasKey(key)) {
    return;
  }
  var jobInstanceId = +s.getValue(key);

  this.instanceLog_.setInstanceId(jobInstanceId);
  var url = rebar.demo.common.uri.getJobInsList(jobInstanceId);
  rebar.demo.model.java.getRestData(url, goog.bind(function (insList) {
    var html = rebar.demo.template.JobInstancePage.jobInstance(insList[0]);
    this.getDomById('insinfo').innerHTML = html.getContent();
  }, this), rebar.demo.model.JobInstance, 'get job instance failed');
};

/**
 * @override
 */
rebar.demo.view.JobInstancePage.prototype.buildDom = function () {
  return rebar.demo.template.JobInstancePage.pageHtml({
    viewId: this.getId()
  });
};
