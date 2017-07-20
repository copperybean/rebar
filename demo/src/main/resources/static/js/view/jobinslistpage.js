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
goog.provide('rebar.demo.view.JobInsListPage');

goog.require('rebar.demo.common.JQueryFetcher');
goog.require('rebar.demo.common.uri');
goog.require('rebar.demo.model.java');
goog.require('rebar.demo.template.JobInsListPage');
goog.require('rebar.mvc.View');
goog.require('rebar.util.dom');

goog.require('goog.dom');
goog.require('goog.i18n.DateTimeFormat');

/**
 * The job instances page
 *
 * @constructor
 * @extends {rebar.mvc.View}
 */
rebar.demo.view.JobInsListPage = function () {
  rebar.mvc.View.call(this);

  /**
   * @type {string}
   * @private
   */
  this.jobName_ = '';
};
goog.inherits(rebar.demo.view.JobInsListPage, rebar.mvc.View);

/**
 * @override
 */
rebar.demo.view.JobInsListPage.prototype.enterDocument = function () {
  rebar.demo.view.JobInsListPage.superClass_.enterDocument.call(this);

  this.getHandler().listen(
      this.getElement(), goog.events.EventType.CLICK, this.onClick_);
};

/**
 * @override
 */
rebar.demo.view.JobInsListPage.prototype.updateStateInDocument = function (s) {
  var key = rebar.demo.common.state.Keys.JOB_NAME;
  this.jobName_ = s ? s.getValue(key) || '' : '';

  if (this.jobName_) {
    var url = rebar.demo.common.uri.getJobInfo(this.jobName_);
    rebar.demo.model.java.getRestData(url, goog.bind(function (jobInfos) {
      this.showJobInstances_(jobInfos[0].instances, jobInfos[0]);
    }, this), rebar.demo.model.java.schedule.HiveJob, 'get job info failed');
  } else {
    var url = rebar.demo.common.uri.getJobInsList(undefined, true);
    rebar.demo.model.java.getRestData(url, goog.bind(function (instances) {
      this.showJobInstances_(instances);
    }, this), rebar.demo.model.JobInstance, 'get job instances failed');
  }
};

/**
 * To show the job instances
 * @param {Array.<rebar.demo.model.JobInstance>} instances The instances
 * @param {rebar.demo.model.java.schedule.HiveJob=} optJob The job info
 *    if these instances belong a same job
 * @private
 */
rebar.demo.view.JobInsListPage.prototype.showJobInstances_ = function (
    instances, optJob) {
  goog.dom.removeChildren(this.getElement());
  if (optJob) {
    var jobHtml = rebar.demo.template.JobInsListPage.jobInfo(optJob);
    this.getElement().appendChild(rebar.util.dom.htmlToElement(jobHtml));
  }
  var instancesHtml = rebar.demo.template.JobInsListPage.jobInstances({
    instances: instances
  });
  this.getElement().appendChild(rebar.util.dom.htmlToElement(instancesHtml));
};

/**
 * The click handler
 * @param {goog.events.BrowserEvent} e The event.
 * @private
 */
rebar.demo.view.JobInsListPage.prototype.onClick_ = function (e) {
  if (!(e.target instanceof Element) || 
      !goog.dom.classlist.contains(e.target, 'btn-info')) {
    return;
  }
  var elTr = goog.dom.getAncestorByTagNameAndClass(
      e.target, goog.dom.TagName.TR);
  var state = rebar.demo.common.state.jobInstance(
      +elTr.getAttribute('jobinsid'), this.jobName_);
  rebar.demo.Main.getInstance().setState(state);
};
