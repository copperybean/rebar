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
 * @fileoverview The tests for tab controller
 *
 * @author copperybean.zhang
 */
goog.require('rebar.mvc.TabsController');

goog.require('goog.object');

describe('tabs-controller.js test suite', function () {
  it('loadController and unloadController function normal test', function () {
    var controller = new rebar.mvc.TabsController();
    var pageController = new rebar.mvc.ViewController();
    controller.appendTab(pageController, true);
    spyOn(pageController, 'loadController');
    spyOn(pageController, 'unloadController');
    controller.loadController();
    expect(pageController.loadController).toHaveBeenCalled();
    controller.unloadController();
    expect(pageController.unloadController).toHaveBeenCalled();
  });

  it('appendTab function normal test', function () {
    var controller = new rebar.mvc.TabsController();
    controller.appendTab(new rebar.mvc.ViewController());
    expect(goog.object.getKeys(controller.tabsMap_).length).toBe(1);
    expect(controller.getActiveIndex()).toBe(-1);
    controller.appendTab(new rebar.mvc.ViewController(), true);
    expect(goog.object.getKeys(controller.tabsMap_).length).toBe(2);
    expect(controller.getActiveIndex()).toBe(1);
  });

  it('changeToTab and changeToView function normal test', function () {
    var view = new rebar.mvc.View();
    view.render();
    var controller = new rebar.mvc.TabsController(view);
    expect(controller.changeToTab).toThrow();
    var pageController = new rebar.mvc.ViewController();
    spyOn(pageController, 'loadController').andCallThrough();
    controller.appendTab(pageController, true);
    expect(pageController.loadController).not.toHaveBeenCalled();
    controller.loadController();

    spyOn(pageController, 'unloadController').andCallThrough();
    var anotherPageController = new rebar.mvc.ViewController();
    spyOn(anotherPageController, 'loadController').andCallThrough();
    controller.appendTab(anotherPageController, true);
    expect(pageController.unloadController).toHaveBeenCalled();
    expect(pageController.getView().getParent()).toBeNull();
    expect(anotherPageController.loadController).toHaveBeenCalled();

    controller.changeToView(pageController.getView());
    expect(controller.getActiveIndex()).toBe(0);
  });

  it('changeToPrevTab and changeToNextTab function normal test', function () {
    var controller = new rebar.mvc.TabsController();
    spyOn(controller, 'changeToPrevTab').andCallThrough();
    spyOn(controller, 'changeToNextTab').andCallThrough();
    expect(controller.changeToPrevTab).toThrow();
    expect(controller.getActiveIndex()).toBe(-1);
    expect(controller.changeToNextTab).toThrow();
    expect(controller.getActiveIndex()).toBe(-1);

    controller.appendTabView(new rebar.mvc.View(), true);
    expect(controller.changeToPrevTab).toThrow();
    expect(controller.getActiveIndex()).toBe(0);
    expect(controller.changeToNextTab).toThrow();
    expect(controller.getActiveIndex()).toBe(0);

    controller.appendTabView(new rebar.mvc.View());
    expect(controller.changeToPrevTab).toThrow();
    expect(controller.getActiveIndex()).toBe(0);
    controller.changeToNextTab();
    expect(controller.getActiveIndex()).toBe(1);
  });

  it('appendTab function remove tabs after active test', function () {
    var NewController = function () {
      rebar.mvc.TabsController.call(this);
    };
    goog.inherits(NewController, rebar.mvc.TabsController);
    NewController.prototype.removeTabsAfterActive = function () {
      return true;
    };

    var controller = new NewController();
    controller.appendTabView(new rebar.mvc.View(), true);
    var pageController = new rebar.mvc.ViewController();
    controller.appendTab(pageController);
    controller.appendTabView(new rebar.mvc.View(), true);
    expect(controller.getActiveIndex()).toBe(2);
    expect(goog.object.getKeys(controller.tabsMap_).length).toBe(2);
    expect(goog.object.getValues(controller.tabsMap_)).not.toContain(pageController);
  });
});

