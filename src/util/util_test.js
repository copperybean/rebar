/**
 * @fileoverview util.js的测试文件
 *
 * @author zhangzhihong02
 */
goog.require('rebar.util');

describe('util.js test suite', function () {
    it('searchUpAttr test', function () {
        var domStr = '<div attr="a"><span id="id">hello</span></div>';
        var dom = rebar.util.htmlToElement(domStr);
        var foundVal = null;
        rebar.util.searchUpAttr(dom.querySelector('#id'), 'attr', function (val, d) {
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

    it('timeDes test', function () {
        expect(rebar.util.timeDes(0)).toBe('0秒');
        expect(rebar.util.timeDes(10)).toBe('0秒');
        expect(rebar.util.timeDes(999)).toBe('0秒');
        expect(rebar.util.timeDes(1000)).toBe('1秒');
        expect(rebar.util.timeDes(1001)).toBe('1秒');
        expect(rebar.util.timeDes(59 * 1000)).toBe('59秒');
        expect(rebar.util.timeDes(60 * 1000)).toBe('1分');
        expect(rebar.util.timeDes(61 * 1000)).toBe('1分1秒');
        expect(rebar.util.timeDes(3599 * 1000)).toBe('59分59秒');
        expect(rebar.util.timeDes(3600 * 1000)).toBe('1小时');
        expect(rebar.util.timeDes(3601 * 1000)).toBe('1小时');
        expect(rebar.util.timeDes(3661 * 1000)).toBe('1小时1分');
        expect(rebar.util.timeDes(24 * 3600 * 1000)).toBe('1天');
        expect(rebar.util.timeDes(150 * 24 * 3600 * 1000)).toBe('150天');

        expect(rebar.util.timeDes(10, rebar.util.TimeUnit.MilliSecond)).toBe('10毫秒');
        var time = 150 * 24 * 3600 * 1000 + 11 * 3600 * 1000 + 24 * 60 * 1000 + 5000;
        expect(rebar.util.timeDes(time, rebar.util.TimeUnit.MilliSecond, 3))
          .toBe('150天11小时24分');
    });

    it('htmlToElement test', function () {
        var el = rebar.util.htmlToElement('<div></div>');
        expect(el.outerHTML).toBe('<div></div>');

        el = rebar.util.htmlToElement('<span></span><a></a>');
        expect(el.outerHTML).toBe('<div><span></span><a></a></div>');
    });

    it('attrSelector', function () {
        expect(rebar.util.attrSelector('a', 'b')).toBe('[a="b"]');
    });
});
