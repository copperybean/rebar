/**
 * @fileoverview tab页面的controller
 * @author hector<zzh-83@163.com>
 */
goog.provide('rebar.mvc.TabsController');

goog.require('rebar.mvc.BaseView');
goog.require('rebar.mvc.ViewController');

/**
 * 该类简单来说就是管理了一组ViewController，这一组ViewController
 * 任一时刻只有一个处于加载状态。为了方便使用，可以为每个ViewController
 * 提供一个名字。
 *
 * 最典型的场景是整个应用包含几个tab，每个tab都对应一个ViewController，
 * 那么点击一个tab，就切换到一个ViewController。
 *
 * 抽象一点的场景是没有可见的能点击tab，比如ls2.0中有个显示所有graph
 * 实例（默认是运行中的）的页面，点击其中一个的查看会进入graph实例的
 * 页面，再点击任一job的实例，会进入该job实例的页面。这一组切换逻辑是
 * 聚合的，可以抽象到一个TabsController的子类中。这样的TabsController
 * 只有逻辑，管理三个页面（每个页面任然由一个ViewController管理）。
 *
 * 注意该类也继承了Stateful接口（通过ViewController）。由于一般应用
 * 中一个tab都对应一个页面，所以通常需要将当前是哪个tab激活记录到应用
 * 状态中。注意应用的状态是通过rebar.model.StateModel记录的，那么要记录
 * 当前是哪个tab激活就应该在StateModel中增加一个key、value对，这里
 * value就是tab的name（在appendTab时指定），而key是通过getStateKey
 * 方法指定的。注意getStateKey的返回值和tab name都可能为空，那么任意
 * 一个为空的时候都不会将哪个tab激活的信息记录在应用状态中。
 *
 * @param {rebar.mvc.BaseView=} optTabsView 这个view通常的作用是展示
 *     tab按钮（如果有的话）并提供展示tab content的容器
 * @constructor
 * @extends {rebar.mvc.ViewController}
 */
rebar.mvc.TabsController = function (optTabsView) {
    rebar.mvc.ViewController.call(this, optTabsView);

    /**
     * @type {Object.<number, rebar.mvc.ViewController>}
     * @private
     */
    this.tabsMap_ = {};

    /**
     * @type {number}
     * @private
     */
    this.nextUnusedIndex_ = 0;

    /**
     * @type {Object.<string, number>}
     * @private
     */
    this.tabsNameToIndex_ = {};

    /**
     * @type {number}
     * @private
     */
    this.activeIndex_ = -1;
};
goog.inherits(rebar.mvc.TabsController, rebar.mvc.ViewController);

/**
 * 会递归加载管理的一组ViewController中处于激活状态的那个
 *
 * @override
 */
rebar.mvc.TabsController.prototype.loadController = function () {
    rebar.mvc.TabsController.superClass_.loadController.call(this);

    if (this.activeIndex_ >= 0) {
        this.tabsMap_[this.activeIndex_].loadController();
    } else if (this.initTabByName(
        this.getDefaultTabName(), new rebar.model.StateModel())) {
        this.changeToName(this.getDefaultTabName());
    }
};

/**
 * @override
 */
rebar.mvc.TabsController.prototype.unloadController = function () {
    rebar.mvc.TabsController.superClass_.unloadController.call(this);
    if (this.activeIndex_ >= 0) {
        this.tabsMap_[this.activeIndex_].unloadController();
    }
};

/**
 * 获取当前激活的index
 * @return {number} 如果没有激活的则返回-1
 */
rebar.mvc.TabsController.prototype.getActiveIndex = function () {
    return this.activeIndex_;
};

/**
 * 获取当前激活的ViewController的名字。该名字是在append时指定的。
 *
 * @return {string}
 */
rebar.mvc.TabsController.prototype.getActiveTabName = function () {
    if (this.activeIndex_ < 0) {
        return '';
    }
    for (var name in this.tabsNameToIndex_) {
        if (this.tabsNameToIndex_[name] === this.activeIndex_) {
            return name;
        }
    }
    return '';
};

/**
 * 添加一个tab的ViewController。
 *
 * @param {rebar.mvc.ViewController} viewController The view controller object.
 * @param {boolean=} optChangeTo 是否同时切换到这个tab，默认false
 * @param {string=} optName 可以同时给这个tab指定一个名字，要保证唯一性。
 * @return {number} The tab index corresponding to the appended view controller.
 */
rebar.mvc.TabsController.prototype.appendTab = function (
    viewController, optChangeTo, optName) {
    optName = optName || '';
    if (optName && goog.isNumber(this.tabsNameToIndex_[optName])) {
        throw 'Duplicate tab with name: ' + optName;
    }
    // 这段代码有些问题
    if (this.removeTabsAfterActive()) {
        for (var idx in this.tabsMap_) {
            if (idx > this.activeIndex_) {
                this.removeInactiveTab(idx - 0);
            }
        }
    }
    if (optName) {
        this.tabsNameToIndex_[optName] = this.nextUnusedIndex_;
    }
    this.tabsMap_[this.nextUnusedIndex_] = viewController;
    // 将ViewController串联起来
    viewController.setParentEventTarget(this);
    if (optChangeTo) {
        this.changeToTab(this.nextUnusedIndex_);
    }
    return this.nextUnusedIndex_++;
};

/**
 * @see appendTab
 * 由于该类只管理ViewController，但是有的情况下某个tab只需一个view，
 * 不需要controller逻辑。这里提供一个快捷方法，允许传入一个view，然后
 * 自动用一个默认的ViewController来包装，方便使用。
 *
 * @param {rebar.mvc.BaseView} view The view to be appended
 * @param {boolean=} optChangeTo Whether change to the view after append.
 * @param {string=} optName
 * @return {number} The tab index just appended.
 */
rebar.mvc.TabsController.prototype.appendTabView = function (view, optChangeTo, optName) {
    var viewController = new rebar.mvc.ViewController(view);
    return this.appendTab(viewController, optChangeTo, optName);
};

/**
 * Change active tab
 * @param {number=} tabIndex
 */
rebar.mvc.TabsController.prototype.changeToTab = function (tabIndex) {
    if (!goog.isNumber(tabIndex)) {
        tabIndex = -1;
    }
    if (tabIndex >= 0 && tabIndex === this.activeIndex_) {
        this.tabsMap_[this.activeIndex_].reloadController();
        return;
    }
    if (!this.tabsMap_[tabIndex]) {
        tabIndex = -1;
    }
    if (this.activeIndex_ >= 0) {
        this.tabsMap_[this.activeIndex_].getView().remove();
        if (this.isControllerLoaded()) {
            this.tabsMap_[this.activeIndex_].unloadController();
        }
    }
    var oldActiveIdx = this.activeIndex_;
    this.activeIndex_ = tabIndex;
    if (this.activeIndex_ >= 0) {
        this.getView().addSubView(this.tabsMap_[this.activeIndex_].getView());
        if (this.isControllerLoaded()) {
            this.tabsMap_[this.activeIndex_].loadController();
        }
    }
    if (this.autoRemoveInactive()
        && oldActiveIdx >= 0 && this.activeIndex_ !== oldActiveIdx) {
        this.removeInactiveTab(oldActiveIdx);
    }
};

/**
 * @see changeToTab
 * @see appendTabView
 * Change to a tab corresponding to a view
 *
 * @param {rebar.mvc.BaseView} view
 */
rebar.mvc.TabsController.prototype.changeToView = function (view) {
    for (var i in this.tabsMap_) {
        if (this.tabsMap_[i - 0].getView() === view) {
            this.changeToTab(i - 0);
            return;
        }
    }
    throw 'Invalid view';
};

/**
 * @see changeToTab
 * @see appendTab
 *
 * @param {string} name 如果再appendTab时指定了名字，那么可以通过名字激活tab。
 */
rebar.mvc.TabsController.prototype.changeToName = function (name) {
    var index = this.getTabIndexByName(name);
    if (!goog.isNumber(index)
        && !this.initTabByName(name, new rebar.model.StateModel())) {
        throw 'Invalid name';
    }
    this.changeToTab(this.getTabIndexByName(name));
};

/**
 * 切换到前一个页面。
 * 主要使用于管理的ViewController非常稳定的情况。比如初始化时就append
 * 了所有tab，那么这些tab对应的ViewController的顺序就是固定的，这样就
 * 可以切换到当前激活tab的前一个tab。
 */
rebar.mvc.TabsController.prototype.changeToPrevTab = function () {
    var activeIdx = this.getActiveIndex();
    var indice = goog.object.getKeys(this.tabsMap_);
    var pos = indice.indexOf(activeIdx + '');
    if (pos <= 0) {
        throw 'Can not change to previous tab';
    }
    this.changeToTab(indice[pos - 1] - 0);
};

/**
 * @see changeToPrevTab
 * 切换到后一个页面
 */
rebar.mvc.TabsController.prototype.changeToNextTab = function () {
    var activeIdx = this.getActiveIndex();
    var indice = goog.object.getKeys(this.tabsMap_);
    var pos = indice.indexOf(activeIdx + '');
    if (pos < 0 || pos === indice.length - 1) {
        throw 'Can not change to next tab';
    }
    this.changeToTab(indice[pos + 1] - 0);
};

/**
 * 更新非激活状态下的tab
 * @param {number} index
 * @param {rebar.mvc.ViewController} controller
 * @return {boolean}
 */
rebar.mvc.TabsController.prototype.updateInactiveTab = function (index, controller) {
    if (this.getActiveIndex() === index || !this.tabsMap_[index]) {
        return false;
    }
    this.tabsMap_[index] = controller;
    return true;
};

/**
 * 获取当前状态，注意当前激活tab必须有名字并且getStateKey被覆盖并返回非空
 * 值才会将激活tab的信息记录到状态中。
 *
 * @override
 */
rebar.mvc.TabsController.prototype.getState = function () {
    var ret = rebar.mvc.TabsController.superClass_.getState.call(this);
    if (this.getActiveIndex() >= 0) {
        ret.mergeState(this.getTab(this.getActiveIndex()).getState());
    }
    var activeTabName = this.getActiveTabName();
    if (this.getStateKey() && activeTabName) {
        ret.setStateItem(this.getStateKey(), activeTabName);
    }
    return ret;
};

/**
 * 设置状态，恢复到状体中对应的激活的tab（如果有对应数据的话）
 *
 * @override
 */
rebar.mvc.TabsController.prototype.setState = function (state) {
    if (!rebar.mvc.TabsController.superClass_.setState.call(this, state)) {
        return false;
    }

    if (!this.getStateKey()) {
        return true; // 这种情况说明该类不支持state
    }
    var tabName = state.getStateItem(this.getStateKey());
    if (!tabName && this.getActiveIndex() >= 0) {
        // 这种情况说明状态数据中不包含当前tab，那么不改变已有状态
        // 这样做的优点是如果当前controller有子tab，但是state中没有
        // 指定切换到那个的话，可以看到之前打开的tab
        return true;
    }
    tabName = tabName || this.getDefaultTabName();
    if (!this.initTabByName(tabName, state)) {
        return false;
    }

    var ret = true;
    var tab = this.getTabByName(tabName);
    if (tab) {
        // 允许切换到空tab
        ret = tab.setState(state);
    }
    if (this.getActiveTabName() !== tabName) {
        this.changeToName(tabName);
    }
    return ret;
};

/**
 * @override
 */
rebar.mvc.TabsController.prototype.getNavigatePaths = function () {
    var stateKey = this.getStateKey();
    if (stateKey) {
        var navPaths = this.getActiveTab().getNavigatePaths();
        for (var i = 0; i < navPaths.length; ++i) {
            navPaths[i].stateModel.setStateItem(stateKey, this.getActiveTabName());
        }
        return navPaths;
    }
    return rebar.mvc.TabsController.superClass_.getNavigatePaths();
};

/**
 * 由于状态是以rebar.model.StateModel类来记录的，所以要将当前激活的tab name
 * 记录在StateModel里的话，就需要一个key、value对。value是tab name，那么
 * 该方法返回key的值。如果该方法返回空字符串的话，就不会将当前激活的tab name
 * 记录到StateModel里，这时我们就可以说该TabsController是无状态的。
 *
 * @return {string}
 * @protected
 */
rebar.mvc.TabsController.prototype.getStateKey = function () {
    return '';
};

/**
 * 在load时还没有激活tab（通常是第一次load）或者设置state时对应state key
 * 的tab name是空的情况下，如果期望加载一个默认的tab，那么就重载该方法，
 * 来返回一个默认的tab name。
 * @return {string}
 * @protected
 */
rebar.mvc.TabsController.prototype.getDefaultTabName = function () {
    return '';
};

/**
 * 初始化tab所对应的ViewControllers可以分两种情况。第一种，在构造方法
 * 或者initController方法中一次性的初始化所有的tab对应的ViewController；
 * 第二种，就是当需要加载某个tab name对应的ViewController的时候动态加载。
 * 该方法用来支持第二种情况。一般是在setState的时候发现state key对应的
 * ViewController没有就调用该方法来加载，这时会一般会传入有意义的state。
 *
 * @param {string} tabName 初始化该name对应的tab
 * @param {rebar.model.StateModel} state
 * @return {boolean} 初始化成功返回true，否则返回false。
 * @protected
 */
rebar.mvc.TabsController.prototype.initTabByName = function (tabName, state) {
    if (goog.isNumber(this.getTabIndexByName(tabName))) {
        return true;
    }
    return false;
};

/**
 * @param {number} idx
 * @return {rebar.mvc.ViewController}
 * @protected
 */
rebar.mvc.TabsController.prototype.getTab = function (idx) {
    return this.tabsMap_[idx];
};

/**
 * @param {string} name
 * @return {?rebar.mvc.ViewController}
 * @protected
 */
rebar.mvc.TabsController.prototype.getTabByName = function (name) {
    var idx = this.getTabIndexByName(name);
    if (goog.isNumber(idx)) {
        return this.tabsMap_[idx];
    }
    return null;
};

/**
 * @return {rebar.mvc.ViewController}
 * @protected
 */
rebar.mvc.TabsController.prototype.getActiveTab = function () {
    return this.tabsMap_[this.activeIndex_];
};

/**
 * @param {string} name
 * @return {number|undefined}
 * @protected
 */
rebar.mvc.TabsController.prototype.getTabIndexByName = function (name) {
    return this.tabsNameToIndex_[name];
};

/**
 * @param {number} index
 * @return {string|undefined}
 */
rebar.mvc.TabsController.prototype.getTabNameByIndex = function (index) {
    for (var name in this.tabsNameToIndex_) {
        if (this.tabsNameToIndex_[name] === index) {
            return name;
        }
    }
    return undefined;
};

/**
 * 当append新的tab时，是否删除激活tab之后的tab（这样可以自动删掉使用过的），
 * 目前实用性较小。
 *
 * @return {boolean}
 * @protected
 */
rebar.mvc.TabsController.prototype.removeTabsAfterActive = function () {
    return false;
};

/**
 * 是否自动删掉非激活状态的tab，这样的好处是下次切换到那个tab的时候需要
 * 重新加载，这样肯定不会有数据不一致的问题。
 * @return {boolean}
 * @protected
 */
rebar.mvc.TabsController.prototype.autoRemoveInactive = function () {
    return false;
};

/**
 * 删除一个非激活的tab
 * @param {number} idx
 * @return {rebar.mvc.ViewController} 返回删除的controller
 * @protected
 */
rebar.mvc.TabsController.prototype.removeInactiveTab = function (idx) {
    if (!this.tabsMap_[idx] || idx === this.activeIndex_) {
        throw 'Invalid index';
    }
    delete this.tabsNameToIndex_[this.getTabNameByIndex(idx) || ''];
    var ret = this.tabsMap_[idx];
    this.tabsMap_[idx].dispose();
    delete this.tabsMap_[idx];
    return ret;
};

/**
 * @param {string} tabName
 * @protected
 */
rebar.mvc.TabsController.prototype.removeInactiveName = function (tabName) {
    if (goog.isNumber(this.getTabIndexByName(tabName))) {
        this.removeInactiveTab(this.getTabIndexByName(tabName) - 0);
    }
};

