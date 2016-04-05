/**
 * @fileoverview paginationview.js的测试文件
 * @author zhangzhihong02
 */
goog.require('baidu.base.PaginationView');

describe('pagination-view.js test suite', function () {
    it('model test', function () {
        var view = new baidu.base.PaginationView(10);

        expect(view.getCurrentPage()).toBe(0);
        view.setCurrentInfo(2, 70);
        expect(view.getCurrentPage()).toBe(2);
        view.setCurrentInfo(2, 10);
        expect(view.getCurrentPage()).toBe(0);
    });
});

