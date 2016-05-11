/**
 * @file 包装ztree，提供常用功能
 *
 * @author zhangzhihong02
 */
goog.provide('rebar.ext.ztree.ZTreeWrapper');

goog.require('baidu.base.BaseView');

/**
 * @param {Array.<zTreeNodeModel>} nodes The ztree nodes.
 * @param {zTreeSettings} zTreeSettings The ztree settings.
 * @constructor
 * @extends {baidu.base.BaseView}
 */
rebar.ext.ztree.ZTreeWrapper = function (nodes, zTreeSettings) {
    baidu.base.BaseView.call(this);

    /**
     * @type {Array.<zTreeNodeModel>}
     * @private
     */
    this.ztreeNodes_ = nodes;

    /**
     * @type {zTreeObj}
     * @private
     */
    this.ztreeObj_ = null;

    /**
     * @type {zTreeSettings}
     * @private
     */
    this.ztreeSettings_ = zTreeSettings;

    /**
     * @type {string}
     * @private
     */
    this.searchQuery_ = '';

    /**
     * @type {zTreeNode}
     * @private
     */
    this.curTreeNode_ = null;

    /**
     * @type {Array.<zTreeNode>}
     * @private
     */
    this.hitQueryNodes_ = [];

    /**
     * @type {Array.<zTreeNode>}
     * @private
     */
    this.hiddenNodes_ = [];
};
goog.inherits(rebar.ext.ztree.ZTreeWrapper, baidu.base.BaseView);

/**
 * @param {string} queryText The search query
 */
rebar.ext.ztree.ZTreeWrapper.prototype.updateBySearch = function (queryText) {
    if (!this.ztreeObj_ || queryText === this.searchQuery_) {
        return;
    }
    // 先隐藏，后显示，可以提高效率
    goog.style.showElement(this.getElement(), false);
    this.searchQuery_ = queryText;

    // 显示之前隐藏了的
    goog.array.forEach(this.hiddenNodes_, function (node) {
        this.ztreeObj_.showNode(node);
    }, this);
    this.hiddenNodes_ = [];

    // 取消之前的加粗
    goog.array.forEach(this.hitQueryNodes_, function (node) {
        var aTag = this.getDomById(node.tId + '_a');
        aTag && goog.dom.classes.remove(aTag, 'ztreewrapper-bold');
    }, this);
    this.hitQueryNodes_ = [];

    // 找出所有命中的node，并展开命中node的所有祖先
    if (queryText) {
        this.hitQueryNodes_ = this.ztreeObj_.getNodesByParamFuzzy('name', queryText);
    }
    var expandedNodesMap = {};
    var hitQueryNodesMap = {};
    goog.array.forEach(this.hitQueryNodes_, function (node) {
        hitQueryNodesMap[node.tId] = node;
        this.expandDirectLineNodes_(node, expandedNodesMap);
        var aTag = this.getDomById(node.tId + '_a');
        aTag && goog.dom.classes.add(aTag, 'ztreewrapper-bold');
    }, this);

    // 如果有选中的，展开算中node的左右祖先
    if (this.curTreeNode_) {
        this.expandDirectLineNodes_(this.curTreeNode_, expandedNodesMap);
        this.ztreeObj_.selectNode(this.curTreeNode_, true);
    }

    if (queryText) {
        // 保留已经展开的和命中的node，将剩下的node隐藏
        this.hiddenNodes_ = [];
        this.hideNodes_(this.ztreeObj_.getNodes(),
                        expandedNodesMap, hitQueryNodesMap);
    } else {
        // 除需要展开的，将其他的都折叠
        this.collapseNodes_(this.ztreeObj_.getNodes(), expandedNodesMap);
    }
    goog.style.showElement(this.getElement(), true);
};

/**
 * @return {zTreeObj}
 */
rebar.ext.ztree.ZTreeWrapper.prototype.getZTreeObj = function () {
    return this.ztreeObj_;
};

/**
 * @override
 */
rebar.ext.ztree.ZTreeWrapper.prototype.enterDocument = function () {
    rebar.ext.ztree.ZTreeWrapper.superClass_.enterDocument.call(this);

    this.ztreeObj_ = $.fn.zTree.init(
        $(this.getElement()), this.ztreeSettings_, this.ztreeNodes_);
    this.updateBySearch(this.searchQuery_);
};

/**
 * @override
 */
rebar.ext.ztree.ZTreeWrapper.prototype.exitDocument = function () {
    rebar.ext.ztree.ZTreeWrapper.superClass_.exitDocument.call(this);

    this.ztreeObj_.destroy();
    this.ztreeObj_ = null;
};

/**
 * 展开node的所有祖先节点（要从祖先节点开始往下展开，不然没效果）
 * @param {zTreeNode} node node
 * @param {Object.<string, zTreeNode>=} optExpandedNodesMap 传了这个参数的话，
 *     会把展开了的节点记下来
 * @private
 */
rebar.ext.ztree.ZTreeWrapper.prototype.expandDirectLineNodes_ = function (
    node, optExpandedNodesMap) {
    var reverseNodes = [];
    for (var pNode = node; pNode; pNode = pNode.getParentNode()) {
        optExpandedNodesMap && (optExpandedNodesMap[pNode.tId] = pNode);
        reverseNodes.unshift(pNode);
    }
    // 要倒着expand，不然不会有效
    goog.array.forEach(reverseNodes, function (node) {
        this.ztreeObj_.expandNode(node, true);
    }, this);
};

/**
 * 隐藏指定node，并将隐藏了的记在this.hiddenNodes里
 * @param {Array.<zTreeNode>} nodes nodes
 * @param {Object.<string, zTreeNode>} visibleNodesMap visibleNodesMap
 * @param {Object.<string, zTreeNode>} excludedNodesMap excludedNodesMap
 * @private
 */
rebar.ext.ztree.ZTreeWrapper.prototype.hideNodes_ = function (
    nodes, visibleNodesMap, excludedNodesMap) {
    goog.array.forEach(nodes, function (n) {
        if (excludedNodesMap[n.tId]) {
            return;
        }
        if (!visibleNodesMap[n.tId]) {
            this.ztreeObj_.hideNode(n);
            this.hiddenNodes_.push(n);
            return;
        }
        if (n.children && n.children.length) {
            this.hideNodes_(n.children, visibleNodesMap, excludedNodesMap);
        }
    }, this);
};

/**
 * 折叠指定的nodes
 * @param {Array.<zTreeNode>} nodes The nodes.
 * @param {Object.<string, zTreeNode>} excludedNodesMap The nodes to be excluded.
 * @private
 */
rebar.ext.ztree.ZTreeWrapper.prototype.collapseNodes_ = function (nodes, excludedNodesMap) {
    goog.array.forEach(nodes, function (n) {
        if (!n.isParent || !n.open) {
            return;
        }
        if (n.children && n.children.length) {
            this.collapseNodes_(n.children, excludedNodesMap);
        }
        if (!excludedNodesMap[n.tId]) {
            this.ztreeObj_.expandNode(n, false);
        }
    }, this);
};

/**
 * @override
 */
rebar.ext.ztree.ZTreeWrapper.prototype.disposeInternal = function () {
    rebar.ext.ztree.ZTreeWrapper.superClass_.disposeInternal.call(this);
    if (this.ztreeObj_) {
        this.ztreeObj_.destroy();
        this.ztreeObj_ = null;
    }
};


