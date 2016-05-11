/**
 * @author zhangzhihong02
 *
 * @file The semantic ui search input
 */
goog.provide('baidu.base.SemanticUISearchInput');

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
baidu.base.SemanticUISearchInput = function (urlPattern, optDelimiter) {
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
goog.inherits(baidu.base.SemanticUISearchInput, baidu.base.BaseInput);

/**
 * The selected items area can be more wide than input control, if you set a different container.
 * @param {Element} el The element.
 */
baidu.base.SemanticUISearchInput.prototype.setSelectedItemsContainer = function (el) {
    this._selectedItemsContainer = el;
};

/**
 * @override
 */
baidu.base.SemanticUISearchInput.prototype.getValue = function () {
    return this._items.join(this._delimiter);
};

/**
 * @override
 */
baidu.base.SemanticUISearchInput.prototype.setValue = function (val) {
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
baidu.base.SemanticUISearchInput.prototype.enterDocument = function () {
    baidu.base.SemanticUISearchInput.superClass_.enterDocument.call(this);

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
baidu.base.SemanticUISearchInput.prototype._updateSelectedItemsWidth = function () {
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
baidu.base.SemanticUISearchInput.prototype._addItem = function (item) {
    if (this._items.indexOf(item) >= 0) {
        baidu.base.MessageBox.getInstance().showTip('不可重复选择');
        return;
    }
    this._items.push(item);
    var el = baidu.base.util.htmlToElement(baidu.base.tplSemanticUI.searchInputItem({
        item: item
    }));
    this.getDomById(baidu.base.Const.DomConst.SEMANTICUI_SEARCHINPUT_ITEMS).appendChild(el);
};

/**
 * Click handler
 * @param {goog.events.BrowserEvent} e The event
 * @private
 */
baidu.base.SemanticUISearchInput.prototype._onClick = function (e) {
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
baidu.base.SemanticUISearchInput.prototype.buildDom = function () {
    return baidu.base.tplSemanticUI.searchInput();
};
