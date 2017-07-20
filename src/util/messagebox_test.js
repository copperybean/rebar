// Copyright (c) 2017, Baidu Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Tests for message box
 * @author copperybean.zhang
 */
goog.require('rebar.util.MessageBox');

goog.require('goog.style');

describe('message.js test suite', function () {
  var msgBox;

  beforeEach(function () {
    msgBox = new rebar.util.MessageBox();
  });

  it('showLoading normal test', function () {
    msgBox.showLoading('test');
    expect(msgBox.msgInfoList_.length).toBe(1);
    expect(msgBox.msgInfoList_[0].type).toBe(rebar.util.MessageBox.MessageType.LOADING);
  });

  it('showTip normal test', function () {
    spyOn(msgBox.hideDelay_, 'start').andCallThrough();
    spyOn(msgBox.hideDelay_, 'fire');

    msgBox.showTip('test');
    expect(msgBox.msgInfoList_.length).toBe(1);
    expect(msgBox.msgInfoList_[0].type).toBe(rebar.util.MessageBox.MessageType.TIP);
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
    msgBox.recordMessage_('ok', rebar.util.MessageBox.MessageType.LOADING);
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
