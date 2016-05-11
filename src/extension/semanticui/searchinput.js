/**
 * @author zhangzhihong02
 *
 * @file The semantic ui search input
 */
goog.provide('rebar.ext.sui.SearchInput');

goog.require('baidu.base.BaseInput');
goog.require('baidu.base.Const');
goog.require('baidu.base.MessageBox');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classes');

/**
 * The constructor
 * @param {string} urlPattern The url pattern
 * @param {string=} optDelimiter default is ';'
 * @constructor
 * @extends {baidu.base.BaseInput}
 */
rebar.ext.sui.SearchInput = function (urlPattern, optDelimiter) {
    baidu.base.BaseInput.call(this);

    /**
     * @type {string}
     * @private
     */
    this._urlPattern = urlPattern;

    /**
     * @type {string}
     * @private
     */
    this._delimiter = optDelimiter || ';';

    /**
     * @type {Array.<string>}
     * @private
     */
    this._items = [];

    /**
     * @type {Element}
     * @private
     */
    this._selectedItemsContainer = null;
};
goog.inherits(rebar.ext.sui.SearchInput, baidu.base.BaseInput);

/**
 * The selected items area can be more wide than input control, if you set a different container.
 * @param {Element} el The element.
 */
rebar.ext.sui.SearchInput.prototype.setSelectedItemsContainer = function (el) {
    this._selectedItemsContainer = el;
};

/**
 * @override
 */
rebar.ext.sui.SearchInput.prototype.getValue = function () {
    return this._items.join(this._delimiter);
};

/**
 * @override
 */
rebar.ext.sui.SearchInput.prototype.setValue = function (val) {
    this.getDomById(baidu.base.Const.DomConst.SEMANTICUI_SEARCHINPUT_ITEMS).innerHTML = '';
    var items = val.split(this._delimiter);
    this._items = [];
    goog.array.forEach(items, function (itemVal) {
        if (!itemVal) {
            return;
        }
        this._addItem(itemVal);
    }, this);
};

/**
 * @override
 */
rebar.ext.sui.SearchInput.prototype.enterDocument = function () {
    rebar.ext.sui.SearchInput.superClass_.enterDocument.call(this);

    this._updateSelectedItemsWidth();
    this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK, this._onClick);
    $(this.getElement()).find('.ui.search').search({
        apiSettings: {
            action: 'search',
            url: this._urlPattern
        },
        searchFields: [
            'title'
        ],
        searchFullText: false,
        searchDelay: 500,
        maxResults: 10,
        onSelect: goog.bind(function (item) {
            /* jshint ignore:start*/
            this._addItem(item['title']);
            /* jshint ignore:end*/
            var inputDom = $(this.getElement()).find('input');
            inputDom.val('');
            // 隐藏列表
            inputDom.blur();
            inputDom.focus();
            return false;
        }, this)
    });
};

/**
 * To update the selected items width
 * @private
 */
rebar.ext.sui.SearchInput.prototype._updateSelectedItemsWidth = function () {
    if (!this._selectedItemsContainer) {
        return;
    }
    var elItems = this.getDomById(baidu.base.Const.DomConst.SEMANTICUI_SEARCHINPUT_ITEMS);
    var relativePos = goog.style.getRelativePosition(elItems, this._selectedItemsContainer);
    var widthDiff = goog.style.getSize(this._selectedItemsContainer).width
        - goog.style.getSize(elItems).width;
    goog.style.setStyle(elItems, 'margin-right', -(widthDiff - relativePos.x - 30) + 'px');
};

/**
 * Add a search item
 * @param {string} item The item
 * @private
 */
rebar.ext.sui.SearchInput.prototype._addItem = function (item) {
    if (this._items.indexOf(item) >= 0) {
        baidu.base.MessageBox.getInstance().showTip('不可重复选择');
        return;
    }
    this._items.push(item);
    var el = baidu.base.util.htmlToElement(rebar.ext.sui.tpl.searchInputItem({
        item: item
    }));
    this.getDomById(baidu.base.Const.DomConst.SEMANTICUI_SEARCHINPUT_ITEMS).appendChild(el);
};

/**
 * Click handler
 * @param {goog.events.BrowserEvent} e The event
 * @private
 */
rebar.ext.sui.SearchInput.prototype._onClick = function (e) {
    if (!goog.dom.classes.has(e.target, 'delete')) {
        return;
    }
    var itemVal = e.target.previousSibling.textContent;
    goog.array.remove(this._items, itemVal);
    goog.dom.removeNode(e.target.parentElement);
};

/**
 * @override
 */
rebar.ext.sui.SearchInput.prototype.buildDom = function () {
    return rebar.ext.sui.tpl.searchInput();
};
