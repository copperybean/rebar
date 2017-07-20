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
 * @fileoverview A message box is used to show a short message in a small box
 * at top of page. If it is called multi-times shortly, then only one message
 * is showing at same time
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.util.MessageBox');

goog.require('rebar.template.MessageBox');
goog.require('rebar.util.dom');

goog.require('goog.array');
goog.require('goog.async.Delay');
goog.require('goog.dom.classlist');
goog.require('goog.style');

/**
 * The message box class
 * @constructor
 */
rebar.util.MessageBox = function () {
  /**
   * @type {goog.async.Delay}
   * @private
   */
  this.hideDelay_ = new goog.async.Delay(goog.bind(this.onTipTimeout_, this),
      rebar.util.MessageBox.Config_.DURATION);

  /**
   * @type {Element}
   * @private
   */
  this.msgDom_ = this.buildDom_();

  /**
   * @private
   * @type {number}
   */
  this.nextId_ = 0;

  /**
   * @type {rebar.util.MessageBox.MessageInfo}
   * @private
   */
  this.curInfo_ = null;

  /**
   * @type {Array.<rebar.util.MessageBox.MessageInfo>}
   * @private
   */
  this.msgInfoList_ = [];

  /**
   * @type {rebar.mvc.View}
   * @private
   */
  this.referView_ = null;
};
goog.addSingletonGetter(rebar.util.MessageBox);

/**
 * The box can be fixed at top of refer view
 * @param {rebar.mvc.View} view
 */
rebar.util.MessageBox.prototype.setReferView = function (view) {
  this.referView_ = view;
};

/**
 * Show the loading state message
 * @param {string} msg The message
 * @return {number} The id of this message
 */
rebar.util.MessageBox.prototype.showLoading = function (msg) {
  var info = this.recordMessage_(
      msg, rebar.util.MessageBox.MessageType.LOADING);
  this.showMessage_(info);
  return info.id;
};

/**
 * Show tip
 * @param {string} msg The message to show
 */
rebar.util.MessageBox.prototype.showTip = function (msg) {
  var info = this.recordMessage_(msg, rebar.util.MessageBox.MessageType.TIP);
  this.showMessage_(info);
  this.hideDelay_.isActive() && this.hideDelay_.fire();
  this.hideDelay_.start();
};

/**
 * Show the message
 * @param {rebar.util.MessageBox.MessageInfo} info The message info
 * @private
 */
rebar.util.MessageBox.prototype.showMessage_ = function (info) {
  if (info === this.curInfo_) {
    return;
  }
  this.curInfo_ = info;
  if (info.type === rebar.util.MessageBox.MessageType.LOADING) {
    goog.dom.classlist.add(this.msgDom_, 'loading');
  } else {
    goog.dom.classlist.remove(this.msgDom_, 'loading');
  }
  this.msgDom_.querySelector('i').innerHTML = info.message;
  goog.style.setElementShown(this.msgDom_, true);
  this.updatePos_();
};

/**
 * Record the message to show
 * @param {string} msg The message
 * @param {number.<rebar.util.MessageBox.MessageType>} type The type
 * @return {rebar.util.MessageBox.MessageInfo}
 * @private
 */
rebar.util.MessageBox.prototype.recordMessage_ = function (msg, type) {
  if (this.msgInfoList_.length === 0) {
    goog.events.listen(window,
        goog.events.EventType.SCROLL,
        this.onWindowScroll_,
        undefined,
        this);
  }
  var ret = new rebar.util.MessageBox.MessageInfo(this.nextId_++, msg, type);
  this.msgInfoList_.push(ret);
  return ret;
};

/**
 * Hide a message with id
 * @param {number} id The message id
 */
rebar.util.MessageBox.prototype.hide = function (id) {
  for (var i = 0; i < this.msgInfoList_.length; ++i) {
    if (this.msgInfoList_[i].id != id) {
      continue;
    }
    this.msgInfoList_.splice(i, 1);
    if (this.msgInfoList_.length > 0) {
      this.showMessage_(this.msgInfoList_[this.msgInfoList_.length - 1]);
    } else {
      this.curInfo_ = null;
      goog.style.setElementShown(this.msgDom_, false);
      goog.events.unlisten(window,
          goog.events.EventType.SCROLL,
          this.onWindowScroll_,
          undefined,
          this);
    }
    break;
  }
};

/**
 * Build message dom
 * @return {Element}
 */
rebar.util.MessageBox.prototype.buildDom_ = function () {
  var tipHtml = rebar.template.MessageBox.viewHtml();
  var msgDom = rebar.util.dom.htmlToElement(tipHtml);
  document.body.appendChild(msgDom);
  return msgDom;
};

/**
 * Update the box position
 * @private
 */
rebar.util.MessageBox.prototype.updatePos_ = function () {
  var referDom = document.body;
  if (this.referView_
      && goog.style.getSize(this.referView_.getElement()).area()) {
    referDom = this.referView_.getElement();
  }
  var referOffset = goog.style.getPageOffset(referDom);
  var widthDiff = goog.style.getSize(referDom).width -
      goog.style.getSize(this.msgDom_).width;
  var xPos = referOffset.x - window.scrollX + Math.ceil(widthDiff / 2)
  var yPos = rebar.util.MessageBox.Config_.TOP_POS;
  goog.style.setPosition( this.msgDom_, xPos, yPos);
};

/**
 * The handler of time out of tip
 * @private
 */
rebar.util.MessageBox.prototype.onTipTimeout_ = function () {
  goog.array.forEach(this.msgInfoList_, function (msgInfo) {
    if (msgInfo.type === rebar.util.MessageBox.MessageType.TIP) {
      this.hide(msgInfo.id);
    }
  }, this);
};

/**
 * The window scroll handler
 * @param {Event} event The event
 * @private
 */
rebar.util.MessageBox.prototype.onWindowScroll_ = function (event) {
  this.updatePos_();
};

/**
 * @enum
 */
rebar.util.MessageBox.MessageType = {
  LOADING: 0,
  TIP: 1
};

/**
 * The message info class
 * @param {number} id The id of a message
 * @param {string} msg The message its self
 * @param {number.<rebar.util.MessageBox.MessageType>} type The message type
 * @constructor
 * @private
 */
rebar.util.MessageBox.MessageInfo = function (id, msg, type) {
  this.id = id;
  this.message = msg;
  this.type = type;
};

/**
 * @enum
 * @private
 */
rebar.util.MessageBox.Config_ = {
  TOP_POS: 40,
  DURATION: 3000
};
