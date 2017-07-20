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
 * @fileoverview The input providing bootstrap validation style
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.demo.common.BootstrapInput');

goog.require('rebar.view.Input');

/**
 * A bootstrap style input
 * @constructor
 * @extends {rebar.view.Input}
 */
rebar.demo.common.BootstrapInput = function () {
  rebar.view.Input.call(this);
};
goog.inherits(rebar.demo.common.BootstrapInput, rebar.view.Input);

/**
 * @override
 */
rebar.demo.common.BootstrapInput.prototype.validate = function (optAllowEmpty) {
  var passed = rebar.demo.common.BootstrapInput.superClass_.validate.call(
      this, optAllowEmpty);
  if (passed) {
    $(this.getElement()).parents('.form-group').removeClass('has-error');
    $(this.getElement()).next('.help-block').hide();
  } else {
    $(this.getElement()).parents('.form-group').addClass('has-error');
    $(this.getElement()).next('.help-block').show();
  }
  return passed;
};

