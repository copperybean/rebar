/**
 * @file The semantic ui version pagination view
 *
 * @author zhangzhihong02
 */
goog.provide('baidu.base.SemanticUIPaginationView');

goog.require('baidu.base.PaginationView');
goog.require('baidu.base.tplSemanticUI');

/**
 * 一个基于semantic ui实现的分页控件
 *
 * @param {number=} optPageSize The optional page size.
 * @constructor
 * @extends {baidu.base.PaginationView}
 */
baidu.base.SemanticUIPaginationView = function (optPageSize) {
    baidu.base.PaginationView.call(this, optPageSize);
};
goog.inherits(baidu.base.SemanticUIPaginationView, baidu.base.PaginationView);

/**
 * @param {string=} optName
 * 作为datatables的翻页控件
 */
baidu.base.SemanticUIPaginationView.extendsDataTablePaging = function (optName) {
    var name = optName || 'simple_numbers';
    $.fn.dataTableExt.oPagination[name] = /** @type {dataTablePaginationCallbacks} */({
        fnInit: function (oSettings, nPaging, fnCallbackDraw) {
            var view = new baidu.base.SemanticUIPaginationView(
                oSettings._iDisplayLength);
            view.render(nPaging);
            var eName = baidu.base.PaginationView.Events.ChangePage;
            var eventKey = goog.events.listen(view, eName, function(e) {
                oSettings.oApi._fnPageChange(oSettings, e.pageNumber);
                fnCallbackDraw(oSettings);
                view.setCurrentInfo(e.pageNumber);
            });
            oSettings.aoDestroyCallback.push({
                fn: function () {
                    view.dispose();
                    goog.events.unlistenByKey(eventKey);
                    oSettings.__semanticuiPaginationView = null;
                }
            });
            oSettings.__semanticuiPaginationView = view;
        },
        fnUpdate: function (oSettings) {
            oSettings.__semanticuiPaginationView.setCurrentInfo(
                0, oSettings.fnRecordsDisplay());
        }
    });
};

/**
 * @override
 */
baidu.base.SemanticUIPaginationView.prototype.getVisibleStartPage = function () {
    var ret = baidu.base.SemanticUIPaginationView.superClass_.getVisibleStartPage.call(this);
    if (ret === 0) {
        ++ret;
    } else if (ret + this.getPageNumShow() >= this.getTotalPage()) {
        --ret;
    }
    return Math.max(ret, 1);
};

/**
 * @override
 */
baidu.base.SemanticUIPaginationView.prototype.getActiveCssClass = function () {
    return 'active';
};

/**
 * @override
 */
baidu.base.SemanticUIPaginationView.prototype.getDisableCssClass = function () {
    return 'disabled';
};

/**
 * @override
 */
baidu.base.SemanticUIPaginationView.prototype.updateView = function () {
    baidu.base.SemanticUIPaginationView.superClass_.updateView.call(this);

    var startPage = this.getVisibleStartPage();
    var totalPage = this.getTotalPage();

    this.getDomById(baidu.base.pvdc.ID_LAST_PAGE).innerHTML = totalPage;
    var elFirst = this.getDomById(baidu.base.pvdc.ID_FIRST_PAGE);
    if (this.getCurrentPage() === 0) {
        goog.dom.classes.add(elFirst, this.getActiveCssClass());
        goog.dom.classes.remove(elFirst, this.getDisableCssClass());
    } else {
        goog.dom.classes.remove(elFirst, this.getActiveCssClass());
    }

    var elLast = this.getDomById(baidu.base.pvdc.ID_LAST_PAGE);
    if (this.getCurrentPage() + 1 === totalPage) {
        goog.dom.classes.add(elLast, this.getActiveCssClass());
        goog.dom.classes.remove(elLast, this.getDisableCssClass());
    } else {
        goog.dom.classes.remove(elLast, this.getActiveCssClass());
    }
    goog.style.showElement(elLast, totalPage > 1);

    goog.style.showElement(this.getDomById(baidu.base.spvdc.ID_START_GAP),
                           startPage > 1);
    goog.style.showElement(
        this.getDomById(baidu.base.spvdc.ID_END_GAP),
        startPage + this.getPageNumShow() < totalPage - 1);

    if (totalPage > startPage && startPage + this.getPageNumShow() >= totalPage) {
        // 将“最后一页”隐藏
        var s = baidu.base.util.attrSelector(
            baidu.base.pvdc.ATTR_PAGE_INDEX, (totalPage - startPage - 1) + '');
        goog.style.showElement(this.getElement().querySelector(s), false);
    }
};

/**
 * @override
 */
baidu.base.SemanticUIPaginationView.prototype.buildDom = function () {
    return baidu.base.tplSemanticUI.pagination({
        viewId: this.getId(),
        numShow: this.getPageNumShow()
    });
};

/**
 * @enum {string}
 */
baidu.base.SemanticUIPaginationView.DomConst = {
    ID_START_GAP: 'sgap',
    ID_END_GAP: 'egap'
};
baidu.base.spvdc = baidu.base.SemanticUIPaginationView.DomConst;

