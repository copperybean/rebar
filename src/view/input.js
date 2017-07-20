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
 * @fileoverview A utility to support form operation better
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.view.Input');

goog.require('rebar.mvc.View');

goog.require('goog.object');

/**
 * Input cell in form, is an abstraction of input, providing some interfaces
 * @constructor
 * @extends {rebar.mvc.View}
 */
rebar.view.Input = function () {
  rebar.mvc.View.call(this);
};
goog.inherits(rebar.view.Input, rebar.mvc.View);

/**
 * Get the path of object
 * @return {Array.<string>}
 */
rebar.view.Input.prototype.getFieldPath = function () {
  return this.getElement().getAttribute('name').split('.');
};

/**
 * Get the value
 * @return {string}
 */
rebar.view.Input.prototype.getValue = function () {
  return this.getElement().value.trim();
};

/**
 * Set the value
 * @param {string} val The value
 */
rebar.view.Input.prototype.setValue = function (val) {
  this.getElement().value = val;
};

/**
 * To reset the input
 */
rebar.view.Input.prototype.reset = function () {
  this.getElement().value = '';
};

/**
 * @override
 */
rebar.view.Input.prototype.focus = function () {
  this.getElement().focus();
};

/**
 * Validate the input
 * @param {boolean=} optAllowEmpty Pass validation for empty value
 * @return {boolean}
 */
rebar.view.Input.prototype.validate = function (optAllowEmpty) {
  if (optAllowEmpty && !this.getValue()) {
    return true;
  }
  var reg = this.getElement().getAttribute(
      rebar.view.Input.NODE_ATTR.VALIDATION_REG);
  if (!reg) {
    return true;
  }
  var validationReg = new RegExp(reg);
  return validationReg.test(this.getValue() || '');
};

/**
 * The classic usage is auto-complete of an input, you may want to fetch the
 * data from server only when user stopped rapid input for about 500
 * milliseconds. You can implement the featching and updating logic in this
 * method.
 * @protected
 */
rebar.view.Input.prototype.onDelayUpdate = function () {
};

/**
 * You can call this method in the enterDocument method
 * @param {number=} optMilliSec The milliseconds to be delayed before trigger
 *    update method
 * @param {Element=} optEl On which element to listen change event
 * @protected
 */
rebar.view.Input.prototype.listenDelayUpdte = function (optMilliSec, optEl) {
  var delay = new goog.async.Delay(
      this.onDelayUpdate, optMilliSec || 500, this);
  var elInput = optEl || this.getElement();
  var startUpdateDelay = function () {
    delay.start();
  };
  var listenKeyup = function () {
    this.getHandler().listen(
        elInput, goog.events.EventType.KEYUP, startUpdateDelay);
  };
  var onStartComposition = function () {
    delay.stop();
    this.getHandler().unlisten(
        elInput, goog.events.EventType.KEYUP, startUpdateDelay);
  };
  var onEndComposition = function () {
    listenKeyup.call(this);
    startUpdateDelay.call(this);
  };

  listenKeyup.call(this);
  this.getHandler().listen(
      elInput, goog.events.EventType.COMPOSITIONSTART, onStartComposition);
  this.getHandler().listen(
      elInput, goog.events.EventType.COMPOSITIONEND, onEndComposition);
};

/**
 * @override
 */
rebar.view.Input.prototype.enterDocument = function () {
  rebar.view.Input.superClass_.enterDocument.call(this);

  var attr = rebar.view.Input.NODE_ATTR.VALIDATION_REG;
  if (this.getElement().hasAttribute(attr)) {
    var eventName = goog.events.EventType.KEYUP;
    this.getHandler().listen( this.getElement(), eventName, function (e) {
      this.validate(true);
    });
  }
};

/**
 * Define the node attributes used by this class
 * @enum {string}
 */
rebar.view.Input.NODE_ATTR = {
  VALIDATION_REG: 'rebar-validation-reg'
};

