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
 * @fileoverview The test file for controller
 *
 * @author copperybean.zhang
 */
goog.require('rebar.mvc.Controller');

describe('basecontroller.js test suite', function () {
    it('loadController function normal test', function () {
        var controller = new rebar.mvc.Controller();
        expect(controller.isControllerLoaded()).toBeFalsy();
        spyOn(controller, 'initController');
        controller.loadController();
        expect(controller.initController).toHaveBeenCalled();
        expect(controller.isControllerLoaded()).toBeTruthy();
        expect(controller.loadController).toThrow();
    });

    it('unloadController function normal test', function () {
        var controller = new rebar.mvc.Controller();
        expect(controller.unloadController).toThrow();
        controller.loadController();
        controller.unloadController();
        expect(controller.isControllerLoaded()).toBeFalsy();
        expect(controller.unloadController).toThrow();
    });

    it('disposeInternal function normal test', function () {
        var controller = new rebar.mvc.Controller();
        controller.loadController();
        spyOn(controller, 'unloadController');
        controller.disposeInternal();
        expect(controller.unloadController).toHaveBeenCalled();
    });
});

