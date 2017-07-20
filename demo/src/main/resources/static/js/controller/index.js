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
 * @fileoverview the index controller
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.controller.Index');

goog.require('rebar.demo.controller.JobInsList');
goog.require('rebar.demo.controller.JobList');
goog.require('rebar.demo.view.EditJobPage');
goog.require('rebar.mvc.TabsController');

/**
 * @param {rebar.demo.view.IndexPage} page The index page.
 * @constructor
 * @extends {rebar.mvc.TabsController}
 */
rebar.demo.controller.Index = function (page) {
  rebar.mvc.TabsController.call(this, page);

  this.setConfig(new rebar.mvc.TabsController.Config(
      rebar.demo.common.state.Keys.INDEX_TAB, // state key
      rebar.demo.view.IndexPage.TabName.RUNNING_JOBS // default tab
  ));
};
goog.inherits(rebar.demo.controller.Index, rebar.mvc.TabsController);

/**
 * Begin to serve
 */
rebar.demo.controller.Index.prototype.serve = function () {
  this.loadController();
};

/**
 * @override
 */
rebar.demo.controller.Index.prototype.createTab = function (tabName, state) {
  switch (tabName) {
    case rebar.demo.view.IndexPage.TabName.RUNNING_JOBS:
      return new rebar.demo.controller.JobInsList();
    case rebar.demo.view.IndexPage.TabName.JOB_LIST:
      return new rebar.demo.controller.JobList();
    case rebar.demo.view.IndexPage.TabName.CREATE_JOB:
      return new rebar.demo.view.EditJobPage();
  }
  return null;
};

