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
 * @fileoverview define all the required states
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.common.state');

goog.require('rebar.mvc.StateModel');

/**
 * The index page state
 * @param {string=} optTabName The tab name in index page
 * @return {rebar.mvc.StateModel}
 */
rebar.demo.common.state.indexPage = function (optTabName) {
  var state = new rebar.mvc.StateModel();
  if (optTabName) {
    state.setValue(rebar.demo.common.state.Keys.INDEX_TAB, optTabName);
  }
  return state;
};

/**
 * The job list state
 * @param {string=} optTabName The optional tab name in job list controller
 * @return {rebar.mvc.StateModel}
 */
rebar.demo.common.state.jobList = function (optTabName) {
  var state = rebar.demo.common.state.indexPage(
      rebar.demo.view.IndexPage.TabName.JOB_LIST);
  state.setValue(rebar.demo.common.state.Keys.JOB_LIST_TAB,
      optTabName || rebar.demo.controller.JobList.TabName.JOB_LIST_PAGE);
  return state;
};

/**
 * The job instance list
 * @param {string=} optTabName The tab name in job list
 * @param {string=} optJobName The job instance list of specific job
 * @return {rebar.mvc.StateModel}
 */
rebar.demo.common.state.jobInsList = function (optTabName, optJobName) {
  var state = rebar.demo.common.state.indexPage();
  if (optJobName) {
    state = rebar.demo.common.state.jobList(
        rebar.demo.controller.JobList.TabName.JOB_INS_LIST);
    state.setValue(rebar.demo.common.state.Keys.JOB_NAME, optJobName);
  }
  state.setValue(rebar.demo.common.state.Keys.JOB_INS_LIST_TAB,
      optTabName || rebar.demo.controller.JobInsList.TabName.JOB_INS_LIST_PAGE);
  return state;
};

/**
 * The job instance state
 * @param {number} jobInsId The id of the job
 * @param {string=} optJobName The job name of this instance
 * @return {rebar.mvc.StateModel}
 */
rebar.demo.common.state.jobInstance = function (jobInsId, optJobName) {
  var state = rebar.demo.common.state.jobInsList(
      rebar.demo.controller.JobInsList.TabName.JOB_INS_PAGE, optJobName);
  state.setValue(rebar.demo.common.state.Keys.JOB_INSTANCE_ID, jobInsId + '');
  return state;
};

/**
 * The edit or create job state
 * @param {string=} optJobName The optional job name to edit
 * @return {rebar.mvc.StateModel}
 */
rebar.demo.common.state.editJob = function (optJobName) {
  if (!optJobName) {
    return rebar.demo.common.state.indexPage(
        rebar.demo.view.IndexPage.TabName.CREATE_JOB);
  }
  var state = rebar.demo.common.state.jobList(
      rebar.demo.controller.JobList.TabName.EDIT_JOB);
  state.setValue(rebar.demo.common.state.Keys.JOB_NAME, optJobName);
  return state;
};

/**
 * Define the state keys
 * @enum {string}
 */
rebar.demo.common.state.Keys = {
  INDEX_TAB: 't',
  JOB_LIST_TAB: 'jlt',
  JOB_INS_LIST_TAB: 'jilt',

  JOB_INSTANCE_ID: 'jiid',
  JOB_INSTANCE_STATUS: 'jis',
  JOB_NAME: 'jname'
};
