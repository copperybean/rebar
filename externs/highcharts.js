/**
 * @constructor
 */
var Highcharts = function () {};

/**
 * @constructor
 */
var HighchartsSeriesOption = function () {
        /**
         * @type {Function}
         */
        this.hide;
};

/**
 * @param {Object.<string,*>=} highchartsOption
 * @constructor
 */
Highcharts.Chart = function (highchartsOption) {
        /**
         * @type {Array.<HighchartsSeriesOption>}
         */
        this.series;
};


/**
 * @param {string} format
 * @param {*} str
 */
Highcharts.dateFormat = function (format, str) {};

/**
 * @constructor
 */
var HighchartsOpotion = function () {
        /**
         * @type {HighchartsOpotionCredits}
         */
        this.credits;
        /**
         * @type {HighchartsOpotionChart}
         */
        this.chart;
        /**
         * @type {HighchartsOpotionTitle}
         */
        this.title;
        /**
         * @type {HighchartsOptionX}
         */
        this.xAxis;
        /**
         * @type {Array.<HighchartsOptionSeriesData>}
         */
        this.series;
};

/**
 * @constructor
 */
var HighchartsOpotionCredits = function () {
        /**
         * @type {boolean}
         */
        this.enabled;
};

/**
 * @constructor
 */
var HighchartsOpotionChart = function () {
        /**
         * @type {string}
         */
        this.renderTo;
        /**
         * @type {string}
         */
        this.type;

        /**
         * @type {Array}
         */
        this.margin;
};

/**
 * @constructor
 */
var HighchartsOpotionTitle = function () {
        /**
         * @type {string}
         */
        this.text;
};

/**
 * @constructor
 */
var HighchartOptionLabel = function () {
        /**
         * @type {Function}
         */
        this.formatter;

        /**
         * @type {number}
         */
        this.step;

        /**
         * @type {number}
         */
        this.maxStaggerLines;
};

/**
 * @constructor
 */
var HighchartsOptionX = function () {
        /**
         * @type {Array}
         */
        this.categories;

        /**
         * @type {number}
         */
        this.tickInterval;

        /**
         * @type {HighchartOptionLabel}
         */
        this.labels;
};

/**
 * @constructor
 */
var HighchartsOptionSeriesData = function () {
        /**
         * @type {string}
         */
        this.name;

        /**
         * @type {Array}
         */
      this.data;
};

