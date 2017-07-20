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
 * @fileoverview The prompt implemented with raw closure.
 *
 * @author rww, copperybean.zhang
 */
goog.provide('rebar.prompt.ClosurePrompt');

goog.require('rebar.Prompt');
goog.require('rebar.template.ClosurePrompt');
goog.require('rebar.util.dom');

goog.require('goog.dom.classlist');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.ModalPopup');

/**
 * The prompt implemented from closure
 * @constructor
 * @extends {goog.ui.ModalPopup}
 * @implements {rebar.Prompt}
 */
rebar.prompt.ClosurePrompt = function () {
  goog.ui.ModalPopup.call(this);

  /**
   * @type {Function}
   * @private
   */
  this.cancelOnceCallback_ = null;

  /**
   * @type {Function}
   * @private
   */
  this.okOnceCallback_ = null;
};
goog.inherits(rebar.prompt.ClosurePrompt, goog.ui.ModalPopup);

/**
 * A simple error prompt
 * @param {string} msg The msg to show.
 * @param {string=} optTitle The optional title.
 */
rebar.prompt.ClosurePrompt.popupError = function (msg, optTitle) {
  var dialog = new rebar.prompt.ClosurePrompt();
  dialog.setup(optTitle || 'Error', msg, false, true).show();
};

/**
 * @override
 */
rebar.prompt.ClosurePrompt.prototype.setup = function (
    title, content, optShowCancel, optShowYes) {
  if (!this.getElement()) {
    this.createDom();
  }
  var el = this.getElement().querySelector('.rebar-closure-prompt-header');
  el.innerHTML = title;
  el = this.getElement().querySelector('.rebar-cloure-prompt-content');
  if (content instanceof goog.ui.Component) {
    this.addChild(content);
    content.render(el);
  } else {
    el.innerHTML = content;
  }

  var elCancel = this.getElement().querySelector('#rebar-prompt-cancel');
  if (optShowCancel === false) {
    goog.style.setElementShown(elCancel, false);
  } else {
    if (goog.isFunction(optShowCancel)) {
      this.cancelOnceCallback_ = optShowCancel;
    }
    goog.style.setElementShown(elCancel, true);
  }

  var elYes = this.getElement().querySelector('#rebar-prompt-ok');
  if (optShowYes === false) {
    goog.style.setElementShown(elYes, false);
  } else {
    if (goog.isFunction(optShowYes)) {
      this.okOnceCallback_ = optShowYes;
    }
    goog.style.setElementShown(elYes, true);
  }
  this.render();
  return this;
};

/**
 * @override
 */
rebar.prompt.ClosurePrompt.prototype.enterDocument = function () {
  rebar.prompt.ClosurePrompt.superClass_.enterDocument.call(this);

  var elYes = this.getElement().querySelector('#rebar-prompt-ok');
  this.getHandler().listen(elYes, goog.events.EventType.CLICK, function () {
    if (!this.okOnceCallback_ || this.okOnceCallback_.call(null) !== false) {
      this.setVisible(false);
    }
  });

  var elCancel = this.getElement().querySelector('#rebar-prompt-cancel');
  this.getHandler().listen(elCancel, goog.events.EventType.CLICK, function () {
    if (!this.cancelOnceCallback_ ||
        this.cancelOnceCallback_.call(null) !== false) {
      this.setVisible(false);
    }
  });
};

/**
 * @override
 */
rebar.prompt.ClosurePrompt.prototype.show = function () {
  this.setVisible(true);
  var elCancel = this.getElement().querySelector('#rebar-prompt-cancel');
  elCancel.focus();
};

/**
 * @override
 */
rebar.prompt.ClosurePrompt.prototype.close = function () {
  this.setVisible(false);
};

/**
 * @override
 */
rebar.prompt.ClosurePrompt.prototype.createDom = function () {
  rebar.prompt.ClosurePrompt.superClass_.createDom.call(this);

  var domHtml = rebar.template.ClosurePrompt.viewHtml();
  this.getElement().innerHTML = domHtml;
};

/**
 * @override
 */
rebar.prompt.ClosurePrompt.prototype.getCssClass = function () {
  return goog.getCssName('rebar-closure-prompt');
};

/**
 * @override
 */
rebar.prompt.ClosurePrompt.prototype.onHide = function () {
  rebar.prompt.ClosurePrompt.superClass_.onHide.call(this);

  this.okOnceCallback_ = null;
  this.cancelOnceCallback_ = null;
  this.dispose();
};

/**
 * @override
 */
rebar.prompt.ClosurePrompt.prototype.disposeInternal = function () {
  rebar.prompt.ClosurePrompt.superClass_.disposeInternal.call(this);
};

