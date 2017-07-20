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
 * @fileoverview A interface to support data driven mvc project
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.mvc.Stateful');

/**
 * For the SPA(Single Page Application) project, the js code must process the
 * logic of mapping uri to specified page state. We define a simple interface
 * here to support the operation of setting a state to the total(or part of)
 * page. So, the whole js project should support page level data driven,
 * each page can be abstracted in a simple key-value state data object.
 * @interface
 */
rebar.mvc.Stateful = function () {
};

/**
 * Set the current state
 * @param {rebar.mvc.StateModel} state
 */
rebar.mvc.Stateful.prototype.setState;

