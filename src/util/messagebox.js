/**
 * @fileoverview 显示消息框
 *
 * @author hector<zzh-83@163.com>
 */

goog.provide('rebar.util.MessageBox');

goog.require('rebar.model.Settings');
goog.require('rebar.util');
goog.require('rebar.util.tpl');

goog.require('goog.async.Delay');
goog.require('goog.style');

/**
 * @constructor
 */
rebar.util.MessageBox = function () {

    /**
     * @type {goog.async.Delay}
     * @private
     */
    this.hideDelay_ = new goog.async.Delay(goog.bind(this.onTipTimeout_, this),
                                           rebar.util.MessageBox.Config_.Duration);

    /**
     * @type {Element}
     * @private
     */
    this.msgDom_ = this.buildDom_();

    /**
     * @private
     * @type {number}
     */
    this.nextId_ = 0;

    /**
     * @type {rebar.util.MessageBox.MessageInfo}
     * @private
     */
    this.curInfo_ = null;

    /**
     * @type {Array.<rebar.util.MessageBox.MessageInfo>}
     * @private
     */
    this.msgInfoList_ = [];

    /**
     * @type {rebar.mvc.BaseView}
     * @private
     */
    this.referView_ = null;
};
goog.addSingletonGetter(rebar.util.MessageBox);

/**
 * 设置参照的page，显示时将参照改view来显示
 * @param {rebar.mvc.BaseView} view
 */
rebar.util.MessageBox.prototype.setReferView = function (view) {
    this.referView_ = view;
};

/**
 * 显示loading状态
 * @param {string} msg
 * @return {number} 返回的id用来在hide时使用
 */
rebar.util.MessageBox.prototype.showLoading = function (msg) {
    var info = this.recordMessage_(msg, rebar.util.MessageBox.MessageType.Loading);
    this.showMessage_(info);
    return info.id;
};

/**
 * 显示tip信息
 * @param {string} msg
 */
rebar.util.MessageBox.prototype.showTip = function (msg) {
    var info = this.recordMessage_(msg, rebar.util.MessageBox.MessageType.Tip);
    this.showMessage_(info);
    this.hideDelay_.isActive() && this.hideDelay_.fire(); // 先隐藏之前的tip
    this.hideDelay_.start();
};

/**
 * @param {rebar.util.MessageBox.MessageInfo} info
 * @private
 */
rebar.util.MessageBox.prototype.showMessage_ = function (info) {
    if (info === this.curInfo_) {
        return;
    }
    this.curInfo_ = info;
    if (info.type === rebar.util.MessageBox.MessageType.Loading) {
        goog.dom.classes.add(this.msgDom_, 'loading');
    } else {
        goog.dom.classes.remove(this.msgDom_, 'loading');
    }
    this.msgDom_.querySelector('i').innerHTML = info.message;
    goog.style.showElement(this.msgDom_, true);
    this.updatePos_();
};

/**
 * @param {string} msg
 * @param {number.<rebar.util.MessageBox.MessageType>} type
 * @return {rebar.util.MessageBox.MessageInfo} The info generated.
 * @private
 */
rebar.util.MessageBox.prototype.recordMessage_ = function (msg, type) {
    if (this.msgInfoList_.length === 0) {
        goog.events.listen(window,
                           goog.events.EventType.SCROLL,
                           this.onWindowScroll_,
                           undefined,
                           this);
    }
    var ret = new rebar.util.MessageBox.MessageInfo(this.nextId_++, msg, type);
    this.msgInfoList_.push(ret);
    return ret;
};

/**
 * @param {number} id showLoading 返回的id
 */
rebar.util.MessageBox.prototype.hide = function (id) {
    for (var i in this.msgInfoList_) {
        if (this.msgInfoList_[i].id === id) {
            this.msgInfoList_.splice(i, 1);
            if (this.msgInfoList_.length > 0) {
                this.showMessage_(this.msgInfoList_[this.msgInfoList_.length - 1]);
            } else {
                this.curInfo_ = null;
                goog.style.showElement(this.msgDom_, false);
                goog.events.unlisten(window,
                                     goog.events.EventType.SCROLL,
                                     this.onWindowScroll_,
                                     undefined,
                                     this);
            }
            break;
        }
    }
};

/**
 * @return {Element}
 */
rebar.util.MessageBox.prototype.buildDom_ = function () {
    var tipHtml = rebar.util.tpl.messageBox({
        baseResPath: rebar.model.Settings.getDefault().moduleResBasePath
    });
    var msgDom = rebar.util.htmlToElement(tipHtml);
    // 追加到当前页面
    document.body.appendChild(msgDom);
    return msgDom;
};

/**
 * @private
 */
rebar.util.MessageBox.prototype.updatePos_ = function () {
    var referDom = document.body;
    var offset = null;
    if (this.referView_
        && goog.style.getSize(this.referView_.getElement()).area()) {
        referDom = this.referView_.getElement();
    }
    offset = goog.style.getPageOffset(referDom);
    goog.style.setPosition(
      this.msgDom_,
      offset.x - window.scrollX + Math.ceil((
          goog.style.getSize(referDom).width
          - goog.style.getSize(this.msgDom_).width) / 2),
      rebar.util.MessageBox.Config_.TopPos);
};

/**
 * @private
 */
rebar.util.MessageBox.prototype.onTipTimeout_ = function () {
    for (var i in this.msgInfoList_) {
        if (this.msgInfoList_[i].type === rebar.util.MessageBox.MessageType.Tip) {
            this.hide(this.msgInfoList_[i].id);
        }
    }
};

/**
 * @param {Event} event
 * @private
 */
rebar.util.MessageBox.prototype.onWindowScroll_ = function (event) {
    this.updatePos_();
};

/**
 * @enum
 */
rebar.util.MessageBox.MessageType = {
    Loading: 0,
    Tip: 1
};

/**
 * @param {number} id
 * @param {string} msg
 * @param {number.<rebar.util.MessageBox.MessageType>} type
 * @constructor
 * @private
 */
rebar.util.MessageBox.MessageInfo = function (id, msg, type) {
    this.id = id;
    this.message = msg;
    this.type = type;
};

/**
 * @enum
 */
rebar.util.MessageBox.Config_ = {
    TopPos: 40,
    Duration: 3000
};
