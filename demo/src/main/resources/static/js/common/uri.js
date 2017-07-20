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
 * @fileoverview All uris used in this project should be implemented here.
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.common.uri');

goog.require('goog.Uri');

/**
 * Get the uri of getting job instances
 * @param {number=} optInstanceId To get instance of specified id
 * @param {boolean=} optOnlyRunning Only get instance of this status
 * @return {string}
 */
rebar.demo.common.uri.getJobInsList = function (optInstanceId, optOnlyRunning) {
  var uri = rebar.demo.common.uri.generateUri_('rest/getJobInstances');
  if (goog.isNumber(optInstanceId)) {
    uri.setParameterValue('insid', optInstanceId);
  }
  if (optOnlyRunning) {
    uri.setParameterValue('onlyrunning', true);
  }
  return uri.toString();
};

/**
 * the uri of getting hive job log
 * @param {number} insId The job instance id
 * @return {string}
 */
rebar.demo.common.uri.getHiveJobLog = function (insId) {
  var uri = rebar.demo.common.uri.generateUri_('rest/getHiveJobLog');
  uri.setParameterValue('insid', insId);
  return uri.toString();
};

/**
 * the uri of getting jobs
 * @param {string=} optJobName Get job with this name.
 * @return {string}
 */
rebar.demo.common.uri.getJobList = function (optJobName) {
  var uri = rebar.demo.common.uri.generateUri_('rest/getJobs');
  if (optJobName) {
    uri.setParameterValue('jobname', optJobName);
  }
  return uri.toString();
};

/**
 * the uri of getting job info
 * @param {string} jobName Get job info with this name.
 * @return {string}
 */
rebar.demo.common.uri.getJobInfo = function (jobName) {
  var uri = rebar.demo.common.uri.generateUri_('rest/getJobInfo');
  uri.setParameterValue('jobname', jobName);
  return uri.toString();
};

/**
 * the uri of saving job
 * @param {string=} optJobName To modify this job if provided
 * @return {string}
 */
rebar.demo.common.uri.saveHiveJob = function (optJobName) {
  var uri = rebar.demo.common.uri.generateUri_('rest/saveJob');
  if (optJobName) {
    uri.setParameterValue('jobname', optJobName);
  }
  return uri.toString();
};

/**
 * Generate a uri instance of this page
 *
 * @param {string} uriSuffix the suffix of uri
 * @return {goog.Uri}
 * @private
 */
rebar.demo.common.uri.generateUri_ = function (uriSuffix) {
  var basePath = '/';
  var uriPrefix =  goog.uri.utils.appendPath(basePath, uriSuffix);
  var uri = new goog.Uri(uriPrefix);
  return uri;
};
