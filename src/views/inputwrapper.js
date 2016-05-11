/**
 * @author hector<zzh-83@163.com>
 *
 * @file 对input在api中没支持的一些功能的包装
 */
goog.provide('baidu.base.InputWrapper');

goog.require('baidu.base.BaseView');

/**
 * @param {number=} optChangeUpdateInterval
 *     用户输入时触发更新事件的时间间隔，设为零或负值不触发
 * @constructor
 * @extends {baidu.base.BaseView}
 */
baidu.base.InputWrapper = function (optChangeUpdateInterval) {
    baidu.base.BaseView.call(this);

    /**
     * @type {goog.async.Delay}
     * @private
     */
    this.inputDelay_ = this.getInputDelay_(optChangeUpdateInterval);
};
goog.inherits(baidu.base.InputWrapper, baidu.base.BaseView);

/**
 * @enum {string}
 */
baidu.base.InputWrapper.Events = {
    CHANGE_UPDATE: 'change'
};

/**
 * @param {number=} optInterval The interval
 * @return {goog.async.Delay}
 * @private
 */
baidu.base.InputWrapper.prototype.getInputDelay_ = function (optInterval) {
    if (goog.isNumber(optInterval) && optInterval <= 0) {
        return null;
    }
    return new goog.async.Delay(function () {
        this.dispatchEvent(baidu.base.InputWrapper.Events.CHANGE_UPDATE);
    }, optInterval || 500, this);
};

/**
 * @override
 */
baidu.base.InputWrapper.prototype.enterDocument = function () {
    baidu.base.InputWrapper.superClass_.enterDocument.call(this);

    this.listenInputChange_();
};

/**
 * @private
 */
baidu.base.InputWrapper.prototype.listenInputChange_ = function () {
    if (!this.inputDelay_) {
        return;
    }
    var elInput = this.getElement();
    var startUpdateDelay = function () {
        this.inputDelay_.isActive() || this.inputDelay_.start();
    };
    var listenKeyup = function () {
        this.getHandler().listen(elInput,
                                 goog.events.EventType.KEYUP,
                                 startUpdateDelay);
    };
    var onStartComposition = function () {
        this.inputDelay_.stop();
        this.getHandler().unlisten(elInput,
                                   goog.events.EventType.KEYUP,
                                   startUpdateDelay);
    };
    var onEndComposition = function () {
        listenKeyup.call(this);
        startUpdateDelay.call(this);
    };

    listenKeyup.call(this);
    this.getHandler().listen(elInput,
                             goog.events.EventType.COMPOSITIONSTART,
                             onStartComposition);
    this.getHandler().listen(elInput,
                             goog.events.EventType.COMPOSITIONEND,
                             onEndComposition);
};

/**
 * @override
 */
baidu.base.InputWrapper.prototype.buildDom = function () {
    return '<input>';
};
