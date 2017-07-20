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
 * @fileoverview the edit job page
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.view.EditJobPage');

goog.require('rebar.demo.common.BootstrapInput');
goog.require('rebar.demo.template.EditJobPage');
goog.require('rebar.view.Form');

/**
 * The edit job page
 * @param {string=} optJobName If editting job, this parameter should be
 *    provided
 * @constructor
 * @extends {rebar.view.Form}
 */
rebar.demo.view.EditJobPage = function (optJobName) {
  rebar.view.Form.call(this);

  /**
   * @type {string}
   * @private
   */
  this.jobName_ = optJobName || '';
};
goog.inherits(rebar.demo.view.EditJobPage, rebar.view.Form);

/**
 * @override
 */
rebar.demo.view.EditJobPage.prototype.enterDocument = function () {
  rebar.demo.view.EditJobPage.superClass_.enterDocument.call(this);
  if (!this.jobName_) {
    return;
  }

  var url = rebar.demo.common.uri.getJobList(this.jobName_)
  rebar.demo.model.java.getRestData(url, goog.bind(function (jobList) {
    this.loadFromObject(jobList[0].toJson());
  }, this), rebar.demo.model.java.schedule.HiveJob, 'get job failed');
};

/**
 * @override
 */
rebar.demo.view.EditJobPage.prototype.submitForm = function () {
  (new rebar.demo.common.JQueryFetcher()).ajax({
    url: rebar.demo.common.uri.saveHiveJob(this.jobName_),
    type: 'POST',
    data: goog.json.serialize(this.saveToObject()),
    contentType: 'application/json',
    loadingInfo: 'saving...',
  }).done(goog.bind(function (jsonObj) {
    var response = new rebar.demo.model.java.RestResponse();
    response.initWithJson(jsonObj);
    if (rebar.demo.model.java.RestResponse.Code.SUCCESSFUL == response.code) {
      rebar.demo.Main.getInstance().setState(rebar.demo.common.state.jobList());
      this.showTip('success');
      this.reset();
    } else {
      this.showTip('save failed: ' + response.message);
    }
  }, this));
};

/**
 * @override
 */
rebar.demo.view.EditJobPage.prototype.inputFromElement = function (el) {
  var input = new rebar.demo.common.BootstrapInput();
  this.decorateSubView(input, el);
  return input;
};

/**
 * @override
 */
rebar.demo.view.EditJobPage.prototype.buildDom = function () {
  return rebar.demo.template.EditJobPage.pageHtml({
    editJobName: this.jobName_
  });
};

