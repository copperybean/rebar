/**
 * @fileoverview biglog产品的左侧树
 *
 * @author hector<zzh-83@163.com>
 */
goog.provide('baidu.base.BiglogLeftZTreeBar');

goog.require('baidu.base.BaseView');
goog.require('baidu.base.tplBiglogLeftZTreeBar');

goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events.Event');
goog.require('goog.style');

/**
 * @param {Array.<baidu.base.BiglogLeftZTreeBarNodeModel>} nodeModels
 * @param {boolean=} optSupportSearch
 * @constructor
 * @extends {baidu.base.BaseView}
 */
baidu.base.BiglogLeftZTreeBar = function (nodeModels, optSupportSearch) {
    baidu.base.BaseView.call(this);

    /**
     * @type {Array.<baidu.base.BiglogLeftZTreeBarNodeModel>}
     * @private
     */
    this.nodeModels_ = nodeModels || [];

    /**
     * @type {Object.<string, baidu.base.BiglogLeftZTreeBarNodeModel>}
     * @private
     */
    this.nodeModelsMap_ = {};
    this.initNodesMap_(this.nodeModels_);

    /**
     * @type {goog.async.Delay}
     * @private
     */
    this.searchInputDelay_ = new goog.async.Delay(
      this.searchUpdate_, 500, this);

    /**
     * @type {boolean}
     * @private
     */
    this.supportSearch_ = optSupportSearch || false;

    /**
     * @type {zTreeObj}
     * @private
     */
    this.ztreeObj_ = null;
};
goog.inherits(baidu.base.BiglogLeftZTreeBar, baidu.base.BaseView);

/**
 * @enum {string}
 */
baidu.base.BiglogLeftZTreeBar.Events = {
    ClickNode: 'clicknode'
};

/**
 * @param {string} id
 */
baidu.base.BiglogLeftZTreeBar.prototype.selectNodeById = function (id) {
    if (!this.ztreeObj_ || !this.nodeModelsMap_[id]) {
        return;
    }
    var node = this.nodeModelsMap_[id];
    var ztreeNode = null;
    if (node.ztreeNode_) {
        ztreeNode = node.ztreeNode_;
    } else {
        ztreeNode = this.ztreeObj_.getNodesByFilter(goog.bind(function (ztreeNode) {
            this.nodeModelsMap_[ztreeNode.id].ztreeNode_ = ztreeNode;
            return ztreeNode.id == id;
        }, this), true);
        if (!ztreeNode) {
            return;
        }
    }
    this.ztreeObj_.selectNode(/** @type {zTreeNode} */(ztreeNode), false);
};

/**
 * 该函数在数据量大时效率较低
 * @param {function (baidu.base.BiglogLeftZTreeBarNodeModel):boolean} filter
 * @return {baidu.base.BiglogLeftZTreeBarNodeModel}
 */
baidu.base.BiglogLeftZTreeBar.prototype.getNodeByFilter = function (filter) {
    var ztreeNodeRet = this.ztreeObj_.getNodesByFilter(goog.bind(function (ztreeNode) {
        this.nodeModelsMap_[ztreeNode.id].ztreeNode_ = ztreeNode;
        return filter.call(window, this.nodeModelsMap_[ztreeNode.id]);
    }, this), true);
    return ztreeNodeRet ? this.nodeModelsMap_[ztreeNodeRet.id] : null;
};

/**
 * @override
 */
baidu.base.BiglogLeftZTreeBar.prototype.enterDocument = function () {
    baidu.base.BiglogLeftZTreeBar.superClass_.enterDocument.call(this);

    var el = this.getDomById(baidu.base.bltbdc.IdTreeContainer);
    var hoverClass = 'showIcon';
    this.getHandler().listen(el, goog.events.EventType.MOUSEOVER, function (e) {
        if (!goog.dom.classes.has(el, hoverClass)) {
            goog.dom.classes.add(el, hoverClass);
        }
    });
    this.getHandler().listen(el, goog.events.EventType.MOUSEOUT, function (e) {
        if (goog.dom.classes.has(el, hoverClass)) {
            goog.dom.classes.remove(el, hoverClass);
        }
    });
    el = this.getDomById(baidu.base.bltbdc.IdSearchInput);
    this.getHandler().listen(el, goog.events.EventType.KEYUP, function (e) {
        this.searchInputDelay_.isActive() || this.searchInputDelay_.start();
    });
};

/**
 * @override
 */
baidu.base.BiglogLeftZTreeBar.prototype.createDom = function () {
    baidu.base.BiglogLeftZTreeBar.superClass_.createDom.call(this);

    this.initZTree_();
};

/**
 * @param {Event} event
 * @param {string} treeId
 * @param {zTreeNode} treeNode
 * @param {number} clickFlag
 * @private
 */
baidu.base.BiglogLeftZTreeBar.prototype.onTreeNodeClick_ = function (
  event, treeId, treeNode, clickFlag) {
    if (treeNode.isParent) {
        this.ztreeObj_.expandNode(treeNode);
    }
    this.dispatchEvent(new baidu.base.BiglogLeftZTreeBarEvent(
        this.nodeModelsMap_[treeNode.id]));
};

/**
 * @param {string} treeId
 * @param {zTreeNode} ztreeNode
 * @private
 */
baidu.base.BiglogLeftZTreeBar.prototype.addDiyZTreeDom_ = function (treeId, ztreeNode) {
    var spaceWidth = 10;
    var elSwitch = this.getDomById(ztreeNode.tId + '_switch'),
    elIcon = this.getDomById(ztreeNode.tId + '_ico');
//  elSwitch.remove();
    goog.dom.insertSiblingBefore(elSwitch, elIcon);

    if (ztreeNode.level >= 0) {
        var spaceStr = baidu.base.tplBiglogLeftZTreeBar.barSpace({
            width: spaceWidth * ztreeNode.level + 10
        });
        goog.dom.insertSiblingBefore(baidu.base.util.htmlToElement(spaceStr),
                                     elSwitch);
    }
    var nodeModel = this.nodeModelsMap_[ztreeNode.id];
    if (nodeModel && nodeModel.styleMap) {
        goog.style.setStyle(this.getDomById(ztreeNode.tId), nodeModel.styleMap);
    }
};

/**
 * @private
 */
baidu.base.BiglogLeftZTreeBar.prototype.initZTree_ = function () {
    var el = this.getDomById(baidu.base.bltbdc.IdTreeContainer);
    var settings = {
        view: {
            nameIsHTML: true,
            showLine: false,
            showIcon: false,
            selectedMulti: false,
            dblClickExpand: false,
            addDiyDom: goog.bind(this.addDiyZTreeDom_, this)
        },
        callback: {
            onClick: goog.bind(this.onTreeNodeClick_, this)
        }
    };
    var nodes = [];
    for (var i = 0; i < this.nodeModels_.length; ++i) {
        nodes.push(this.nodeModels_[i].toZTreeNodeModel_());
    }
    this.ztreeObj_ = $.fn.zTree.init($(el), settings, nodes);
};

/**
 * @param {Array.<baidu.base.BiglogLeftZTreeBarNodeModel>} nodes
 * @private
 */
baidu.base.BiglogLeftZTreeBar.prototype.initNodesMap_ = function (nodes) {
    for (var i = 0; i < nodes.length; ++i) {
        if (this.nodeModelsMap_[nodes[i].id]) {
            throw 'Duplicate id in BiglogLeftZTreeBarNodeModel';
        }
        this.nodeModelsMap_[nodes[i].id] = nodes[i];
        this.initNodesMap_(nodes[i].children_);
    }
};

/**
 * @private
 */
baidu.base.BiglogLeftZTreeBar.prototype.searchUpdate_ = function () {
    var queryText = this.getDomById(baidu.base.bltbdc.IdSearchInput).value;
    var ztreeNodes = this.ztreeObj_.transformToArray(this.ztreeObj_.getNodes());
    if (queryText) {
        this.ztreeObj_.hideNodes(ztreeNodes);

        var nodes = this.ztreeObj_.getNodesByParamFuzzy('name', queryText);
        for (var i = 0; i < nodes.length; ++i) {
            this.ztreeObj_.showNode(nodes[i]);
            this.ztreeObj_.expandNode(nodes[i], true);
            this.ztreeObj_.showNodes(this.ztreeObj_.transformToArray(nodes[i]));
            for (var pNode = nodes[i]; pNode; pNode = pNode.getParentNode()) {
                this.ztreeObj_.showNode(pNode);
                this.ztreeObj_.expandNode(pNode, true);
            }
            goog.style.setStyle(
              this.getDomById(nodes[i].tId + '_a'), 'color', '#FB5252');
        }
    } else {
        this.ztreeObj_.showNodes(ztreeNodes);
        this.ztreeObj_.expandAll(false);
        this.ztreeObj_.expandNode(ztreeNodes[0]);
        for (var j = 0; j < ztreeNodes.length; ++j) {
            goog.style.setStyle(
              this.getDomById(ztreeNodes[j].tId + '_a'), 'color', '');
        }
    }
    this.getDomById(baidu.base.bltbdc.IdSearchInput).focus();
};

/**
 * @override
 */
baidu.base.BiglogLeftZTreeBar.prototype.buildDom = function () {
    return baidu.base.tplBiglogLeftZTreeBar.viewHtml({
        supportSearch: this.supportSearch_
    });
};

/**
 * @enum {string}
 */
baidu.base.BiglogLeftZTreeBar.DomConst = {
    IdTreeContainer: 'tc',
    IdSearchInput: 'ltreesearchinput'
};
baidu.base.bltbdc = baidu.base.BiglogLeftZTreeBar.DomConst;

/**
 * @param {string} name
 * @param {*=} optCustomData
 * @param {string=} optId 如果设置id的话，要保持唯一性
 * @param {string=} optUrl
 * @param {Object=} optStyleMap
 * @constructor
 */
baidu.base.BiglogLeftZTreeBarNodeModel = function (
  name, optCustomData, optId, optUrl, optStyleMap) {

    /**
     * @type {string}
     */
    this.id = optId ||
      ('bigloglefttree_' + goog.ui.IdGenerator.getInstance().getNextUniqueId());

    /**
     * @type {string}
     */
    this.name = name;

    /**
     * @type {*}
     */
    this.customData = goog.isDef(optCustomData) ? optCustomData : undefined;

    /**
     * @type {string}
     */
    this.url = optUrl || '';

    /**
     * @type {Object}
     */
    this.styleMap = optStyleMap || null;

    /**
     * @type {boolean}
     */
    this.open = false;

    /**
     * @type {Array.<baidu.base.BiglogLeftZTreeBarNodeModel>}
     * @private
     */
    this.children_ = [];

    /**
     * @type {baidu.base.BiglogLeftZTreeBarNodeModel}
     * @private
     */
    this.parent_ = null;

    /**
     * used to record the corresponding ztree node
     * @type {zTreeNode}
     * @private
     */
    this.ztreeNode_ = null;
};

/**
 * @param {baidu.base.BiglogLeftZTreeBarNodeModel} node
 */
baidu.base.BiglogLeftZTreeBarNodeModel.prototype.appendChild = function (node) {
    if (node.parent_ && node.parent_ != this) {
        var idx = node.parent_.children_.indexOf(node);
        if (idx >= 0) {
            node.parent_.children_.splice(idx, 1);
        }
    }
    node.parent_ = this;
    this.children_.push(node);
};

/**
 * @return {baidu.base.BiglogLeftZTreeBarNodeModel}
 */
baidu.base.BiglogLeftZTreeBarNodeModel.prototype.getParent = function () {
    return this.parent_;
};

/**
 * @return {Object}
 * @private
 */
baidu.base.BiglogLeftZTreeBarNodeModel.prototype.toZTreeNodeModel_ = function () {
    var ret = /** @type {zTreeNodeModel} */({});
    ret.name = this.name;
    ret.id = this.id;
    ret.url = this.url;
    ret.open = this.open;
    ret.target = '_self';
    ret.children = [];
    for (var i = 0; i < (this.children_ || []).length; ++i) {
        ret.children.push(this.children_[i].toZTreeNodeModel_());
    }
    return ret;
};

/**
 * @param {baidu.base.BiglogLeftZTreeBarNodeModel} nodeModel
 * @constructor
 * @extends {goog.events.Event}
 */
baidu.base.BiglogLeftZTreeBarEvent = function (nodeModel) {
    goog.events.Event.call(this, baidu.base.BiglogLeftZTreeBar.Events.ClickNode);

    /**
     * @type {baidu.base.BiglogLeftZTreeBarNodeModel}
     */
    this.nodeModel = nodeModel;
};
goog.inherits(baidu.base.BiglogLeftZTreeBarEvent, goog.events.Event);
