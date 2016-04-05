/**
 * @fileoverview basecontroller.js的测试文件
 *
 * @author zhangzhihong02
 */
goog.require('baidu.base.BaseController');

describe('base-controller.js test suite', function () {
    it('loadController function normal test', function () {
        var controller = new baidu.base.BaseController();
        expect(controller.isControllerLoaded()).toBeFalsy();
        spyOn(controller, 'initController');
        controller.loadController();
        expect(controller.initController).toHaveBeenCalled();
        expect(controller.isControllerLoaded()).toBeTruthy();
        expect(controller.loadController).toThrow();
    });

    it('unloadController function normal test', function () {
        var controller = new baidu.base.BaseController();
        expect(controller.unloadController).toThrow();
        controller.loadController();
        controller.unloadController();
        expect(controller.isControllerLoaded()).toBeFalsy();
        expect(controller.unloadController).toThrow();
    });

    it('disposeInternal function normal test', function () {
        var controller = new baidu.base.BaseController();
        controller.loadController();
        spyOn(controller, 'unloadController');
        controller.disposeInternal();
        expect(controller.unloadController).toHaveBeenCalled();
    });
});

