/**
 * @fileoverview 翻页view
 * @author hector<zzh-83@163.com>
 */
goog.provide('baidu.base.PaginationView');

goog.require('baidu.base.BaseView');
goog.require('baidu.base.tplcommon');

/**
 * 本类只有在显示的时候页码是从1开始计数的，其他逻辑以及接口中页码都是从0开始计数的
 * @param {number=} pageSize 每页的item数.
 * @param {number=} numShow 同时显示的页码数，默认为5.
 * @param {number=} currentPage 默认为0.
 * @constructor
 * @extends {baidu.base.BaseView}
 */
baidu.base.PaginationView = function (pageSize, numShow, currentPage) {
    baidu.base.BaseView.call(this, true);

    /**
     * @type {number}
     * @private
     */
    this.pageSize_ = baidu.base.PaginationView.DefaultVal_.PAGE_SIZE;

    /**
     * @type {number}
     * @private
     */
    this.pageNumShow_ = baidu.base.PaginationView.DefaultVal_.PAGE_NUM_SHOW;

    /**
     * @type {number}
     * @private
     */
    this.currentPage_ = baidu.base.PaginationView.DefaultVal_.CURRENT_PAGE;

    /**
     * @type {number}
     * @private
     */
    this.itemNumber_ = baidu.base.PaginationView.DefaultVal_.ITEM_NUMBER;

    this.setPageSize_(pageSize);
    this.setPageNumShow_(numShow);
    this.setCurrentPage(currentPage);

};
goog.inherits(baidu.base.PaginationView, baidu.base.BaseView);

/**
 * @enum {string}
 */
baidu.base.PaginationView.Events = {
    // 表示切换page，Event: baidu.base.PaginationEvent
    ChangePage: 'pagination-change-page'
};


/**
 * @return {number}
 */
baidu.base.PaginationView.prototype.getItemNum = function () {
    return this.itemNumber_;
};

/**
 * @return {number}
 */
baidu.base.PaginationView.prototype.getCurrentPage = function () {
    return this.currentPage_;
};

/**
 * @return {number}
 */
baidu.base.PaginationView.prototype.getPageSize = function () {
    return this.pageSize_;
};

/**
 * @param {number=} currentPage
 * @param {number=} itemNum
 */
baidu.base.PaginationView.prototype.setCurrentInfo = function (
    currentPage, itemNum) {
    var itemNumBak = this.itemNumber_;
    var curPageBak = this.currentPage_;
    this.setItemNum_(itemNum);
    this.setCurrentPage(currentPage);
    if (this.itemNumber_ && this.currentPage_ >= this.getTotalPage()) {
        this.currentPage_ = this.getTotalPage() - 1;
        this.dispatchEvent(new baidu.base.PaginationEvent(this.currentPage_));
    }
    if (itemNumBak !== this.itemNumber_ || curPageBak !== this.currentPage_) {
        this.updateView();
    }
};

/**
 * @return {number}
 */
baidu.base.PaginationView.prototype.getTotalPage = function () {
    return Math.ceil(this.itemNumber_ / this.pageSize_);
};

/**
 * @override
 */
baidu.base.PaginationView.prototype.buildDom = function () {
    baidu.base.PaginationView.superClass_.buildDom.call(this);
    return baidu.base.tplcommon.paginationView({
        viewId: this.getId(),
        pageSize: this.pageSize_,
        itemNum: this.itemNumber_,
        numShow: this.pageNumShow_
    });
};

/**
 * @override
 */
baidu.base.PaginationView.prototype.enterDocument = function () {
    baidu.base.PaginationView.superClass_.enterDocument.call(this);

    this.updateView();
    var el = this.getDomById(baidu.base.pvdc.ID_PAGE_AREA) || this.getElement();
    this.getHandler().listen(el, goog.events.EventType.CLICK, this.onPageClick_);
};

/**
 * @return {string}
 * @protected
 */
baidu.base.PaginationView.prototype.getActiveCssClass = function () {
    return 'pageview-active';
};

/**
 * @return {string}
 * @protected
 */
baidu.base.PaginationView.prototype.getDisableCssClass = function () {
    return 'pageview-disable';
};

/**
 * @param {number=} num
 * @private
 */
baidu.base.PaginationView.prototype.setItemNum_ = function (num) {
    if (goog.isNumber(num) && num >= baidu.base.PaginationView.DefaultVal_.ITEM_NUMBER) {
        this.itemNumber_ = num;
    }
};

/**
 * @param {number=} num
 */
baidu.base.PaginationView.prototype.setCurrentPage = function (num) {
    if (goog.isNumber(num) && num >= baidu.base.PaginationView.DefaultVal_.CURRENT_PAGE) {
        this.currentPage_ = num;
    }
};

/**
 * @param {number=} num
 * @private
 */
baidu.base.PaginationView.prototype.setPageSize_ = function (num) {
    if (goog.isNumber(num)) {
        this.pageSize_ = num;
    }
};

/**
 * @param {number=} num
 * @private
 */
baidu.base.PaginationView.prototype.setPageNumShow_ = function (num) {
    if (goog.isNumber(num) && num >= baidu.base.PaginationView.DefaultVal_.PAGE_NUM_SHOW) {
        this.pageNumShow_ = num;
    }
};

/**
 * @return {number}
 * @protected
 */
baidu.base.PaginationView.prototype.getPageNumShow = function () {
    return this.pageNumShow_;
};

/**
 * 获取当前显示窗口中的第一个页码
 * @return {number}
 * @protected
 */
baidu.base.PaginationView.prototype.getVisibleStartPage = function () {
    // 这里要考虑pageNumShow_为偶数的情况，这里默认当前页前面比后面多显示一页
    var startPage = this.currentPage_ - Math.floor(this.pageNumShow_ / 2);
    if (startPage + this.getPageNumShow() >= this.getTotalPage()) {
        startPage = this.getTotalPage() - this.getPageNumShow();
    }
    return Math.max(startPage, 0);
};

/**
 * @protected
 */
baidu.base.PaginationView.prototype.updateView = function () {
    if (!this.getElement()) {
        return;
    }
    if (this.itemNumber_ === 0) {
        goog.style.showElement(this.getElement(), false);
        return;
    }
    goog.style.showElement(this.getElement(), true);

    var startPage = this.getVisibleStartPage();
    var endPage = startPage + this.pageNumShow_;
    for (var i = startPage; i < endPage; ++i) {
        var selector = baidu.base.util.attrSelector(
            baidu.base.pvdc.ATTR_PAGE_INDEX, (i - startPage) + '');
        var pageDom = this.getElement().querySelector(selector);
        if (i < this.getTotalPage()) {
            goog.style.showElement(pageDom, true);
            if (i === this.currentPage_) {
                goog.dom.classes.add(pageDom, this.getActiveCssClass());
            } else {
                goog.dom.classes.remove(pageDom, this.getActiveCssClass());
            }
            pageDom.innerHTML = i + 1 + '';
        } else {
            goog.style.showElement(pageDom, false);
        }
    }
    if (this.currentPage_ === 0) {
        goog.dom.classes.add(this.getDomById(baidu.base.pvdc.ID_FIRST_PAGE),
                             this.getDisableCssClass());
        goog.dom.classes.add(this.getDomById(baidu.base.pvdc.ID_PRE_PAGE),
                             this.getDisableCssClass());
    } else {
        goog.dom.classes.remove(this.getDomById(baidu.base.pvdc.ID_FIRST_PAGE),
                                this.getDisableCssClass());
        goog.dom.classes.remove(this.getDomById(baidu.base.pvdc.ID_PRE_PAGE),
                                this.getDisableCssClass());
    }
    if (this.currentPage_ + 1 === this.getTotalPage()) {
        goog.dom.classes.add(this.getDomById(baidu.base.pvdc.ID_LAST_PAGE),
                             this.getDisableCssClass());
        goog.dom.classes.add(this.getDomById(baidu.base.pvdc.ID_NEXT_PAGE),
                             this.getDisableCssClass());
    } else {
        goog.dom.classes.remove(this.getDomById(baidu.base.pvdc.ID_LAST_PAGE),
                                this.getDisableCssClass());
        goog.dom.classes.remove(this.getDomById(baidu.base.pvdc.ID_NEXT_PAGE),
                                this.getDisableCssClass());
    }

    var el = this.getDomById(baidu.base.pvdc.ID_ITEM_NUM);
    el && (el.innerHTML = this.itemNumber_);
    var elJump = this.getDomById(baidu.base.pvdc.ID_JUMP_AREA);
    if (elJump) {
        if (this.getTotalPage() > 20) {
            goog.style.showElement(elJump, true);
            this.getDomById(baidu.base.pvdc.ID_JUMP_INPUT).value
                = this.getCurrentPage() + 1 + '';
        } else {
            goog.style.showElement(elJump, false);
        }
    }
};

/**
 * @param {Event} event
 * @private
 */
baidu.base.PaginationView.prototype.onPageClick_ = function (event) {
    var elTarget = event.target;
    if (elTarget.tagName !== goog.dom.TagName.A) {
        return;
    }
    var clickPage = null;
    if (elTarget.id === this.getDomStr(baidu.base.pvdc.ID_FIRST_PAGE)) {
        clickPage = 0;
    } else if (elTarget.id === this.getDomStr(baidu.base.pvdc.ID_PRE_PAGE)) {
        clickPage = this.currentPage_ - 1;
    } else if (elTarget.id === this.getDomStr(baidu.base.pvdc.ID_LAST_PAGE)) {
        clickPage = this.getTotalPage() - 1;
    } else if (elTarget.id === this.getDomStr(baidu.base.pvdc.ID_NEXT_PAGE)) {
        clickPage = this.currentPage_ + 1;
    } else if (elTarget.id === this.getDomStr(baidu.base.pvdc.ID_JUMP_BUTTON)) {
        clickPage = this.getDomById(baidu.base.pvdc.ID_JUMP_INPUT).value - 1;
    } else if (elTarget.hasAttribute(baidu.base.pvdc.ATTR_PAGE_INDEX)) {
        clickPage = elTarget.getAttribute(baidu.base.pvdc.ATTR_PAGE_INDEX) - 0
            + this.getVisibleStartPage();
    } else {
        return;
    }
    if (clickPage !== this.currentPage_ && clickPage >= 0
        && clickPage < this.getTotalPage()) {
        this.dispatchEvent(new baidu.base.PaginationEvent(clickPage));
    }
};

/**
 * @enum
 * @private
 */
baidu.base.PaginationView.DefaultVal_ = {
    ITEM_NUMBER: 0,
    PAGE_SIZE: 10,
    PAGE_NUM_SHOW: 5,
    CURRENT_PAGE: 0
};

/**
 * @enum {string}
 */
baidu.base.PaginationView.DomConst = {
    ID_FIRST_PAGE: 'first_page',
    ID_PRE_PAGE: 'pre_page',
    ID_NEXT_PAGE: 'next_page',
    ID_LAST_PAGE: 'last_page',
    ID_JUMP_AREA: 'jump',
    ID_JUMP_BUTTON: 'jumpbtn',
    ID_JUMP_INPUT: 'jumpinput',
    ID_ITEM_NUM: 'item_number',
    ID_PAGE_AREA: 'pagearea',
    ATTR_PAGE_INDEX: 'pindex'
};
baidu.base.pvdc = baidu.base.PaginationView.DomConst;

/**
 * @param {number} pageNum
 * @constructor
 * @extends {goog.events.Event}
 */
baidu.base.PaginationEvent = function (pageNum) {
    goog.events.Event.call(this, baidu.base.PaginationView.Events.ChangePage);

    /**
     * @type {number}
     */
    this.pageNumber = pageNum;
};
goog.inherits(baidu.base.PaginationEvent, goog.events.Event);


