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
 * @fileoverview Tests for dom utilities
 *
 * @author copperybean.zhang
 */
goog.require('rebar.util.dom');

describe('dom.js test suite', function () {
  it('getAncestor test', function () {
    var domStr = '<div attr="a"><span id="id">hello</span></div>';
    var dom = rebar.util.dom.htmlToElement(domStr);
    var foundVal = null;
    rebar.util.dom.getAncestor(dom.querySelector('#id'), 'attr', function (val, d) {
      // Element.getAttribute returns null or empty string
      // when specific attr does not exist
      if (val === null || val === '') {
        return true;
      }
      foundVal = val;
      return false;
    });
    expect(foundVal).toBe('a');
  });

  it('htmlToElement test', function () {
    var el = rebar.util.dom.htmlToElement('<div></div>');
    expect(el.outerHTML).toBe('<div></div>');

    el = rebar.util.dom.htmlToElement('<span></span><a></a>');
    expect(el.outerHTML).toBe('<div><span></span><a></a></div>');
  });

  it('attrSelector', function () {
    expect(rebar.util.dom.attrSelector('a', 'b')).toBe('[a="b"]');
  });
});

