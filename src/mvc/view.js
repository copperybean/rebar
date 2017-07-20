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
 * @fileoverview Defines base class of view
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.mvc.View');

goog.require('rebar.util.MessageBox');
goog.require('rebar.mvc.StateModel');
goog.require('rebar.mvc.Stateful');
goog.require('rebar.util.dom');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');
goog.require('goog.ui.IdGenerator');
goog.require('goog.ui.Tooltip');

/**
 * The base class of view in MVC
 * @param {boolean=} optUseNakedId Using a raw string as id of DOM in a view
 *    instance is not safe. Firstly, view may have more than one instance
 *    showing, get element by id may not get the right element you want.
 *    Secondly, view can have sub-view, sub-view may have same id definition.
 *    The solution is to add id of view to each id, making the id unique.
 * @constructor
 * @extends {goog.ui.Component}
 * @implements {rebar.mvc.Stateful}
 */
rebar.mvc.View = function (optUseNakedId) {
  goog.ui.Component.call(this);

  /**
   * @type {boolean}
   * @private
   */
  this.useNakeId_ = optUseNakedId || false;

  /**
   * @type {string}
   * @private
   */
  this.viewId_ = 'b' + rebar.mvc.View.idCounter_++ + '_';

  /**
   * @type {boolean}
   * @private
   */
  this.viewInitialized_ = false;

  /**
   * @type {rebar.mvc.StateModel}
   * @private
   */
  this.lastState_ = null;
};
goog.inherits(rebar.mvc.View, goog.ui.Component);

/**
 * Remove the view from document and it's parent, and stop all DOM events.
 */
rebar.mvc.View.prototype.remove = function () {
  if (this.getParent()) {
    this.getParent().removeChild(this, true);
  }
  if (this.isInDocument()) {
    this.exitDocument();
  }
  if (this.getElement()) {
    goog.dom.removeNode(this.getElement());
  }
  // we also remove the jQuery events from the element of the view, if you
  // are using jQuery.
  if (this.getElement() && window['jQuery']) {
    var jqObj = window['jQuery'].call(window, this.getElement());
    jqObj['remove'].call(jqObj);
  }
};

/**
 * A good idea of implementing a complex page is to divide it into small views,
 * and assemble the views together.
 * @param {rebar.mvc.View} view The view to add.
 * @param {Element=} optElContainer You can specify an element in this view
 *    as the container element of the sub-view.
 */
rebar.mvc.View.prototype.addSubView = function (view, optElContainer) {
  if (optElContainer) {
    this.addChild(view);
    view.render(optElContainer);
  } else {
    this.addChild(view, true);
  }
};

/**
 * Like the decorate method of goog.ui.Component, you also can decorate
 * a sub-view to the specified element.
 * @param {rebar.mvc.View} view The sub-view to decorate.
 * @param {Element} elDecorate The element on which to decorate.
 */
rebar.mvc.View.prototype.decorateSubView = function (view, elDecorate) {
  this.addChild(view);
  view.decorate(elDecorate);
};

/**
 * Like goog.ui.Component#addChildAt
 * @param {rebar.mvc.View} view The view to add
 * @param {number} index The index of sub views.
 * @param {Element=} optElContainer The container element of the view.
 */
rebar.mvc.View.prototype.addSubViewAt = function (
    view, index, optElContainer) {
  if (optElContainer) {
    this.addChildAt(view, index);
    view.render(optElContainer);
  } else {
    this.addChildAt(view, index, true);
  }
};

/**
 * Get the parent view if exists.
 * @return {rebar.mvc.View?}
 */
rebar.mvc.View.prototype.getParentView = function () {
  var p = this.getParent();
  return p instanceof rebar.mvc.View ? p : null;
};

/**
 * @override
 */
rebar.mvc.View.prototype.setState = function (state) {
  if (!this.isViewInitialized()) {
    this.init();
  }
  this.lastState_ = state;
  if (this.isInDocument()) {
    this.updateStateInDocument(this.lastState_);
  }
};

/**
 * Method setState may be called before enter document, and we always
 * update the view after enter document according to the state. Now
 * sub-class can implement this logic in this method.
 * @param {rebar.mvc.StateModel?} lastState The last state from setState method,
 *    may be null when enterDocument called but setState not called.
 * @protected
 */
rebar.mvc.View.prototype.updateStateInDocument = function (lastState) {
};

/**
 * This method of base class may return id containing any charactors, which
 * is not suitable for using as the id property in DOM.
 * @override
 */
rebar.mvc.View.prototype.getId = function () {
  return this.viewId_;
};

/**
 * Used to get a unique prefix used in dom, like id of element.
 * @return {string}
 * @protected
 */
rebar.mvc.View.prototype.getDomPrefix = function () {
  return this.useNakeId_ ? '' : this.getId();
};

/**
 * Forcus the view
 */
rebar.mvc.View.prototype.focus = function () {
  var el = this.getElement().querySelector('input');
  el && el.focus();
};

/**
 * Reload the view
 */
rebar.mvc.View.prototype.reload = function () {
  if (!this.isInDocument()) {
    throw 'reload an unloaded view';
  }
  this.forEachChild(function (view) {
    view instanceof rebar.mvc.View && view.reload();
  });
};

/**
 * You can use this method to get an id in this view safely
 * @param {string} id The id without prefix
 * @return {Element}
 * @protected
 */
rebar.mvc.View.prototype.getDomById = function (id) {
  return this.getElement().querySelector('#' + this.getDomPrefix() + id);
};

/**
 * Query selector in this element or element of specified id without prefix
 * @param {string} selector The selector
 * @param {string=} optId The optional id without prefix.
 * @return {Element}
 */
rebar.mvc.View.prototype.querySelector = function (selector, optId) {
  var el = optId ? this.getDomById(optId) : this.getElement();
  return el.querySelector(selector);
};

/**
 * Query selector nodes in this element or element of specified id
 * without prefix
 * @param {string} selector The selector
 * @param {string=} optId The optional id without prefix.
 * @return {NodeList}
 */
rebar.mvc.View.prototype.querySelectorAll = function (selector, optId) {
  var el = optId ? this.getDomById(optId) : this.getElement();
  return el.querySelectorAll(selector);
};

/**
 * Get the element with attribute name and value.
 * @param {string} attr The attribute name.
 * @param {string=} optVal The optional value.
 * @param {string=} optId Get in element of this id without prefix.
 * @return {Element}
 * @protected
 */
rebar.mvc.View.prototype.getDomByAttr = function (attr, optVal, optId) {
  return this.querySelector(rebar.util.dom.attrSelector(attr, optVal), optId);
};

/**
 * Get all nodes with attribute name and value
 * @param {string} attr The attribute name
 * @param {string=} optVal The optinal value
 * @param {string=} optId Get in element of this id without prefix.
 * @return {NodeList}
 * @protected
 */
rebar.mvc.View.prototype.getAllDomByAttr = function (attr, optVal, optId) {
  return this.querySelectorAll(
      rebar.util.dom.attrSelector(attr, optVal), optId);
};

/**
 * @override
 */
rebar.mvc.View.prototype.createDom = function () {
  var dom = this.buildDom();
  if (dom instanceof goog.soy.data.SanitizedContent) {
    dom = rebar.util.dom.htmlToElement(dom);
  }
  this.setElementInternal(dom);
};

/**
 * Sub class of view can override this method to generate its dom
 * @return {goog.soy.data.SanitizedContent|Element}
 * @protected
 */
rebar.mvc.View.prototype.buildDom = function () {
  return goog.dom.createElement(goog.dom.TagName.DIV);
};

/**
 * The initialize method which is guaranteed to be called once, and be called
 * before enterDocument and setState
 * @protected
 */
rebar.mvc.View.prototype.init = function () {
  if (this.viewInitialized_) {
    throw 'initialize a initialized view';
  }
  if (!this.getElement()) {
    this.createDom();
  }
  this.viewInitialized_ = true;
};

/**
 * Whether the view is initialized
 * @return {boolean}
 * @protected
 */
rebar.mvc.View.prototype.isViewInitialized = function () {
  return this.viewInitialized_;
};

/**
 * @override
 */
rebar.mvc.View.prototype.enterDocument = function () {
  if (!this.isViewInitialized()) {
    this.init();
  }
  rebar.mvc.View.superClass_.enterDocument.call(this);
  this.updateStateInDocument(this.lastState_);
};

/**
 * Show a tip message
 * @param {string} tip The tip message
 * @protected
 */
rebar.mvc.View.prototype.showTip = function (tip) {
  rebar.util.MessageBox.getInstance().showTip(tip);
};

/**
 * @type {number}
 * @private
 */
rebar.mvc.View.idCounter_ = 0;

