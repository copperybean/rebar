var dagre;

/**
 * @constructor
 */
dagre.Digraph = function () {};

/**
 * @param {string} nodeId
 * @param {Object.<string, string>} attribute
 */
dagre.Digraph.prototype.addNode = function (nodeId, attribute) {};

/**
 * @param {string} edgeId
 * @param {string} sourceNode
 * @param {string} targetNode
 */
dagre.Digraph.prototype.addEdge = function (edgeId, sourceNode, targetNode) {};

/**
 * @constructor
 */
dagre.layout = function () {};

/**
 * @param {dagre.Digraph} graph
 */
dagre.layout.prototype.run = function (graph) {};

/**
 * @param {number} x
 */
dagre.layout.prototype.nodeSep = function (x) {};

/**
 * @param {number} x
 */
dagre.layout.prototype.rankSep = function (x) {};

/**
 * @param {Function} fn
 */
dagre.layout.prototype.eachNode = function (fn) {};



