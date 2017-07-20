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
 * @fileoverview the job list controller
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.controller.JobList');

goog.require('rebar.demo.controller.JobInsList');
goog.require('rebar.demo.view.EditJobPage');
goog.require('rebar.demo.view.JobListPage');
goog.require('rebar.mvc.TabsController');

/**
 * The job list controller
 * @constructor
 * @extends {rebar.mvc.TabsController}
 */
rebar.demo.controller.JobList = function () {
  rebar.mvc.TabsController.call(this);

  this.setConfig(new rebar.mvc.TabsController.Config(
      rebar.demo.common.state.Keys.JOB_LIST_TAB, // state key
      rebar.demo.controller.JobList.TabName.JOB_LIST_PAGE, // default tab
      [rebar.demo.controller.JobList.TabName.EDIT_JOB] // transient tabs
  ));
};
goog.inherits(rebar.demo.controller.JobList, rebar.mvc.TabsController);

/**
 * @override
 */
rebar.demo.controller.JobList.prototype.createTab = function (tabName, state) {
  switch (tabName) {
    case rebar.demo.controller.JobList.TabName.JOB_LIST_PAGE:
      return new rebar.demo.view.JobListPage();
    case rebar.demo.controller.JobList.TabName.JOB_INS_LIST:
      return new rebar.demo.controller.JobInsList();
    case rebar.demo.controller.JobList.TabName.EDIT_JOB:
      // This is another way of creating a tab.
      // The edit job page does not support update its editing job name from
      // Stateful's setState interface, so we configured this tab as transient
      // in constructor, then the edit job tab instance will be destroyed
      // each time it is switched out, and when switched to this tab each time,
      // a new instance will be created with the current editting job name.
      var jobName = state.getValue(rebar.demo.common.state.Keys.JOB_NAME);
      return new rebar.demo.view.EditJobPage(jobName);
  }
  return null;
};

/**
 * The tab names
 * @enum {string}
 */
rebar.demo.controller.JobList.TabName = {
  JOB_LIST_PAGE: 'jlp',
  JOB_INS_LIST: 'jil',
  EDIT_JOB: 'ejob'
};
