/**
 * @fileoverview 定义一些常量
 *
 * @author hector<zzh-83@163.com>
 */
goog.provide('baidu.base.Const');

goog.require('goog.pubsub.PubSub');
goog.require('goog.userAgent');

/**
 * @type {goog.pubsub.PubSub}
 * @const
 */
baidu.base.pubSubInstance = new goog.pubsub.PubSub();

/**
 * @enum {string}
 */
baidu.base.PubSubEvents = {
    UpdateState: 'updateState',
    SetState: 'setState'
};

/**
 * @enum {string}
 */
baidu.base.DomConst = {
    AttrCheckerReg: 'data-reg',
    AttrCheckerErrMsg: 'data-error-msg',
    AttrCheckerErrId: 'data-error-id',
    ClsCheckerHasError: 'has-error',
    ClsCheckerErrMsg: 'checkerrmsgItem'
};

/**
 * 定义一些服务器的错误码，和phpbase中的对应
 * @enum
 */
baidu.base.ServerStatusCode = {
    SUCCESS: 0,
    ERROR: 1,
    INVALID_REQUEST_PARAM: 2,
    BACKEND_UNAVAILABLE: 3,
    BACKEND_BUSY: 4,
    BACKEND_ERROR: 5
};

/**
 * @return {string}
 * @private
 */
baidu.base.Const.getAniNamePrefix_ = function () {
    if (goog.userAgent.WEBKIT) {
        return 'webkit';
    }
    if (goog.userAgent.GECKO) {
        return 'moz';
    }
    if (goog.userAgent.IE) {
        return 'MS';
    }
    if (goog.userAgent.OPERA) {
        return 'o';
    }
    return '';
};

/**
 * @enum {string}
 */
baidu.base.Const.AnimationEvents = {
    AnimationStart: baidu.base.Const.getAniNamePrefix_() + 'AnimationStart',
    AnimationIteration: baidu.base.Const.getAniNamePrefix_() + 'AnimationIteration',
    AnimationEnd: baidu.base.Const.getAniNamePrefix_() + 'AnimationEnd'
};

/**
 * 有些其他插件对应的js(比如bootstrap以及semanticui对应的插件)不是会被全部包含的
 * 但是他们会引用公共的soy, 这样会导致对于常量的引用出现以来问题, 所以干脆定义在这里
 * @enum {string}
 */
baidu.base.Const.DomConst = {
    SEMANTICUI_SEARCHINPUT_ITEMS: 'suisinput'
};

