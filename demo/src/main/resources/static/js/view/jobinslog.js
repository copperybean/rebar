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
 * @fileoverview the job instance log view, as an example of using view.
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.view.JobInsLog');

goog.require('rebar.demo.template.JobInstancePage');
goog.require('rebar.mvc.View');

/**
 * The job instance log view
 * @constructor
 * @extends {rebar.mvc.View}
 */
rebar.demo.view.JobInsLog = function () {
  rebar.mvc.View.call(this);
};
goog.inherits(rebar.demo.view.JobInsLog, rebar.mvc.View);

/**
 * Set the id of job instance
 * @param {number} id The id
 */
rebar.demo.view.JobInsLog.prototype.setInstanceId = function (id) {
  var uri = rebar.demo.common.uri.getHiveJobLog(id);
  rebar.demo.model.java.getRestData(uri, goog.bind(function (logs) {
    var html = rebar.demo.template.JobInstancePage.hiveJobLog({
      log: logs[0]
    });
    this.getElement().innerHTML = html.getContent();
  }, this));
};
