/**
 * @fileoverview 第三方对象的工厂, 这样就可以避免使用这些对象的时候fecs报错
 *     不过一个确定是必须在extern里包含对应的externs文件, 不然closure的编译会报错
 *
 * @author zhangzhihong02
 */
/* eslint-disable no-undef */
goog.provide('baidu.base.Factory3rdParty');

/**
 * @param {jQuery} dom The dom.
 * @param {Object.<string, *>=} optOptions
 * @return ZeroClipboard
 */
baidu.base.Factory3rdParty.createZeroClipbord = function (dom, optOptions) {
    return new ZeroClipboard(dom, optOptions);
};

/**
 * @param {Element} elTextArea The text area element.
 * @param {Object.<string, *>} options The arguments.
 * @return {CodeMirror}
 */
baidu.base.Factory3rdParty.createCodeMirror = function (elTextArea, options) {
    return CodeMirror.fromTextArea(elTextArea, options);
};
