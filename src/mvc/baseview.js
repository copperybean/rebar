/**
 * @fileoverview 所有view继承此类
 * @author hector<zzh-83@163.com>
 */
/* jshint -W069 */
/* eslint-disable fecs-dot-notation */
/* eslint-disable new-cap */
goog.provide('rebar.mvc.BaseView');

goog.require('rebar.consts');
goog.require('rebar.util.MessageBox');
goog.require('rebar.model.Stateful');
goog.require('rebar.util');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.ui.Component');
goog.require('goog.ui.IdGenerator');
goog.require('goog.ui.Tooltip');

/**
 * 设计为MVC中所有view的基类，主要提供一些常用功能，以及重复加载机制。
 * 由于基于浏览器的应用页面的切换是常用的功能，
 * 切出后将实例保留在内存中，并解绑事件，等切入时重新绑定事件。
 * 这样就会响应很快，有很好的用户体验。
 *
 * @param {boolean=} optRenderDomWithIdPrefix see method renderDomWithIdPrefix,.
 * @constructor
 * @extends {goog.ui.Component}
 * @implements {rebar.model.Stateful}
 */
rebar.mvc.BaseView = function (optRenderDomWithIdPrefix) {
    goog.ui.Component.call(this);

    /**
     * 起这么长的名字是怕和子类冲突
     * @type {rebar.mvc.BaseView.Settings}
     * @private
     */
    this.baseViewSettings_ = new rebar.mvc.BaseView.Settings(optRenderDomWithIdPrefix);

    /**
     * 这样生成的id是一个有效的标识符
     * @type {string}
     * @private
     */
    this.viewId_ = 'b' + rebar.mvc.BaseView.idCounter_++ + '_';

    /**
     * @type {boolean}
     * @private
     */
    this.viewInitialized_ = false;

    /**
     * @type {Array.<goog.ui.Tooltip>}
     * @private
     */
    this.tooltips_ = [];

    /**
     * @type {Object.<string, rebar.mvc.BaseInput>}
     * @private
     */
    this._inputsMap = {};

    /**
     * 记录subscribe函数返回的key
     * @type {Array.<number>}
     * @private
     */
    this.subscriptionKeys_ = [];

    /**
     * 记录在init方法中绑定的subscribe函数返回的key
     * @type {Array.<number>}
     * @private
     */
    this.subscriptionOverallKeys_ = [];
};
goog.inherits(rebar.mvc.BaseView, goog.ui.Component);

/**
 * 将当前view从dom中移除，并unload，并且从父view（有的话）移除。
 * 调用该函数后在dom体系和view体系就彻底清除了。
 */
rebar.mvc.BaseView.prototype.remove = function () {
    if (this.getParent()) {
        this.getParent().removeChild(this, true);
    }
    if (this.isInDocument()) {
        this.exitDocument();
    }
    if (this.getElement()) {
        goog.dom.removeNode(this.getElement());
    }
    if (this.getElement() && window['jQuery']) {
        var jqObj = window['jQuery'].call(window, this.getElement());
        jqObj['remove'].call(jqObj);
    }
};

/**
 * 该函数（以及依赖的addChild）是实现view类按功能聚合并重用的基石。
 * 如果一个大的界面可以由几块功能独立的子view拼接出来，那只要创建这些
 * 子view并把它们addSubView即可。在大界面对应的view外面可以完全不用理解这些
 * 子view。
 *
 * 一般子view对应的dom会渲染在父view的dom树中，这样在浏览器中看起来也是一个整体。
 *
 * 添加为子view的实例的enterDocument和existDocument方法会随着父view
 * enterDocument和existDocument被同步调用。
 *
 * @param {rebar.mvc.BaseView} view
 * @param {Element=} optElContainer
 */
rebar.mvc.BaseView.prototype.addSubView = function (view, optElContainer) {
    if (optElContainer) {
        this.addChild(view);
        view.render(optElContainer);
    } else {
        this.addChild(view, true);
    }
};

/**
 * @param {rebar.mvc.BaseView} view
 * @param {Element} elDecorate
 */
rebar.mvc.BaseView.prototype.decorateSubView = function (view, elDecorate) {
    this.addChild(view);
    view.decorate(elDecorate);
};

/**
 * 子view可以是多个，该方法在添加时指定在子view中的顺序，不常用。
 *
 * @param {rebar.mvc.BaseView} view
 * @param {number} index
 * @param {Element=} optElContainer
 */
rebar.mvc.BaseView.prototype.addSubViewAt = function (
  view, index, optElContainer) {
    if (optElContainer) {
        this.addChildAt(view, index);
        view.render(optElContainer);
    } else {
        this.addChildAt(view, index, true);
    }
};

/**
 * @return {rebar.mvc.BaseView}
 */
rebar.mvc.BaseView.prototype.getParentView = function () {
    var p = this.getParent();
    return p instanceof rebar.mvc.BaseView ? p : null;
};

/**
 * View也被设计成是有状态的，不过很少用到。
 * @override
 */
rebar.mvc.BaseView.prototype.getState = function () {
    return new rebar.model.StateModel();
};

/**
 * @override
 */
rebar.mvc.BaseView.prototype.setState = function (state) {
    if (!this.isViewInitialized()) {
        this.init();
    }
    return true;
};

/**
 * 会生成一个唯一的id（相对于一次运行过程中的所有view），并且该id还是合法的标识符。
 * @override
 */
rebar.mvc.BaseView.prototype.getId = function () {
    return this.viewId_;
};

/**
 * 该方法是为了getDomByxxx（除了getDomByTag）系列方法服务的。以getDomByClass为例，
 * 实现在当前view对应的dom树内找到包含对应class的Element。但是在当前view有子孙view的时候，
 * 可能会发生不期望的情况，那就是class和子孙view的class重复了，这样会把子孙view的dom树
 * 上的Element也获取到。
 *
 * 这里提供的一个解决方案是在生成定位class的时候把当前view的id作为前缀，getDomByClass
 * 函数获取的时候自动把前缀加上，由于view的id有唯一性，这样肯定不会冲突了。
 *
 * 不过另一个问题是这样增加了编码的复杂性，尤其是对于那种肯定不会有子view的view。
 * 这个方法就提供了这样的一个约定，如果一个view在生成定位class的时候加上了view的id
 * 作为前缀，那么就覆盖该方法并返回true，这样在调用getDomByClass的时候就会自动把view的id
 * 作为前缀加上。
 *
 * @return {boolean}  * @protected
 */
rebar.mvc.BaseView.prototype.renderDomWithIdPrefix = function () {
    return this.baseViewSettings_.renderDomWithIdPrefix;
};

/**
 * @see renderDomWithIdPrefix
 * 用来生成定位dom树中元素的字符串。
 *
 * @return {string} 如果在生产dom的时候添加了前缀id，就生成带前缀id的字符串
 * @protected
 */
rebar.mvc.BaseView.prototype.getDomStr = function (str) {
    return this.getDomPrefix() + str;
};

/**
 * @see renderDomWithIdPrefix
 * 如果renderDomWithIdPrefix返回true，那么dom中的定位属性（如id，class，attribute）
 * 应该带有view id作为前缀，该函数返回这个前缀（或者空字符串）
 *
 * @return {string}
 * @protected
 */
rebar.mvc.BaseView.prototype.getDomPrefix = function () {
    return this.renderDomWithIdPrefix() ? this.getId() : '';
};

/**
 * 页面获得焦点，子类自管实现获取焦点时的逻辑。默认行为是找到该类中的第一个
 * input并将其focus。
 */
rebar.mvc.BaseView.prototype.focus = function () {
    var el = this.getElement().querySelector('input');
    el && el.focus();
};

/**
 * @see rebar.mvc.BaseController#reloadController
 * 重新加载页面
 */
rebar.mvc.BaseView.prototype.reload = function () {
    if (!this.isInDocument()) {
        throw 'reload an unloaded view';
    }
    this.forEachChild(function (view) {
        view instanceof rebar.mvc.BaseView && view.reload();
    });
};

/**
 * @see renderDomWithIdPrefix
 * 获取当前view对应dom树中指定id的元素。如果renderDomWithIdPrefix返回true，
 * 那么会把view id作为id的前缀。
 * 推荐使用getDomByxxx系列方法而不是jquery的select或者dom原生的api。
 *
 * @param {string} id
 * @return {Element}
 * @protected
 */
rebar.mvc.BaseView.prototype.getDomById = function (id) {
    return this.getElement().querySelector('#' + this.getDomStr(id));
};

/**
 * @see renderDomWithIdPrefix
 * 获取当前view对应dom树中符合指定属性和值的元素。如果renderDomWithIdPrefix返回
 * true，则会把view id作为属性（attribute）的前缀。
 *
 * @param {string} attr
 * @param {string=} val
 * @return {Element}
 * @protected
 */
rebar.mvc.BaseView.prototype.getDomByAttr = function (attr, val) {
    return this.getElement().querySelector(
        rebar.util.attrSelector(this.getDomStr(attr), val));
};

/**
 * 上面那个设计不好,以后有时间完全用这个替换
 *
 * @param {string} attr The attr
 * @param {string=} val The value
 * @return {Element}
 * @protected
 */
rebar.mvc.BaseView.prototype.getDomByAttr2 = function (attr, val) {
    return this.getElement().querySelector(rebar.util.attrSelector(attr, val));
};

/**
 * 获取某个id下符合某个属性的元素
 *
 * @param {string} id The id
 * @param {string} attr The attr key
 * @param {string=} optVal The optional attribute value
 * @return {Element}
 * @protected
 */
rebar.mvc.BaseView.prototype.getDomByAttrInId = function (id, attr, optVal) {
    var el = this.getDomById(id);
    return el && el.querySelector(rebar.util.attrSelector(attr, optVal));
};

/**
 * @see getDomByAttr
 * 会获得符合指定属性和值的所有元素。
 *
 * @param {string} attr
 * @param {string=} val
 * @return {NodeList}
 * @protected
 */
rebar.mvc.BaseView.prototype.getAllDomByAttr = function (attr, val) {
    return this.getElement().querySelectorAll(
        rebar.util.attrSelector(this.getDomStr(attr), val));
};

/**
 * TODO: 替换上面的方法
 *
 * @param {string} attr The attr
 * @param {string=} val The value
 * @return {NodeList}
 * @protected
 */
rebar.mvc.BaseView.prototype.getAllDomByAttr2 = function (attr, val) {
    return this.getElement().querySelectorAll(rebar.util.attrSelector(attr, val));
};

/**
 * 获取某个id下符合某个属性的所有元素
 * @param {string} id The id
 * @param {string} attr The attr key
 * @param {string=} optVal The attribute value
 * @return {NodeList}
 * @protected
 */
rebar.mvc.BaseView.prototype.getAllDomByAttrInId = function (id, attr, optVal) {
    var el = this.getDomById(id);
    return el && el.querySelectorAll(rebar.util.attrSelector(attr, optVal));
};

/**
 * @see renderDomWithIdPrefix
 * 获取当前view对应dom树中包含指定class的元素。如果renderDomWithIdPrefix返回
 * true，则会把view id作为class的前缀。注意这里的class最好只传一个而不是
 * 空格分隔的一组class。
 *
 * 另外建议作为定位使用的class不要具有正在的样式。
 *
 * @param {string} cls
 * @return {Element}
 * @protected
 */
rebar.mvc.BaseView.prototype.getDomByClass = function (cls) {
    return this.getElement().querySelector('.' + this.getDomStr(cls));
};

/**
 * @see getDomByClass
 * 获取当前view对应dom树中所有包含对应class的元素。
 *
 * @param {string} cls
 * @return {NodeList}
 * @protected
 */
rebar.mvc.BaseView.prototype.getAllDomByClass = function (cls) {
    return this.getElement().querySelectorAll('.' + this.getDomStr(cls));
};

/**
 * 获取当前view对应dom树中指定tag名的元素。
 *
 * @param {string} tagName
 * @return {Element}
 * @protected
 */
rebar.mvc.BaseView.prototype.getDomByTag = function (tagName) {
    return this.getElement().querySelector(tagName);
};

/**
 * @see getDomByTag
 * @param {string} tagName
 * @return {NodeList}
 * @protected
 */
rebar.mvc.BaseView.prototype.getAllDomByTag = function (tagName) {
    return this.getElement().querySelectorAll(tagName);
};

/**
 * 子类可以检查getElement的返回值为null的情况下主动调用该方法。
 * 否则该方法会在需要渲染的时候被调用。更多详情
 * 请参考goog.ui.Component#createDom
 *
 * @override
 */
rebar.mvc.BaseView.prototype.createDom = function () {
    var dom = this.buildDom();
    if (goog.isString(dom)) {
        dom = rebar.util.htmlToElement(dom);
    }
    this.setElementInternal(dom);
};

/**
 * 这个方法主要方便子类覆盖后生成自己的dom元素或者对应的html字符串。
 * 目前常被用来生成整个view的dom树。
 *
 * @return {string|Element}
 * @protected
 */
rebar.mvc.BaseView.prototype.buildDom = function () {
    return goog.dom.createElement(goog.dom.TagName.DIV);
};

/**
 * 为子类提供初始化的机会，该方法被保证在实例的生命周期内只调用
 * 一次，并且可以在检查发现没有初始化的时候主动调用。
 *
 * @protected
 */
rebar.mvc.BaseView.prototype.init = function () {
    if (this.viewInitialized_) {
        throw 'initialize a initialized view';
    }
    if (!this.getElement()) {
        this.createDom();
    }
    this.viewInitialized_ = true;
};

/**
 * @return {boolean}
 * @protected
 */
rebar.mvc.BaseView.prototype.isViewInitialized = function () {
    return this.viewInitialized_;
};

/**
 * 实现view切入切出的主要基石。推荐的做法是切入的时候绑定事件，
 * 切出的时候取消绑定事件。不过通过getHandler绑定的事件会在切出
 * 的时候自动解绑。并且任何子类都应该考虑到重复切入的情况。
 *
 * @override
 */
rebar.mvc.BaseView.prototype.enterDocument = function () {
    if (!this.isViewInitialized()) {
        this.init();
    }
    rebar.mvc.BaseView.superClass_.enterDocument.call(this);
    this.renderTooltips();
};

/**
 * @override
 */
rebar.mvc.BaseView.prototype.exitDocument = function () {
    rebar.mvc.BaseView.superClass_.exitDocument.call(this);
    this.clearTooltips();
    this.clearSubscriptions();
};

/**
 *@override
 */
rebar.mvc.BaseView.prototype.disposeInternal = function () {
    rebar.mvc.BaseView.superClass_.disposeInternal.call(this);
    this.clearOverallSubscriptions();
};

/**
 * @see rebar.util.checkInput
 * 给一个dom元素（或者view对应的整个dom树）绑定输入校验检查。
 *
 * 如果覆盖了renderDomWithIdPrefix并返回true的时候，需要给
 * rebar.consts.DomConst.AttrCheckerReg属性添加view id前缀，
 * rebar.util.checkInput里提到的其他属性不需要view id前缀。
 *
 * 该方法最常用的情况是在enterDocument的时候不带参数调用，这样就可以实现
 * view中所有设置了data-reg属性的元素的输入检查。
 *
 * @param {Element=} optElement
 * @protected
 */
rebar.mvc.BaseView.prototype.bindInputCheck = function (optElement) {
    var el = optElement || this.getElement();
    this.getHandler().listen(el, goog.events.EventType.KEYUP, function (event) {
        var attr = this.getDomStr(rebar.consts.DomConst.AttrCheckerReg);
        if (event.target.hasAttribute(attr)) {
            rebar.util.checkInput(
                event.target, goog.bind(this.customInputChecker, this),
                event.target.getAttribute(attr));
        }
    });
};

/**
 * 删除某个element下的所有错误提示
 * @protected
 */
rebar.mvc.BaseView.prototype.removeAllError = function () {
    var selector = rebar.util.attrSelector(
        this.getDomStr(rebar.consts.DomConst.AttrCheckerReg));
    var elList = this.getElement().querySelectorAll(selector);
    goog.array.forEach(elList, function (el) {
        rebar.util.removeError(el);
    }, this);
};

/**
 * @param {Function} acceptModel The model constructor.
 * @param {Element=} optElement The optional element,
 *     default is current element.
 * @return {rebar.mvc.BaseModel}
 * @protected
 * @deprecated 请使用buildFormModel
 */
rebar.mvc.BaseView.prototype.buildJQueryFormData = function (
    acceptModel, optElement) {
    var jsonObj = this.buildFormData(null, optElement);
    var model = new acceptModel();
    model.initWitJson(jsonObj);
    return model;
};

/**
 * To build a model from from
 *
 * @param {Function} acceptModel The model constructor.
 * @param {rebar.mvc.BaseModel=} optInitModel The optional init model.
 * @param {Element=} optElement The optional element,
 *     default is current element.
 * @return {rebar.mvc.BaseModel}
 * @protected
 */
rebar.mvc.BaseView.prototype.buildFormModel = function (
    acceptModel, optInitModel, optElement) {
    var initObj = null;
    if (optInitModel) {
        initObj = optInitModel.toJson();
    }
    var jsonObj = this.buildFormData(initObj, optElement);
    var model = new acceptModel();
    model.initWitJson(jsonObj);
    return model;
};

/**
 * To build data from form
 *
 * @param {Object=} optInitObj The optional json object.
 * @param {Element=} optElement The optional element,
 *     default is current element.
 * @return {Object}
 * @protected
 */
rebar.mvc.BaseView.prototype.buildFormData = function (optInitObj, optElement) {
    var jsonObj = optInitObj || {};
    var elContent = optElement || this.getElement();
    var appendItem = function (name, val) {
        var nameSplits = name.split('.');
        var obj = jsonObj;
        for (var i = 0; i < nameSplits.length - 1; i++) {
            if (!obj[nameSplits[i]]) {
                obj[nameSplits[i]] = {};
            }
            obj = obj[nameSplits[i]];
        }
        name = nameSplits.pop();
        obj[name] = val;
    };

    goog.array.forEach(elContent.querySelectorAll('[name]'), function (el) {
        var name = el.getAttribute('name');
        var val = '';
        if (el.tagName === goog.dom.TagName.INPUT) {
            val = el.value;
        } else if (goog.dom.classes.has(el, 'dropdown')) {
            try {
                val = window['jQuery'].call(window, el)['dropdown'].call(el, 'get value');
            } catch (err) {
                // semantic ui not supported
            }
        }
        if (val) {
            appendItem(name, val);
        }
    });
    goog.object.forEach(this._inputsMap, function (input, name) {
        appendItem(name, input.getValue());
    });
    return jsonObj;
};

/**
 * 保存数据表单
 * @param {Object} modelJson The model json.
 * @param {Element=} optElement The optional element,
 *     default is current element.
 * @protected
 */
rebar.mvc.BaseView.prototype.saveFormData = function (modelJson, optElement) {
    var saveFormDataImpl = function (modelJson, optElement, optNamePrefix) {
        var namePrefix = optNamePrefix || '';
        var elContainer = optElement || this.getElement();
        goog.object.forEach(modelJson, function (val, key) {
            var name = namePrefix + key;
            if (goog.isObject(val)) {
                saveFormDataImpl.call(this, val, optElement, name + '.');
            }
            var el = elContainer.querySelector(
                rebar.util.attrSelector('name', name));
            if (el && el.type !== 'file') {
                el.value = val;
                if (goog.dom.classes.has(el, 'dropdown')) {
                    var dropdownVal = val;
                    if (goog.dom.classes.has(el, 'multiple')) {
                        dropdownVal = val.split(',');
                    }
                    try {
                        window['jQuery'].call(window, el)['dropdown'].call(el, 'set selected', dropdownVal);
                    } catch (ex) {
                        // semantic ui not supported
                    }
                }
            } else if (this._inputsMap[name]) {
                var input = /** @type {rebar.mvc.BaseInput} */(this._inputsMap[name]);
                input.setValue(val);
            }
        }, this);
    };
    saveFormDataImpl.call(this, modelJson, optElement);
};

/**
 * @see bindInputCheck
 * 如果有的元素的输入不能通过正则表达式检查，那可以覆盖该方法。
 * 根据inputDom参数来提供自定义的输入检查逻辑。
 * 该方法会在适当的时候被自动调用。
 *
 * @param {Element} inputDom
 * @return {boolean}
 * @protected
 */
rebar.mvc.BaseView.prototype.customInputChecker = function (inputDom) {
    return true;
};

/**
 * 除了用户输入触发的输入检查外，也可以主动调用该方法，触发所有输入检查。
 * 一般在提交按钮的回调里做检查，检查失败就取消提交进程。
 *
 * @param {Element=} optElContent
 * @return {boolean}
 * @protected
 */
rebar.mvc.BaseView.prototype.checkAllInput = function (optElContent) {
    var pass = true;
    var regAttr = this.getDomStr(rebar.consts.DomConst.AttrCheckerReg);
    var selector = rebar.util.attrSelector(regAttr);
    var elements = (optElContent || this.getElement()).querySelectorAll(selector);
    for (var i = 0; i < elements.length; ++i) {
        if (!elements[i].offsetWidth && !elements[i].offsetHeight) {
            continue;  // 跳过隐藏的
        }
        var checker = goog.bind(this.customInputChecker, this);
        var checkPassed = rebar.util.checkInput(
            elements[i], checker, elements[i].getAttribute(regAttr));
        pass = checkPassed && pass;
    }
    return pass;
};

/**
 * 显示一段提示后自动隐藏
 * @param {string} tip
 * @protected
 */
rebar.mvc.BaseView.prototype.showTip = function (tip) {
    rebar.util.MessageBox.getInstance().showTip(tip);
};

/**
 * BaseView提供tooltip的管理机制。这是由于tooltip不能作为child，
 * 但是还必须dispose，所以统一管理，子类只管渲染，其他事情交由基类完成。
 * 注册tooltip，子类创建tooltip后即可调用该方法将剩余工作交给父类。
 *
 * @param {goog.ui.Tooltip} tooltip
 * @protected
 */
rebar.mvc.BaseView.prototype.addTooltip = function (tooltip) {
    this.tooltips_.push(tooltip);
};

/**
 * 子类渲染tooltip尽量在这个方法中实现。因为tooltip最好在exitDocment
 * 的时候被全部销毁，以免占用资源。
 *
 * @protected
 */
rebar.mvc.BaseView.prototype.renderTooltips = function () {};

/**
 * 清空所有的tooltip
 * @protected
 */
rebar.mvc.BaseView.prototype.clearTooltips = function () {
    for (var i = 0; i < this.tooltips_.length; ++i) {
        this.tooltips_[i].dispose();
    }
    this.tooltips_ = [];
};

/**
 * Add a input
 * @param {rebar.mvc.BaseInput} input The input
 * @param {string} name The name of the input
 * @param {Element=} optElContainer The container
 * @protected
 */
rebar.mvc.BaseView.prototype.addInput = function (input, name, optElContainer) {
    if (this._inputsMap[name]) {
        return;
    }
    this.addSubView(input, optElContainer);
    this._inputsMap[name] = input;
};

/**
 * Get an input by name
 * @param {string} name The name of input.
 * @return {rebar.mvc.BaseInput?}
 */
rebar.mvc.BaseView.prototype.getInput = function (name) {
    return this._inputsMap[name] || null;
};

/**
 * BaseView提供subscription(订阅)的管理机制。父类统一管理subscription
 * 的key数组，在exitDocument时全部取消订阅
 *
 * @param {string} topic 订阅的话题
 * @param {Function} fn 处理函数
 * @param {Object=} optContext 执行处理函数的上下文环境，默认为this
 * @return {number} Subscription key
 * @protected
 */
rebar.mvc.BaseView.prototype.subscribe = function (topic, fn, optContext) {
    var key = rebar.consts.pubSubInstance.subscribe(topic, fn, optContext || this);
    this.subscriptionKeys_.push(key);
    return key;
};

/**
 * 取消订阅
 * @protected
 */
rebar.mvc.BaseView.prototype.clearSubscriptions = function () {
    for (var i = 0; i < this.subscriptionKeys_.length; ++i) {
        rebar.consts.pubSubInstance.unsubscribeByKey(this.subscriptionKeys_[i]);
    }
    this.subscriptionKeys_ = [];
};

/**
 * BaseView提供subscription(订阅)的管理机制。父类统一管理subscription
 * 的key数组，在disposeInternal时全部取消订阅
 * 仿照rebar.mvc.BaseView.prototype.subscribe
 *
 * @param {string} topic 订阅的话题
 * @param {Function} fn 处理函数
 * @param {Object=} optContext 执行处理函数的上下文环境，默认为this
 * @return {number} Subscription key
 * @protected
 */
rebar.mvc.BaseView.prototype.subscribeOverall = function (topic, fn, optContext) {
    var key = rebar.consts.pubSubInstance.subscribe(topic, fn, optContext || this);
    this.subscriptionOverallKeys_.push(key);
    return key;
};

/**
 * 取消订阅，在disposeInternal中调用
 * @protected
 */
rebar.mvc.BaseView.prototype.clearOverallSubscriptions = function () {
    for (var i = 0; i < this.subscriptionOverallKeys_.length; ++i) {
        rebar.consts.pubSubInstance.unsubscribeByKey(this.subscriptionOverallKeys_[i]);
    }
    this.subscriptionOverallKeys_ = [];
};

/**
 * @param {boolean=} optRenderDomWithIdPrefix The optional param.
 * @constructor
 */
rebar.mvc.BaseView.Settings = function (optRenderDomWithIdPrefix) {
    /**
     * @type {boolean}
     */
    this.renderDomWithIdPrefix = optRenderDomWithIdPrefix || false;
};

/**
 * @type {number}
 * @private
 */
rebar.mvc.BaseView.idCounter_ = 0;

