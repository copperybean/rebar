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
goog.provide('rebar.demo.controller.JobInsList');

goog.require('rebar.demo.view.JobInsListPage');
goog.require('rebar.demo.view.JobInstancePage');
goog.require('rebar.mvc.TabsController');

/**
 * The job list controller
 * @constructor
 * @extends {rebar.mvc.TabsController}
 */
rebar.demo.controller.JobInsList = function () {
  rebar.mvc.TabsController.call(this);

  this.setConfig(new rebar.mvc.TabsController.Config(
      rebar.demo.common.state.Keys.JOB_INS_LIST_TAB, // state key
      rebar.demo.controller.JobInsList.TabName.JOB_INS_LIST_PAGE // default tab
  ));
};
goog.inherits(rebar.demo.controller.JobInsList, rebar.mvc.TabsController);

/**
 * @override
 */
rebar.demo.controller.JobInsList.prototype.createTab = function (name, state) {
  switch (name) {
    case rebar.demo.controller.JobInsList.TabName.JOB_INS_LIST_PAGE:
      return new rebar.demo.view.JobInsListPage();
    case rebar.demo.controller.JobInsList.TabName.JOB_INS_PAGE:
      return new rebar.demo.view.JobInstancePage();
  }
  return null;
};

/**
 * The tab names
 * @enum {string}
 */
rebar.demo.controller.JobInsList.TabName = {
  JOB_INS_LIST_PAGE: 'jilp',
  JOB_INS_PAGE: 'jip'
};
