/**
 * @fileoverview tabscontroller.js的测试文件
 *
 * @author zhangzhihong02
 */
goog.require('baidu.base.TabsController');

goog.require('goog.object');

describe('tabs-controller.js test suite', function () {
    it('loadController and unloadController function normal test', function () {
        var controller = new baidu.base.TabsController();
        var pageController = new baidu.base.ViewController();
        controller.appendTab(pageController, true);
        spyOn(pageController, 'loadController');
        spyOn(pageController, 'unloadController');
        controller.loadController();
        expect(pageController.loadController).toHaveBeenCalled();
        controller.unloadController();
        expect(pageController.unloadController).toHaveBeenCalled();
    });

    it('appendTab function normal test', function () {
        var controller = new baidu.base.TabsController();
        controller.appendTab(new baidu.base.ViewController());
        expect(goog.object.getKeys(controller.tabsMap_).length).toBe(1);
        expect(controller.getActiveIndex()).toBe(-1);
        controller.appendTab(new baidu.base.ViewController(), true);
        expect(goog.object.getKeys(controller.tabsMap_).length).toBe(2);
        expect(controller.getActiveIndex()).toBe(1);
    });

    it('changeToTab and changeToView function normal test', function () {
        var view = new baidu.base.BaseView();
        view.render();
        var controller = new baidu.base.TabsController(view);
        expect(controller.changeToTab).toThrow();
        var pageController = new baidu.base.ViewController();
        spyOn(pageController, 'loadController').andCallThrough();
        controller.appendTab(pageController, true);
        expect(pageController.loadController).not.toHaveBeenCalled();
        controller.loadController();

        spyOn(pageController, 'unloadController').andCallThrough();
        var anotherPageController = new baidu.base.ViewController();
        spyOn(anotherPageController, 'loadController').andCallThrough();
        controller.appendTab(anotherPageController, true);
        expect(pageController.unloadController).toHaveBeenCalled();
        expect(pageController.getView().getParent()).toBeNull();
        expect(anotherPageController.loadController).toHaveBeenCalled();

        controller.changeToView(pageController.getView());
        expect(controller.getActiveIndex()).toBe(0);
    });

    it('changeToPrevTab and changeToNextTab function normal test', function () {
        var controller = new baidu.base.TabsController();
        spyOn(controller, 'changeToPrevTab').andCallThrough();
        spyOn(controller, 'changeToNextTab').andCallThrough();
        expect(controller.changeToPrevTab).toThrow();
        expect(controller.getActiveIndex()).toBe(-1);
        expect(controller.changeToNextTab).toThrow();
        expect(controller.getActiveIndex()).toBe(-1);

        controller.appendTabView(new baidu.base.BaseView(), true);
        expect(controller.changeToPrevTab).toThrow();
        expect(controller.getActiveIndex()).toBe(0);
        expect(controller.changeToNextTab).toThrow();
        expect(controller.getActiveIndex()).toBe(0);

        controller.appendTabView(new baidu.base.BaseView());
        expect(controller.changeToPrevTab).toThrow();
        expect(controller.getActiveIndex()).toBe(0);
        controller.changeToNextTab();
        expect(controller.getActiveIndex()).toBe(1);
    });

    it('appendTab function remove tabs after active test', function () {
        var NewController = function () {
            baidu.base.TabsController.call(this);
        };
        goog.inherits(NewController, baidu.base.TabsController);
        NewController.prototype.removeTabsAfterActive = function () {
            return true;
        };

        var controller = new NewController();
        controller.appendTabView(new baidu.base.BaseView(), true);
        var pageController = new baidu.base.ViewController();
        controller.appendTab(pageController);
        controller.appendTabView(new baidu.base.BaseView(), true);
        expect(controller.getActiveIndex()).toBe(2);
        expect(goog.object.getKeys(controller.tabsMap_).length).toBe(2);
        expect(goog.object.getValues(controller.tabsMap_)).not.toContain(pageController);
    });
});

