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
 * @fileoverview The job instances page
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.view.JobListPage');

goog.require('rebar.demo.common.JQueryFetcher');
goog.require('rebar.demo.common.uri');
goog.require('rebar.demo.model.java');
goog.require('rebar.demo.template.JobListPage');
goog.require('rebar.mvc.View');

/**
 * The job instances page
 *
 * @constructor
 * @extends {rebar.mvc.View}
 */
rebar.demo.view.JobListPage = function () {
  rebar.mvc.View.call(this);
};
goog.inherits(rebar.demo.view.JobListPage, rebar.mvc.View);

/**
 * @override
 */
rebar.demo.view.JobListPage.prototype.enterDocument = function () {
  rebar.demo.view.JobListPage.superClass_.enterDocument.call(this);

  var url = rebar.demo.common.uri.getJobList();
  rebar.demo.model.java.getRestData(url, goog.bind(function (jobList) {
    this.getElement().innerHTML = rebar.demo.template.JobListPage.jobs({
      jobList: jobList
    }).getContent();
  }, this), rebar.demo.model.java.schedule.HiveJob, 'get jobs failed');
  this.getHandler().listen(
      this.getElement(), goog.events.EventType.CLICK, this.onClick_);
};

/**
 * The click handler
 * @param {goog.events.BrowserEvent} e The event.
 * @private
 */
rebar.demo.view.JobListPage.prototype.onClick_ = function (e) {
  if (!(e.target instanceof Element)) {
    return;
  }
  var jobName = goog.dom.getAncestorByTagNameAndClass(
      e.target, goog.dom.TagName.TR).getAttribute('jobname');
  if (goog.dom.classlist.contains(e.target, 'btn-info')) {
    rebar.demo.Main.getInstance().setState(
        rebar.demo.common.state.jobInsList('', jobName));
  } else if (goog.dom.classlist.contains(e.target, 'btn-primary')) {
    rebar.demo.Main.getInstance().setState(
        rebar.demo.common.state.editJob(jobName));
  }
};

