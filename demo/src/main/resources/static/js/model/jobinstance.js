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
 * @fileoverview The sub class of JobInstance built from java, to demonstrate a
 * feature of JSModelBuilder: if you are not satisfied with the built model
 * class by JSModelBuilder, you can provide a subclass, and make sure
 * the referrence in built class HiveJob changes to this class
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.model.JobInstance');

goog.require('rebar.demo.model.java.schedule.JobInstance');

/**
 * The sub class of built class HiveJob from java. This class is a goog example
 * of overriding the model generated from java. You can found the type of
 * instances field in the generated model class HiveJob is changed to this
 * class. This is implemented by the JSModelBuilder parameter jsReferClassMap
 * set in pom.xml.
 * @constructor
 * @extends {rebar.demo.model.java.schedule.JobInstance}
 */
rebar.demo.model.JobInstance = function () {
  rebar.demo.model.java.schedule.JobInstance.call(this);
};
goog.inherits(rebar.demo.model.JobInstance,
    rebar.demo.model.java.schedule.JobInstance);

/**
 * @override
 */
rebar.demo.model.JobInstance.prototype.initWithJson = function (obj) {
  if (!rebar.demo.model.JobInstance.superClass_.initWithJson.call(this, obj)) {
    return false;
  }
  var formater = new goog.i18n.DateTimeFormat('y-MM-dd HH:mm:ss');
  this.startTimeDes = formater.format(this.startTime);
  this.endTimeDes = '';
  if (this.endTime.getTime()) {
    this.endTimeDes = formater.format(this.endTime);
  }
  return true;
};
