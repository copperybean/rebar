/**
 * @fileoverview 定义一些常量
 *
 * @author hector<zzh-83@163.com>
 */
goog.provide('rebar.consts');

goog.require('goog.pubsub.PubSub');
goog.require('goog.userAgent');

/**
 * @type {goog.pubsub.PubSub}
 * @const
 */
rebar.consts.pubSubInstance = new goog.pubsub.PubSub();

/**
 * @enum {string}
 */
rebar.consts.PubSubEvents = {
    UpdateState: 'updateState',
    SetState: 'setState'
};

/**
 * @enum {string}
 */
rebar.consts.DomConst = {
    AttrCheckerReg: 'data-reg',
    AttrCheckerErrMsg: 'data-error-msg',
    AttrCheckerErrId: 'data-error-id',
    ClsCheckerHasError: 'has-error',
    ClsCheckerErrMsg: 'checkerrmsgItem',

    SEMANTICUI_SEARCHINPUT_ITEMS: 'suisinput'
};

/**
 * @return {string}
 * @private
 */
rebar.consts.getAniNamePrefix_ = function () {
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
rebar.consts.AnimationEvents = {
    AnimationStart: rebar.consts.getAniNamePrefix_() + 'AnimationStart',
    AnimationIteration: rebar.consts.getAniNamePrefix_() + 'AnimationIteration',
    AnimationEnd: rebar.consts.getAniNamePrefix_() + 'AnimationEnd'
};

