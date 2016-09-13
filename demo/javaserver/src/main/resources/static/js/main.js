goog.provide('rebar.demo.Main');

goog.require('goog.dom');
goog.require('goog.dom.TagName');

/**
 * The constructor of main
 */
rebar.demo.Main = function () {
};

/**
 * The hello world
 */
rebar.demo.Main.prototype.helloWorld = function () {
    var el = goog.dom.createDom(
        goog.dom.TagName.DIV, '', 'hello world');
    goog.dom.appendChild(document.body, el);
    console.info('hello world');
};

(function () {
    var rebarDemo = {};
    var mainInstance = new rebar.demo.Main();

    goog.exportSymbol('__rebarDemo', rebarDemo);
    goog.exportProperty(rebarDemo, 'helloWorld', mainInstance.helloWorld);
})();

