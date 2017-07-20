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
 * @fileoverview The base class for all controllers
 *
 * @author copperybean.zhang
 */
goog.provide('rebar.mvc.Controller');

goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');

/**
 * The base class for all controllers
 * @constructor
 * @extends {goog.events.EventTarget}
 */
rebar.mvc.Controller = function () {
    goog.events.EventTarget.call(this);

    /**
     * @type {boolean}
     * @private
     */
    this.isControllerLoaded_ = false;

    /**
     * @type {boolean}
     * @private
     */
    this.isControllerInitialized_ = false;

    /**
     * @type {goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = null;
};
goog.inherits(rebar.mvc.Controller, goog.events.EventTarget);

/**
 * @return {boolean}
 */
rebar.mvc.Controller.prototype.isControllerLoaded = function () {
    return this.isControllerLoaded_;
};

/**
 * @return {boolean}
 * @protected
 */
rebar.mvc.Controller.prototype.isControllerInitialized = function () {
    return this.isControllerInitialized_;
};

/**
 * A not working controller instance can be stored in memory for further use
 * which may be triggered by user. So every time the controller is switched
 * to active, this method is called.
 * @protected
 */
rebar.mvc.Controller.prototype.loadController = function () {
    if (this.isControllerLoaded_) {
        throw 'load a loaded controller';
    }
    if (!this.isControllerInitialized()) {
        this.initController();
    }
    this.isControllerLoaded_ = true;
};

/**
 * To reload the controller
 * @protected
 */
rebar.mvc.Controller.prototype.reloadController = function () {
    if (!this.isControllerLoaded_) {
        throw 'Reload a unloaded controller';
    }
};

/**
 * Called when the controller unloaded
 * @protected
 */
rebar.mvc.Controller.prototype.unloadController = function () {
    if (!this.isControllerLoaded_) {
        throw 'unload an unloaded controller';
    }
    this.isControllerLoaded_ = false;
};

/**
 * The subclasses can initialize in this method
 * @protected
 */
rebar.mvc.Controller.prototype.initController = function () {
    if (this.isControllerInitialized_) {
        throw 'initialize the controller muliti time';
    }
    this.isControllerInitialized_ = true;
};

/**
 * @override
 */
rebar.mvc.Controller.prototype.disposeInternal = function () {
    if (this.isControllerLoaded_) {
        this.unloadController();
    }

    if (this.eventHandler_) {
        this.eventHandler_.dispose();
        this.eventHandler_ = null;
    }
    rebar.mvc.Controller.superClass_.disposeInternal.call(this);
};

/**
 * Like the handler in goog.ui.Component.
 * @return {!goog.events.EventHandler} Event handler for this controller.
 * @protected
 */
rebar.mvc.Controller.prototype.getHandler = function () {
    if (!this.eventHandler_) {
        this.eventHandler_ = new goog.events.EventHandler(this);
    }
    return this.eventHandler_;
};

