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
goog.provide('rebar.view.Form');

goog.require('rebar.mvc.View');
goog.require('rebar.view.Input');

goog.require('goog.array');
goog.require('goog.json');
goog.require('goog.object');

/**
 * A form class to support the form operation better, like load and save
 * json data, input error check, etc.
 * @constructor
 * @extends {rebar.mvc.View}
 */
rebar.view.Form = function () {
  rebar.mvc.View.call(this);

  /**
   * @type {Object.<string, rebar.view.Input>}
   * @private
   */
  this.inputs_ = {};
};
goog.inherits(rebar.view.Form, rebar.mvc.View);

/**
 * Save the form data to object
 * @param {Object=} optInitObj The optional initialize object
 * @return {Object}
 */
rebar.view.Form.prototype.saveToObject = function (optInitObj) {
  var obj = optInitObj || {};

  goog.object.forEach(this.inputs_, function (input) {
    var val = input.getValue();
    if (goog.isDef(val)) {
      rebar.view.Form.initObjectPath_(obj, input.getFieldPath(), val);
    }
  });
  return obj;
}

/**
 * Load the from from object data
 * @param {Object} obj The form data object
 * @param {Array.<string>=} optPathInAncestor If the data in form is
 *    a field of some ancestor object
 */
rebar.view.Form.prototype.loadFromObject = function (obj, optPathInAncestor) {
  var fieldPath = optPathInAncestor || [];
  goog.object.forEach(obj, function (val, key) {
    fieldPath.push(key)
    if (goog.isObject(val)) {
      this.loadFromObject(val, fieldPath);
    } else {
      var input = this.inputs_[goog.json.serialize(fieldPath)];
      if (input) {
        input.setValue(val);
      }
    }
    fieldPath.pop();
  }, this);
};

/**
 * Reset the form inputs
 */
rebar.view.Form.prototype.reset = function () {
  goog.object.forEach(this.inputs_, function (input) {
    input.reset();
  });
};

/**
 * Validate all inputs
 * @return {boolean} Return true if all passed
 */
rebar.view.Form.prototype.validateInputs = function () {
  var passed = true;
  goog.object.forEach(this.inputs_, function (input) {
    var inputPassed = input.validate();
    if (passed && !inputPassed) {
      input.focus();
    }
    passed = inputPassed && passed;
  });
  return passed;
};

/**
 * @override
 */
rebar.view.Form.prototype.init = function () {
  rebar.view.Form.superClass_.init.call(this);

  this.initInputs();
};

/**
 * @override
 */
rebar.view.Form.prototype.enterDocument = function () {
  rebar.view.Form.superClass_.enterDocument.call(this);

  var clickEvent = goog.events.EventType.CLICK;
  this.getHandler().listen(this.getSubmitElement(), clickEvent, function (e) {
    this.validateInputs() && this.submitForm();
    e.preventDefault();
  });
};

/**
 * To submit the form
 * @protected
 */
rebar.view.Form.prototype.submitForm = function () {
};

/**
 * Register an input
 * @param {rebar.view.Input} input The input to be registered
 * @protected
 */
rebar.view.Form.prototype.registerInput = function (input) {
  this.inputs_[goog.json.serialize(input.getFieldPath())] = input;
};

/**
 * Create and render the input
 * @param {Element} inputElement The input element
 * @return {rebar.view.Input}
 * @protected
 */
rebar.view.Form.prototype.inputFromElement = function (inputElement) {
    var input = new rebar.view.Input();
    this.decorateSubView(input, inputElement);
    return input;
};

/**
 * Initialize all inputs
 * @protected
 */
rebar.view.Form.prototype.initInputs = function () {
  var elements = this.getElement().querySelectorAll('[name]');
  goog.array.forEach(elements, function (el) {
    this.registerInput(this.inputFromElement(el));
  }, this);
};

/**
 * Get the submit element
 * @return {Element}
 * @protected
 */
rebar.view.Form.prototype.getSubmitElement = function () {
  return this.getElement().querySelector('[type=submit]');
};

/**
 * Initialize the object's path, which is a token list joined by dot(.)
 * @param {Object} obj The object to initialize
 * @param {Array.<string>} fieldPath Field path in the object
 * @param {*} value The value of the path
 * @private
 */
rebar.view.Form.initObjectPath_ = function (obj, fieldPath, value) {
  if (!fieldPath.length) {
    return;
  }
  for (var i = 0; i < fieldPath.length - 1; i++) {
    if (!obj[fieldPath[i]]) {
      obj[fieldPath[i]] = {};
    }
    obj = obj[fieldPath[i]];
  }
  obj[fieldPath[fieldPath.length - 1]] = value;
};

