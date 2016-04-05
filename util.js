/**
 * @fileoverview 工具集
 * @author wangshouchuang
 */
goog.provide('baidu.base.util');

goog.require('baidu.base.Const');

goog.require('goog.crypt');
goog.require('goog.crypt.Md5');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.i18n.DateTimeParse');
goog.require('goog.style');
goog.require('goog.ui.IdGenerator');

/**
 * @param {baidu.base.StateModel} state The state to be set.
 */
baidu.base.util.setGlobalState = function (state) {
    baidu.base.pubSubInstance.publish(baidu.base.PubSubEvents.SetState, state);
};

/**
 * 检查一个值是否表示了一个有效的数组
 * @param {*} val
 * @return {boolean}
 */
baidu.base.util.isNonemptyNum = function (val) {
    var formatedNum = /** @type {number} */(val) - 0;
    return !!(goog.isNumber(val) || (val && !isNaN(formatedNum)));
};

/**
 * 沿着一个dom元素遍历它的父元素（包含它自己）的dom属性
 * @param {Element} dom
 * @param {string} attr
 * @param {function (string, Element):boolean} callback 回调函数，返回true表示继续遍历，否则遍历停止
 */
baidu.base.util.searchUpAttr = function (dom, attr, callback) {
    var checkProc = function (el) {
        var val = el.getAttribute(attr);
        return callback.call(null, val, el);
    };
    if (dom.hasAttribute(attr) && !checkProc(dom)) {
        return;
    }
    for (var p = dom.parentElement; p; p = p.parentElement) {
        if (p.hasAttribute(attr) && !checkProc(p)) {
            break;
        }
    }
};

/**
 * 沿着上方找到第一个拥有attr的值
 * @param {Element} dom The element.
 * @param {string} attr The attr
 * @return {Element}
 */
baidu.base.util.getUpwardsAttrDom = function (dom, attr) {
    var ret = null;
    baidu.base.util.searchUpAttr(dom, attr, function (val, el) {
        ret = el;
        return false;
    });
    return ret;
};

/**
 * Check whether the bottom of an element is visible
 * @param {Element} element
 * @return {boolean}
 */
baidu.base.util.isElBottomVisible = function (element) {
    var pos = goog.style.getPageOffset(element);
    var visibleRect = goog.style.getVisibleRectForElement(element);
    var size = goog.style.getSize(element);
    return visibleRect.bottom - pos.y >= size.height;
};

/**
 * 将毫秒格式的时间格式化为人容易阅读的形式
 * @param {number} milliSec
 * @param {number=} minUnit 最小单位，默认是秒
 * @param {number.<baidu.base.util.TimeUnit>=} unitNumberKeep 保留的单位数，默认2
 * @return {string}
 */
baidu.base.util.timeDes = function (milliSec, minUnit, unitNumberKeep) {
    minUnit = goog.isNumber(minUnit) ? minUnit : baidu.base.util.TimeUnit.Second;
    unitNumberKeep = goog.isNumber(unitNumberKeep) ? unitNumberKeep : 2;
    var unitScale = [1000, 60, 60, 24, milliSec + 1];
    var unitDes = ['毫秒', '秒', '分', '小时', '天'];

    var digits = [milliSec];
    for (var i = 0; i < unitScale.length && digits[i] >= unitScale[i]; ++i) {
        digits.push(Math.floor(digits[i] / unitScale[i]));
        digits[i] %= unitScale[i];
    }
    var ret = '';
    for (i = Math.max(minUnit, digits.length - unitNumberKeep); i < digits.length; ++i) {
        if (digits[i] === 0 && !ret) {
            continue;
        }
        ret = digits[i] + unitDes[i] + ret;
    }
    return ret || (0 + unitDes[minUnit]);
};

/**
 * 值定义为从0起逐渐增加1
 * @enum
 */
baidu.base.util.TimeUnit = {
    MilliSecond: 0,
    Second: 1,
    Minute: 2,
    Hour: 3,
    Day: 4
};

/**
 * 将一段html字符串转换为对应的Element.
 * @param {string=} html
 * @return {Element}
 */
baidu.base.util.htmlToElement = function (html) {
    var node = goog.dom.htmlToDocumentFragment(html || '');
    if (node.nodeType === goog.dom.NodeType.ELEMENT) {
        return /** @type {Element} */(node);
    }
    var el = goog.dom.createDom(goog.dom.TagName.DIV);
    el.appendChild(node);
    return el;
};

/**
 * 生成attribute selector
 * @param {string} attr
 * @param {string=} value
 * @return {string}
 */
baidu.base.util.attrSelector = function (attr, value) {
    return '[' + attr + (goog.isDef(value) ? '="' + value + '"' : '') + ']';
};

/**
 * 需给要检查输入的元素添加值为检查正则表达式的属性
 * baidu.base.DomConst.AttrCheckerReg（data-reg）或者传入检查正则表达式。
 * baidu.base.DomConst.AttrCheckerErrMsg（data-error-msg）
 * 属性的值为检查失败时的错误提示。
 * baidu.base.DomConst.AttrCheckerErrId（data-error-id）
 * 属性指定显示错误提示的元素的id。
 * 推荐在soy里用baidu.base.DomConst里定义的枚举而不是直接使用字符串。
 *
 * @param {Element} inputDom
 * @param {function (Element)=} optAdditionalChecker 可以传入一个检查函数。
 * @param {string=} optRegStr
 * @return {boolean}
 */
baidu.base.util.checkInput = function (
    inputDom, optAdditionalChecker, optRegStr) {
    // 校验
    var reg = optRegStr
        || inputDom.getAttribute(baidu.base.DomConst.AttrCheckerReg);
    if (!reg) {
        return true;
    }
    var input = inputDom.value || '';
    var checkReg = new RegExp(reg);

    // 显示
    var pass = checkReg.test(input);
    var additionalCheckerPassed = true;
    if (optAdditionalChecker && pass) {
        additionalCheckerPassed = optAdditionalChecker.call(window, inputDom);
        pass = pass && additionalCheckerPassed;
    }

    if (pass) {
        baidu.base.util.removeError(inputDom);
    } else {
        if (additionalCheckerPassed) {
            var msg = inputDom.getAttribute(baidu.base.DomConst.AttrCheckerErrMsg);
            var errorTip = msg || inputDom.placeholder;
            baidu.base.util.addError(inputDom, errorTip, true);
        }
        inputDom.focus();
    }

    return pass;
};

/**
 * @type {Object.<string, boolean>}
 * @private
 */
baidu.base.util.inputErrorAvoidClasseSet_ = {};

/**
 * @param {Array.<string>} classes The classes to avoid.
 */
baidu.base.util.addInputErrorAvoidClassSet = function (classes) {
    goog.array.forEach(classes, function (el) {
        baidu.base.util.inputErrorAvoidClasseSet_[el] = true;
    });
};

/**
 * @param {Element} el The input element to render error.
 * @return {Element}
 * @private
 */
baidu.base.util.getInputErrorDom_ = function (el) {
    var clsChecker = function (c) {
        return !!baidu.base.util.inputErrorAvoidClasseSet_[c];
    };
    for (; el; el = el.parentElement) {
        if (goog.dom.TagName.DIV === el.tagName
            && !goog.array.some(goog.dom.classes.get(el), clsChecker)) {
            return el;
        }
    }
    return null;
};

/**
 * 删除由于checkInput检查失败显示的错误信息。
 * @param {Element} inputDom
 */
baidu.base.util.removeError = function (inputDom) {
    var parentDiv = baidu.base.util.getInputErrorDom_(inputDom);
    if (!parentDiv) {
        return;
    }
    var id = inputDom.getAttribute(baidu.base.DomConst.AttrCheckerErrId);
    var errorEl = document.getElementById(id);
    errorEl && errorEl.remove();
    inputDom.removeAttribute(baidu.base.DomConst.AttrCheckerErrId);
    if (!goog.dom.getElementByClass(
        baidu.base.DomConst.ClsCheckerErrMsg, parentDiv)) {
        goog.dom.classes.remove(parentDiv, baidu.base.DomConst.ClsCheckerHasError);
    }
};

/**
 * checkInput检查失败的时候会调用该方法显示错误信息，也可以手动调用。
 * @param {Element} inputDom
 * @param {string} errorTip
 * @param {boolean=} optIsOverwrite
 */
baidu.base.util.addError = function (inputDom, errorTip, optIsOverwrite) {
    var id = inputDom.getAttribute(baidu.base.DomConst.AttrCheckerErrId);
    var el = null;
    var parentDiv = baidu.base.util.getInputErrorDom_(inputDom);

    if (!parentDiv) {
        return;
    }
    if (id && !optIsOverwrite) {
        return;
    } else if (id) {
        document.getElementById(id).remove();
    }

    goog.dom.classes.add(parentDiv, baidu.base.DomConst.ClsCheckerHasError);
    id = goog.ui.IdGenerator.getInstance().getNextUniqueId();
    el = goog.dom.createDom(goog.dom.TagName.SPAN,
                            baidu.base.DomConst.ClsCheckerErrMsg,
                            errorTip);
    el.id = id;
    inputDom.setAttribute(baidu.base.DomConst.AttrCheckerErrId, id);
    if (!errorTip) {
        goog.style.showElement(el, false);
    }
    var refEl = inputDom;
    while (refEl.parentElement !== parentDiv) {
        refEl = refEl.parentElement;
    }
    goog.dom.insertSiblingAfter(el, refEl);
};

/**
 * @param {Element} scrollDom
 * @param {number=} bottomDiff
 * @return {boolean}
 */
baidu.base.util.scrolledToBottom = function (scrollDom, bottomDiff) {
    return !!scrollDom
        && (scrollDom.scrollTop + goog.style.getSize(scrollDom).height
        - (bottomDiff || 0) >= scrollDom.scrollHeight);
};

/**
 * @param {string} dateStr
 * @param {string=} format
 * @return {number}
 */
baidu.base.util.dateStrToSeconds = function (dateStr, format) {
    var date = new Date();
    var parser = new goog.i18n.DateTimeParse(format || 'y-MM-dd HH:mm:ss');
    parser.parse(dateStr, date);
    return Math.floor(date.getTime() / 1000);
};

/**
 * @param {number} secondsTimestamp
 * @param {string=} format
 * @return {string}
 */
baidu.base.util.secondsToDateStr = function (secondsTimestamp, format) {
    var formatter = new goog.i18n.DateTimeFormat(format || 'y-MM-dd HH:mm:ss');
    return formatter.format(new Date(secondsTimestamp * 1000));
};

/**
 * Escape string for mysql, copied from following link:
 * http://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly
 * @param {string} str
 * @return {string}
 */
baidu.base.util.mysqlEscapeString = function (str) {
    return str.replace(/[\u0000\u0008\u0009\u001a\n\r"'\\\%]/g, function (c) {
        switch (c) {
            case '\u0000':
                return '\\0';
            case '\u0008':
                return '\\b';
            case '\u0009':
                return '\\t';
            case '\u001a':
                return '\\z';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\'':
            case '"':
            case '\\':
            case '%':
                return '\\' + c;  // prepends a backslash to backslash, percent,
                                    // and double/single quotes
        }
    });
};

/**
 * @param {string} str
 * @param {string=} query
 */
baidu.base.util.emphasizeQuery = function (str, query) {
    if (!query) {
        return str;
    }
    var reg = new RegExp('(' + goog.string.regExpEscape(query) + ')', 'i');
    var replaceStr = '<em>$1</em>';
    return str.replace(reg, replaceStr);
};

/**
 * @param {string} str
 * @return {string}
 */
baidu.base.util.hexMd5 = function (str) {
    var md5 = new goog.crypt.Md5();
    md5.update(str);
    return goog.crypt.byteArrayToHex(md5.digest());
};

/**
 * 获取url的query参数并得到一个map,可以只取指定的key
 * @param {string} url The url.
 * @param {Array.<string>=} optKeys The optinal keys
 * @param {Array.<string>=} optCookieKeys 可以同时在cookie里也进行搜索
 *     如果不传,就和url param用一样的key。优先使用url参数里的值
 * @return {Object.<string, string>}
 */
baidu.base.util.getUrlParamMap = function (url, optKeys, optCookieKeys) {
    var uri = new goog.Uri(url);
    var queryData = uri.getQueryData();
    var ret = {};

    var cookieKeys = optCookieKeys || optKeys || [];
    goog.array.forEach(cookieKeys, function (key) {
        var cookieVal = baidu.base.cookie.get(key);
        if (cookieVal) {
            ret[key] = cookieVal;
        }
    });

    if (optKeys) {
        queryData.filterKeys(optKeys);
    }
    var keys = queryData.getKeys();
    goog.array.forEach(keys, function (k) {
        ret[k] = queryData.get(k);
    });
    return ret;
};

/**
 * Append path component.
 * @param {goog.Uri} uri The uri.
 * @param {Array.<string>} paths The paths
 */
baidu.base.util.appendPath = function (uri, paths) {
    var uriPath = uri.getPath();
    goog.array.forEach(paths, function (p) {
        uriPath = goog.uri.utils.appendPath(uriPath, p);
    });
    uri.setPath(uriPath);
};

/**
 * get delta time string between two timestamp.
 * @param {Date} startDate start
 * @param {Date} toDate to
 * @return {string} result
 */
baidu.base.util.generateTimeDeltaString = function (startDate, toDate) {
    var deltaTime = Math.abs(toDate - startDate);
    return baidu.base.util.timeDes(deltaTime, baidu.base.util.TimeUnit.Second);
};

/**
 * format size
 * @param {number} size size
 * @param {string} type type
 * @return {string} result result
 */
baidu.base.util.changeNumberTo = function (size, type) {
    switch (type) {
        case baidu.base.util.SizeUnit.SIZE_FORMAT_G:
            return (size / (1000 * 1000 * 1000)) + type;
        case baidu.base.util.SizeUnit.SIZE_FORMAT_M:
            return (size / (1000 * 1000)) + type;
        case baidu.base.util.SizeUnit.SIZE_FORMAT_K:
            return (size / (1000)) + type;
        case baidu.base.util.SizeUnit.SIZE_FORMAT_B:
            return size + type;
    }
    return size + '';
};


/**
 * @enum {string}
 */
baidu.base.util.SizeUnit = {
    SIZE_FORMAT_B: 'B',
    SIZE_FORMAT_K: 'K',
    SIZE_FORMAT_M: 'M',
    SIZE_FORMAT_G: 'G'
};
