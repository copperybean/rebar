$.fn.zTree;

/**
 * @constructor
 */
var zTreeObj = function () {};

/**
 * @param {zTreeNode} parentNode
 * @param {zTreeNodeModel|Array.<zTreeNodeModel>} newNodes
 * @param {boolean=} isSilent
 * @return {Array.<zTreeNode>}
 */
zTreeObj.prototype.addNodes = function (parentNode, newNodes, isSilent) {};

/**
 * @param {string} key
 * @param {string} value
 * @param {zTreeNode=} parentNode
 * @return {zTreeNode}
 */
zTreeObj.prototype.getNodeByParam = function (key, value, parentNode) {};

/**
 * @param {string} tId
 * @return {zTreeNode}
 */
zTreeObj.prototype.getNodeByTId = function (tId) {};

/**
 * @param {function (zTreeNode)} filter
 * @param {boolean=} optIsSingle
 * @param {zTreeNode=} optParentNode
 * @param {*=} optInvokeParam
 * @return {zTreeNode|Array.<zTreeNode>}
 */
zTreeObj.prototype.getNodesByFilter = function (
  filter, optIsSingle, optParentNode, optInvokeParam) {};

/**
 * @param {string} key
 * @param {string} value
 * @param {zTreeNode=} parentNode
 * @return {Array.<zTreeNode>}
 */
zTreeObj.prototype.getNodesByParamFuzzy = function (key, value, parentNode) {};

/**
 * @param {string} key
 * @param {*} value
 * @param {zTreeNode=} parentNode
 * @return {Array.<zTreeNode>}
 */
zTreeObj.prototype.getNodesByParam = function (key, value, parentNode) {};

/**
 * @param {zTreeNode} node
 */
zTreeObj.prototype.hideNode = function (node) {};

/**
 * @param {boolean} expandFlag
 */
zTreeObj.prototype.expandAll = function (expandFlag) {};

/**
 * @param {zTreeNode} node
 */
zTreeObj.prototype.showNode = function (node) {};

/**
 * @param {Array.<zTreeNode>} nodes
 */
zTreeObj.prototype.showNodes = function (nodes) {};

/**
 * @param {Array.<zTreeNode>} nodes
 */
zTreeObj.prototype.hideNodes = function (nodes) {};

/**
 * 销毁ztree
 */
zTreeObj.prototype.destroy = function () {};

/**
 * @param {zTreeNode} treeNode
 * @param {boolean} checked
 * @param {boolean} checkTypeFlag
 * @param {boolean} callbackFlag
 */
zTreeObj.prototype.checkNode = function (
  treeNode, checked, checkTypeFlag, callbackFlag) {};

/**
 * @param {zTreeNode} treeNode
 * @param {boolean=} addFlag
 */
zTreeObj.prototype.selectNode = function (treeNode, addFlag) {};

/**
 * @param {zTreeNode} treeNode
 * @param {boolean=} expandFlag
 * @return {boolean}
 */
zTreeObj.prototype.expandNode = function (treeNode, expandFlag) {};

/**
 * @param {Array.<zTreeNode>|zTreeNode} treeNodes
 * @return {Array}
 */
zTreeObj.prototype.transformToArray = function (treeNodes) {};

/**
 * @return {Array.<zTreeNode>}
 */
zTreeObj.prototype.getNodes = function () {};

/**
 * @return {Array.<zTreeNode>}
 */
zTreeObj.prototype.getSelectedNodes = function () {};

/**
 * @param {zTreeNode} node
 */
zTreeObj.prototype.cancelSelectedNode = function (node) {};

/**
 * @param {zTreeNode} node
 */
zTreeObj.prototype.updateNode = function (node) {};

/**
 * refresh
 */
zTreeObj.prototype.refresh = function () {};

/**
 * @constructor
 */
var zTreeNodeModel = function () {
    /**
     * @type {string}
     */
    this.id;
    /**
     * @type {string}
     */
    this.name;
    /**
     * @type {string}
     */
    this.iconSkin;
    /**
     * @type {string}
     */
    this.url;
    /**
     * @type {boolean}
     */
    this.open;
    /**
     * @type {string}
     */
    this.target;
    /**
     * @type {Array.<zTreeNodeModel>}
     */
    this.children;
    /**
     * 原api里没有这个字段，但是由于为了方便在zTreeNode里使用，可以用这个字段
     * @type {*}
     */
    this.userData;
    /**
     * @type {boolean}
     */
    this.isHidden;
};

/**
 * zTreeNode 和 zTree中 treeNode类型一样
 * @constructor
 * @extends {zTreeNodeModel}
 */
var zTreeNode = function () {
    /**
     * 不指定idKey的时候可以访问该字段
     * @type {string}
     */
    this.id;
    /**
     * @type {string}
     */
    this.tId;
    /**
     * @type {number}
     */
    this.level;
    /**
     * @type {boolean}
     */
    this.isParent;
};

/**
 * @return {zTreeNode}
 */
zTreeNode.prototype.getParentNode = function () {};

/**
 * @constructor
 */
var zTreeSettingsView = function () {
    /**
     * @type {boolean}
     */
    this.showLine;
    /**
     * @type {boolean}
     */
    this.showIcon;
    /**
     * @type {boolean|function(string, zTreeNode)}
     */
    this.showTitle;
    /**
     * @type {boolean}
     */
    this.nameIsHTML;
    /**
     * @type {boolean}
     */
    this.selectedMulti;
    /**
     * @type {boolean}
     */
    this.dblClickExpand;
    /**
     * @type {function (string, zTreeNode)}
     */
    this.addDiyDom;
};

/**
 * @constructor
 */
var zTreeSettingsData = function () {
};

/**
 * @constructor
 */
var zTreeSettingsCallback = function () {
    /**
     * @type {function (string, zTreeNode, number):boolean}
     */
    this.beforeClick;
    /**
     * @type {function (Event, string, zTreeNode, number)}
     */
    this.onClick;
    /**
     * @type {function(Event, string, zTreeNode)}
     */
    this.onNodeCreated;
};

/**
 * @constructor
 */
var zTreeSettings = function () {
    /**
     * @type {zTreeSettingsView}
     */
    this.view;

    /**
     * @type {zTreeSettingsData}
     */
    this.data;

    /**
     * @type {zTreeSettingsCallback}
     */
    this.callback;
};

/**
 * @param {jQuery} dom
 * @param {Object.<string, *>} settings 对应zTreeSettings
 * @param {Object.<string, *>} nodes 对应zTreeNodeModel
 * @return {zTreeObj}
 */
$.fn.zTree.init = function (dom, settings, nodes) {};
