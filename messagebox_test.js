/**
 * @fileoverview messagebox.js的测试文件
 * @author zhangzhihong02
 */
goog.require('baidu.base.MessageBox');

goog.require('goog.style');

describe('message.js test suite', function () {
    var msgBox;

    beforeEach(function () {
        msgBox = new baidu.base.MessageBox();
    });

    it('showLoading normal test', function () {
        msgBox.showLoading('test');
        expect(msgBox.msgInfoList_.length).toBe(1);
        expect(msgBox.msgInfoList_[0].type).toBe(baidu.base.MessageBox.MessageType.Loading);
    });

    it('showTip normal test', function () {
        spyOn(msgBox.hideDelay_, 'start').andCallThrough();
        spyOn(msgBox.hideDelay_, 'fire');

        msgBox.showTip('test');
        expect(msgBox.msgInfoList_.length).toBe(1);
        expect(msgBox.msgInfoList_[0].type).toBe(baidu.base.MessageBox.MessageType.Tip);
        expect(msgBox.hideDelay_.start).toHaveBeenCalled();

        // 显示第二次，期望会导致上一次的被隐藏（通过触发timeout）
        msgBox.showTip('t2');
        expect(msgBox.hideDelay_.fire).toHaveBeenCalled();
    });

    it('showMessage_ normal test', function () {
        msgBox.showLoading('ok');
        expect(goog.style.isElementShown(msgBox.msgDom_)).toBeTruthy();

        spyOn(msgBox, 'updatePos_');
        msgBox.showMessage_(msgBox.msgInfoList_[0]);
        expect(msgBox.updatePos_).not.toHaveBeenCalled();
    });

    it('recordMessage_ normal test', function () {
        msgBox.recordMessage_('ok', baidu.base.MessageBox.MessageType.Loading);
        expect(msgBox.nextId_).toBe(1);
        expect(msgBox.msgInfoList_.length).toBe(1);
        expect(msgBox.msgInfoList_[0].message).toBe('ok');
    });

    it('hide normal test', function () {
        var id1 = msgBox.showLoading('ok');
        var id2 = msgBox.showLoading('ok2');
        spyOn(msgBox, 'showMessage_').andCallThrough();
        msgBox.hide(id2);
        expect(msgBox.showMessage_).toHaveBeenCalledWith(msgBox.msgInfoList_[0]);
        expect(msgBox.msgInfoList_.length).toBe(1);
        expect(msgBox.curInfo_).toBe(msgBox.msgInfoList_[0]);

        msgBox.hide(id1);
        expect(msgBox.curInfo_).toBeNull();
        expect(goog.style.isElementShown(msgBox.msgDom_)).toBeFalsy();
    });

    it('onTipTimeout_ normal test', function () {
        msgBox.showTip('t1');
        spyOn(msgBox, 'hide');
        msgBox.showTip('t2');
        expect(msgBox.hide).toHaveBeenCalledWith(msgBox.msgInfoList_[0].id);
    });
});
