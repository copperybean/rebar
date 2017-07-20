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
 * @fileoverview The utilities for dom
 *
 * @author wsc, copperybean.zhang
 */
goog.provide('rebar.util.dom');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.style');

/**
 * Add stop element parameter for goog.dom.getAncestor
 * @param {Node} element The DOM node to start with
 * @param {function(Node):boolean} matcher A function that returns true
 *    if the passed node matches the desired criteria.
 * @param {boolean=} optIncludeNode If true, the node itself is included
 * @param {Node=} optStopElement To stop if searched this node
 * @param {number=} optMaxSearchStep Maximum number of levels to search
 * @return {Node|null}
 */
rebar.util.dom.getAncestor = function (
    element, matcher, optIncludeNode, optStopElement, optMaxSearchStep) {
  var ret = goog.dom.getAncestor(element, function (node) {
    return node === optStopElement || matcher(node);
  }, optIncludeNode, optMaxSearchStep);
  if (ret === optStopElement && !matcher(ret)) {
    return null;
  }
  return ret;
};

/**
 * Find the first ancestor with some attribute
 * @param {Node} element The DOM node to start with
 * @param {string} attr The returned node should have this attribute
 * @param {Node=} optStopElement To stop if searched this node
 * @param {number=} optMaxSearchStep Maximum number of levels to search
 * @return {Node|null}
 */
rebar.util.dom.getAncestorWithAttr =
function (element, attr, optStopElement, optMaxSearchStep) {
  return rebar.util.dom.getAncestor(element, function (node) {
    return node && node.hasAttribute(attr);
  }, true, optStopElement, optMaxSearchStep);
};

/**
 * Convert soy content html to element
 * @param {goog.soy.data.SanitizedContent} html The soy content html
 * @return {Element}
 */
rebar.util.dom.htmlToElement = function (html) {
  var node = goog.dom.safeHtmlToNode(html.toSafeHtml());
  if (node.nodeType === goog.dom.NodeType.ELEMENT) {
    return /** @type {Element} */(node);
  }
  var el = goog.dom.createDom(goog.dom.TagName.DIV);
  el.appendChild(node);
  return el;
};

/**
 * Generate a attribute selector
 * @param {string} attr The attribute name
 * @param {string=} optVal The optional value
 * @return {string}
 */
rebar.util.dom.attrSelector = function (attr, optVal) {
  return '[' + attr + (goog.isDef(optVal) ? '="' + optVal + '"' : '') + ']';
};

/**
 * Scroll to bottom of a element
 * @param {Element} scrollDom The element to scroll
 * @param {number=} optBottomDiff The difference to bottom
 * @return {boolean}
 */
rebar.util.dom.scrolledToBottom = function (scrollDom, optBottomDiff) {
  return !!scrollDom
    && (scrollDom.scrollTop + goog.style.getSize(scrollDom).height
        - (optBottomDiff || 0) >= scrollDom.scrollHeight);
};

