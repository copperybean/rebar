/**
 * @fileoverview 所有controller的基类
 * @author hector<zzh-83@163.com>
 */
goog.provide('baidu.base.BaseController');

goog.require('baidu.base.Const');

goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');

/**
 * MVC中控制器的基类。目前该类象征意义较大，
 * 主要提供了一些load相关的方法供子类覆盖。
 * @constructor
 * @extends {goog.events.EventTarget}
 */
baidu.base.BaseController = function () {
    goog.events.EventTarget.call(this);

    /**
     * @type {boolean}
     * @private
     */
    this.isControllerLoaded_ = false;

    /**
     * @type {boolean}
     * @private
     */
    this.isControllerInitialized_ = false;

    /**
     * @type {goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = null;
};
goog.inherits(baidu.base.BaseController, goog.events.EventTarget);

/**
 * @return {boolean}
 */
baidu.base.BaseController.prototype.isControllerLoaded = function () {
    return this.isControllerLoaded_;
};

/**
 * @return {boolean}
 * @protected
 */
baidu.base.BaseController.prototype.isControllerInitialized = function () {
    return this.isControllerInitialized_;
};

/**
 * 加载一个controller。controller和view都被设计成可以重复加载的，
 * 这样有利于实现页面切出和切入使用旧的实例，加快反应速度。
 * 子类可以覆盖该方法实现加载时的逻辑。
 * @protected
 */
baidu.base.BaseController.prototype.loadController = function () {
    if (this.isControllerLoaded_) {
        throw 'load a loaded controller';
    }
    if (!this.isControllerInitialized()) {
        this.initController();
    }
    this.isControllerLoaded_ = true;
};

/**
 * 重复加载一个controller，主要用来实现那种刷新当前页的数据的情况。
 * 典型的例子是在点击当前tab的标题的时候刷新当前tab的数据。
 * 子类只管覆盖该方法实现相应的刷新逻辑即可。
 * @protected
 */
baidu.base.BaseController.prototype.reloadController = function () {
    if (!this.isControllerLoaded_) {
        throw 'Reload a unloaded controller';
    }
};

/**
 * Called when the controller unloaded
 * @protected
 */
baidu.base.BaseController.prototype.unloadController = function () {
    if (!this.isControllerLoaded_) {
        throw 'unload an unloaded controller';
    }
    this.isControllerLoaded_ = false;
};

/**
 * 实现初始化逻辑的地方，该方法应该被保证只调用一次。
 * @protected
 */
baidu.base.BaseController.prototype.initController = function () {
    if (this.isControllerInitialized_) {
        throw 'initialize the controller muliti time';
    }
    this.isControllerInitialized_ = true;
};

/**
 * @override
 */
baidu.base.BaseController.prototype.disposeInternal = function () {
    if (this.isControllerLoaded_) {
        this.unloadController();
    }

    if (this.eventHandler_) {
        this.eventHandler_.dispose();
        this.eventHandler_ = null;
    }
    baidu.base.BaseController.superClass_.disposeInternal.call(this);
};

/**
 * 返回一个handler用来监听事件。
 * 用这个返回实例监听事件的好处是在类被dispose的时候（这个也主要由框架实现）
 * 会自动取消事件的监听。
 * @return {!goog.events.EventHandler} Event handler for this controller.
 * @protected
 */
baidu.base.BaseController.prototype.getHandler = function () {
    if (!this.eventHandler_) {
        this.eventHandler_ = new goog.events.EventHandler(this);
    }
    return this.eventHandler_;
};

