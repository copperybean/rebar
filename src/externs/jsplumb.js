/**
 * @constructor
 */
var jsPlumbInstance = function () {};

/**
 * @type {jsPlumbInstance}
 */
var jsPlumb;

/**
 * @constructor
 */
var jsPlumbEvent;

/**
 * @type {*}
 */
jsPlumbEvent.sourceId;
/**
 * @type {*}
 */
jsPlumbEvent.targetId;

/**
 * @param {Object.<string, *>} params
 * @return {jsPlumbInstance}
 */
jsPlumb.getInstance = function (params) {};

/**
 * @param {jQuerySelector|string} contextOrSpec
 * @param {string=} spec
 */
jsPlumbInstance.prototype.getSelector = function (contextOrSpec, spec) {};

/**
 * @param {Function} func
 */
jsPlumbInstance.prototype.ready = function (func) {};

/**
 * @param {Function} fn
 */
jsPlumbInstance.prototype.draggable = function (fn) {};

/**
 * @param {jsPlumbInstance.Connection} connection
 * @param {{fireEvent: boolean, forceDetach: boolean}=} params
 */
jsPlumbInstance.prototype.detach = function (connection, params) {};

/**
 * @param {Function} fn
 */
jsPlumbInstance.prototype.doWhileSuspended = function (fn) {};

/**
 * @param {jQuerySelector} el
 * @param {Object} params
 */
jsPlumbInstance.prototype.makeSource = function (el, params) {};

/**
 * @param {jQuerySelector} el
 * @param {Object.<string, *>} params
 */
jsPlumbInstance.prototype.makeTarget = function (el, params) {};

/**
 * @param {Object.<string, *>} params
 */
jsPlumbInstance.prototype.connect = function (params) {};


/**
 * @param {string} str
 * @param {function (jsPlumbEvent)} func
 * @param {boolean=} insertAtStart
 */
jsPlumbInstance.prototype.bind = function (str, func, insertAtStart) {};

/**
 * @param {jQuerySelector} el
 * @param {boolean} state
 * @return {jsPlumbInstance}
 */
jsPlumbInstance.prototype.setSourceEnabled = function (el, state) {};

/**
 * @return {Array.<jsPlumbInstance.Connection>}
 */
jsPlumbInstance.prototype.getConnections = function () {};

/**
 * @constructor
 */
jsPlumbInstance.Connection = function () {
    /**
     * @type {Element}
     */
    this.source;

    /**
     * type {string}
     */
    this.sourceId;

    /**
     * @type {Element}
     */
    this.target;

    /**
     * type {string}
     */
    this.targetId;
};

/**
 * @return {Array.<jsPlumbInstance.Overlays.AbstractOverlay>}
 */
jsPlumbInstance.Connection.prototype.getOverlays = function () {};

/**
 * @constructor
 */
jsPlumbInstance.Overlays = function () {
};

/**
 * @constructor
 */
jsPlumbInstance.Overlays.AbstractOverlay = function () {
};

/**
 * @return {Element}
 */
jsPlumbInstance.Overlays.AbstractOverlay.prototype.getElement = function () {};

/**
 * http://jsplumbtoolkit.com/doc/paint-styles
 * @constructor
 */
jsPlumbInstance.PaintStyle = function () {
        /**
         * @type {string}
         */
        this.fillStyle;
        /**
         * @type {string}
         */
        this.strokeStyle;
        /**
         * @type {number}
         */
        this.lineWidth;
        /**
         * @type {number}
         */
        this.outlineWidth;
        /**
         * @type {string}
         */
        this.outlineColor;
        /**
         * @type {Array.<string>}
         */
        this.dashstyle;
};

/**
 * @constructor
 */
jsPlumbInstance.BezierParam = function () {
        /**
         * @type {number}
         */
        this.curviness;
        /**
         * @type {number}
         */
        this.stub;
};

/**
 * @constructor
 */
jsPlumbInstance.StateMachineParam = function () {
        /**
         * @type {number}
         */
        this.curviness;
        /**
         * @type {number}
         */
        this.margin;
        /**
         * @type {number}
         */
        this.proximityLimit;
        /**
         * @type {number}
         */
        this.loopbackRadius;
        /**
         * @type {boolean}
         */
        this.showLoopback;
        /**
         * @type {string}
         */
        this.orientation;
};

/**
 * @constructor
 */
jsPlumbInstance.EndpointParam = function () {
        /**
         * @type {string|Array}
         */
        this.anchor;
        /**
         * @type {string|Array}
         */
        this.endpoint;
        /**
         * @type {boolean}
         */
        this.enabled;
        /**
         * @type {{fillStyle: string, strokeStyle: string, lineWidth: number}}
         */
        this.paintStyle;
        /**
         * @type {{fillStyle: string, strokeStyle: string, lineWidth: number}}
         */
        this.hoverPaintStyle;
        /**
         * @type {string}
         */
        this.cssClass;
        /**
         * @type {string}
         */
        this.hoverClass;
        /**
         * @type {jQuerySelector}
         */
        this.source;
        /**
         * @type {jQuerySelector}
         */
        this.container;
        /**
         * @type {Array.<jsPlumbInstance.Connection>}
         */
        this.connections;
        /**
         * @type {boolean}
         */
        this.isSource;
        /**
         * @type {number}
         */
        this.maxConnections;
        /**
         * @type {{scope: string}}
         */
        this.dragOptions;
        /**
         * @type {jsPlumbInstance.PaintStyle}
         */
        this.connectorStyle;
        /**
         * @type {jsPlumbInstance.PaintStyle}
         */
        this.connectorHoverStyle;
        /**
         * @type {string|Array.<string|jsPlumbInstance.BezierParam|jsPlumbInstance.StateMachineParam>}
         */
        this.connector;
        /**
         * @type {Array}
         */
        this.connectorOverlays;
        /**
         * @type {string}
         */
        this.connectorClass;
        /**
         * @type {string}
         */
        this.connectorHoverClass;
        /**
         * @type {boolean}
         */
        this.connectionsDetachable;
        /**
         * @type {boolean}
         */
        this.isTarget;
        /**
         * @type {{scope: string, hoverClass: string}}
         */
        this.dropOptions;
        /**
         * @type {boolean}
         */
        this.reattach;
        /**
         * @type {Object}
         */
        this.parameters;
};

/**
 * @constructor
 * @extends {jsPlumbInstance.EndpointParam}
 */
jsPlumbInstance.makeSourceParam = function () {
        /**
         * @type {string|Element}
         */
        this.parent;
        /**
         * @type {string}
         */
        this.scope;
        /**
         * @type {boolean}
         */
        this.deleteEndpointsOnDetach;
        /**
         * @type {Function}
         */
        this.filter;
};

/**
 * @constructor
 * @extends {jsPlumbInstance.EndpointParam}
 */
jsPlumbInstance.makeTargetParam = function () {
        /**
         * @type {string}
         */
        this.scope;
        /**
         * @type {boolean}
         */
        this.deleteEndpointsOnDetach;
        /**
         * @type {Function}
         */
        this.onMaxConnections;
};

/**
 * @constructor
 */
jsPlumbInstance.DotParams = function () {
        /**
         * @type {number}
         */
        this.radius;
        /**
         * @type {string}
         */
        this.cssClass;
        /**
         * @type {string}
         */
        this.hoverClass;
};

/**
 * @constructor
 */
jsPlumbInstance.ArrowOverlay = function () {
        /**
         * @type {number}
         */
        this.width;
        /**
         * @type {number}
         */
        this.length;
        /**
         * @type {number}
         */
        this.location;
        /**
         * @type {number}
         */
        this.direction;
        /**
         * @type {number}
         */
        this.foldback;
        /**
         * @type {jsPlumbInstance.PaintStyle}
         */
        this.paintStyle;
};

/**
 * @constructor
 */
jsPlumbInstance.getInstanceParam = function () {
        /**
         * @type {Array.<string|jsPlumbInstance.DotParams>}
         */
        this.Endpoint;
        /**
         * @type {jsPlumbInstance.PaintStyle}
         */
        this.HoverPaintStyle;
        /**
         * @type {Array.<string|jsPlumbInstance.ArrowOverlay>}
         */
        this.ConnectionOverlays;
        /**
         * @type {string}
         */
        this.Container;
};

/**
 * @constructor
 */
jsPlumbInstance.connectParam = function () {
        /**
         * @type {Element|string}
         */
        this.source;
        /**
         * @type {Element|string}
         */
        this.target;
        /**
         * @type {Array.<*>}
         */
        this.overlays;
        /**
         * @type {string}
         */
        this.scope;
};

/**
 * @constructor
 */
jsPlumbInstance.info = function () {
        /**
         * @type {jsPlumbInstance.Connection}
         */
        this.connection;
};
