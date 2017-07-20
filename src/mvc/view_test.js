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
 * @fileoverview Tests for view
 * @author copperybean.zhang
 */
goog.require('rebar.mvc.View');

describe('baseview.js test suite', function () {
  var TestView;
  var dom;

  beforeEach(function () {
    TestView = function () {
      rebar.mvc.View.call(this);
    };
    goog.inherits(TestView, rebar.mvc.View);

    TestView.prototype.buildDom = function () {
      return $('<div id="' + TestView.DomId + '"></div>');
    };

    TestView.DomId = 'testviewid';

    dom = $('<div></div>');
  });


  it('render function normal test', function () {
    var tview = new TestView();
    tview.render(dom);
    expect(dom.find(':first').attr('id')).toBe(TestView.DomId);

    tview = new TestView();
    spyOn(tview, 'load');
    tview.render(dom);
    expect(tview.load).toHaveBeenCalled();
  });

  describe('addSubView function test suite', function () {
    it('parent view not rendered and subview not rendered', function () {
      var view = new TestView(), vParent = new TestView();
      spyOn(view, 'unload');
      spyOn(view, 'load');
      vParent.addSubView(view);
      expect(view.unload).not.toHaveBeenCalled();
      expect(view.load).not.toHaveBeenCalled();
      expect(!!view.viewDom_).toBeTruthy();
      expect(!!vParent.viewDom_).toBeTruthy();
      expect(vParent.subViews_[0]).toBe(view);
      expect(view.viewDom_.parent().attr('id')).toBe(TestView.DomId);
    });

    it('parent view not rendered but subview rendered', function () {
      var vParent = new TestView();
      var view = new TestView();
      view.render(dom);
      spyOn(view, 'unload').andCallThrough();
      spyOn(view, 'load');
      spyOn(view, 'buildDom');
      spyOn(vParent, 'buildDom').andCallThrough();
      vParent.addSubView(view, dom);
      expect(view.unload).toHaveBeenCalled();
      expect(view.load).not.toHaveBeenCalled();
      expect(view.buildDom).not.toHaveBeenCalled();
      expect(vParent.buildDom).toHaveBeenCalled();
      expect(view.viewDom_.parent().attr('id')).not.toBe(TestView.DomId);
      vParent.render(dom);
      expect(view.load).toHaveBeenCalled();
    });

    it('parent view rendered but subview not rendered', function () {
      var vParent = new TestView();
      vParent.render(dom);
      var view = new TestView();
      spyOn(view, 'unload');
      spyOn(view, 'load');
      vParent.addSubView(view);
      expect(view.unload).not.toHaveBeenCalled();
      expect(view.load).toHaveBeenCalled();
      expect(vParent.subViews_[vParent.subViews_.length - 1]).toBe(view);
    });

    it('parent view rendered and subview rendered', function () {
      var vParent = new TestView();
      vParent.render(dom);
      var view = new TestView();
      var count = 0;
      view.render(dom);
      var oldUnload = view.unload;
      spyOn(view, 'unload').andCallFake(function () {
        expect(count).toBe(0);
        ++count;
        oldUnload.call(view);
      });
      spyOn(view, 'load').andCallFake(function () {
        expect(count).toBe(1);
        ++count;
      });
      vParent.addSubViewAt(view, 0);
      expect(view.load).toHaveBeenCalled();
      expect(view.unload).toHaveBeenCalled();
      expect(vParent.subViews_[0]).toBe(view);
    });
  });

  it('remove function normal test', function () {
    var vParent = new TestView(), view = new TestView();
    vParent.addSubView(view);
    view.remove();
    expect(view.parentView_).toBe(null);
    expect(vParent.subViews_.length).toBe(0);

    vParent.render(dom);
    vParent.addSubView(view);
    spyOn(view, 'unload');
    view.remove();
    expect(view.unload).toHaveBeenCalled();
  });

  it('bindEvent function normal test', function () {
    var func = function () {};
    var view = new TestView();

    var ret = view.bindEvent('', func);
    expect(ret).toBeFalsy();
    ret = view.bindEvent('abc', 4);
    expect(ret).toBeFalsy();


    ret = view.bindEvent('a', func);
    expect(ret).toBeTruthy();
    expect(view.eventMap_.a[0]).toBe(func);
  });

  it('unbindEvent function normal test', function () {
    var view = new TestView();
    var ret = view.unbindEvent('');
    expect(ret).toBeFalsy();
    ret = view.unbindEvent('a');
    expect(ret).toBeFalsy();

    view.bindEvent('a', function (){});
    ret = view.unbindEvent('a');
    expect(ret).toBeTruthy();
    expect(view.eventMap_.a).toBe(null);
  });

  it('fireEvent function normal test', function () {
    var view = new TestView();
    var oneFunc = jasmine.createSpy('oneFunc');
    var twoFunc = jasmine.createSpy('twoFunc');
    view.bindEvent('a', oneFunc);
    view.bindEvent('a', twoFunc);
    view.fireEvent('a', 1, 'b');
    expect(oneFunc).toHaveBeenCalledWith(1, 'b');
    expect(twoFunc).toHaveBeenCalledWith(1, 'b');
  });

  it('load function normal test', function () {
    var view = new TestView(), vParent = new TestView();
    vParent.addSubView(view);
    spyOn(view, 'load');
    spyOn(vParent, 'init');
    vParent.load();
    expect(view.load).toHaveBeenCalled();
    expect(vParent.init).toHaveBeenCalled();
    expect(vParent.isViewLoaded()).toBeTruthy();
    expect(vParent.load).toThrow();
  });

  it('unload function normal test', function () {
    var view = new TestView(), vParent = new TestView();
    vParent.addSubView(view);
    vParent.load();
    spyOn(view, 'unload');
    vParent.unload();
    expect(view.unload).toHaveBeenCalled();
    expect(vParent.isViewLoaded()).toBeFalsy();
    expect(vParent.unload).toThrow();
  });
});

