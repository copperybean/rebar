/**
 * @constructor
 */
var DataTable = function () {};

/**
 * @return {DataTableApi}
 */
DataTable.prototype.api = function () {};

/**
 * @param {string} value the filter value
 */
DataTable.prototype.fnFilter = function (value) {};

/**
 * @constructor
 */
var DataTableApi = function () {};

/**
 * 销毁datatable
 */
DataTableApi.prototype.destroy = function () {};

/**
 * 取得dataTable的列
 */
DataTableApi.prototype.column = function () {};

/**
 * @constructor
 */
var dataTableSettingLanguagePaginage = function () {
    /**
     * @type {string}
     */
    this.first;

    /**
     * @type {string}
     */
    this.last;

    /**
     * @type {string}
     */
    this.next;

    /**
     * @type {string}
     */
    this.previous;
};

/**
 * @constructor
 */
var dataTableSettingLanguage = function () {
    /**
     * @type {dataTableSettingLanguagePaginage}
     */
    this.paginate;

    /**
     * @type {string}
     */
    this.search;

    /**
     * @type {string}
     */
    this.lengthMenu;

    /**
     * @type {string}
     */
    this.zeroRecords;

    /**
     * @type {string}
     */
    this.info;

    /**
     * @type {string}
     */
    this.infoEmpty;

    /**
     * @type {string}
     */
    this.infoFiltered;
};

/**
 * @constructor
 */
var dataTableSettingColumnDef = function () {
    /**
     * @type {*}
     */
    this.width;
    /**
     * @type {number}
     */
    this.targets;

    /**
     * @type {function (Element, *, *, number, number)}
     */
    this.createdCell;

    /**
     * @type {boolean}
     */
    this.orderable;

    /**
     * @type {function (*, *, *, *)}
     */
    this.render;


};

/**
 * @constructor
 */
var dataTableSettings = function () {
    /**
     * @type {boolean}
     */
    this.aLengthMenu;
    /**
     * @type {boolean}
     */
    this.ordering;
    /**
     * @type {boolean}
     */
    this.paging;
    /**
     * @type {number}
     */
    this.iDisplayLength;

    /**
     * @type {string}
     */
    this.dom;

    /**
     * @type {boolean}
     */
    this.autoWidth;

    /**
     * @type {Array}
     */
    this.data;

    /**
     * @type {Array.<dataTableSettingsColumn>}
     */
    this.columns;

    /**
     * @type {boolean}
     */
    this.destroy;

    /**
     * @type {boolean}
     */
    this.info;

    /**
     * @type {dataTableSettingLanguage}
     */
    this.language;

    /**
     * @type {Array.<dataTableSettingColumnDef>}
     */
    this.columnDefs;

    /**
     * @type {Array}
     */
    this.order;

    /**
     * @type {function(Object.<string, *>)}
     */
    this.drawCallback;

    /**
     * @type {boolean}
     */
    this.searching;
};

/**
 * @constructor
 */
var dataTableSettingsColumn = function () {

    /**
     * @type {string}
     */
    this.title;
};

/**
 * @param {jQuery} dom
 * @param {Object.<string, *>} settings 对应dataTableSettings
 * @return {DataTable}
 */
$.fn.dataTable = function (dom, settings) {};

/**
 * @type {Object}
 */
$.fn.dataTableExt = {};

/**
 * @type {Object}
 */
$.fn.dataTableExt.oPagination = {};

/**
 * @constructor
 */
var dataTablePaginationCallbacks = function () {
    /**
     * @type {function(dataTableSettingsObjectModel, Element, function(dataTableSettingsObjectModel))}
     */
    this.fnInit;
    /**
     * @type {function(dataTableSettingsObjectModel)}
     */
    this.fnUpdate;
};

/**
 * 对应DataTable.models.oSettings及其衍生对象
 * @constructor
 */
var dataTableSettingsObjectModel = function () {
    /**
     * @type {Object}
     */
    this.__semanticuiPaginationView;

    /**
     * @type {number}
     */
    this._iDisplayLength;

    /**
     * @type {dataTableInternalApi}
     */
    this.oApi;

    /**
     * @type {Array.<dataTableDestroyCallback>}
     */
    this.aoDestroyCallback;

    /**
     * @type {Function}
     */
    this.fnRecordsDisplay;
};

/**
 * @constructor
 */
var dataTableDestroyCallback = function () {
    /**
     * @type {Function}
     */
    this.fn;
};

/**
 * @constructor
 */
var dataTableInternalApi = function () {
    /**
     * @type {function(dataTableSettingsObjectModel, number)}
     */
    this._fnPageChange;
};
