/**
 * @fileoverview This file is generated automatically
 */
goog.provide('rebar.test.model.java.SimpleJavaModel');

goog.require('rebar.mvc.Model');
goog.require('rebar.test.model.SimpleEmbededJavaModel');


/**
 * @constructor
 * @extends {rebar.mvc.Model}
 */
rebar.test.model.java.SimpleJavaModel = function() {
  rebar.mvc.Model.call(this);

  /**
   * @type {Array.<number>}
   */
  this.intListField = [];

  /**
   * @type {Array.<rebar.test.model.SimpleEmbededJavaModel>}
   */
  this.customListField = [];

  /**
   * @type {rebar.test.model.SimpleEmbededJavaModel}
   */
  this.customField = new rebar.test.model.SimpleEmbededJavaModel();

  /**
   * @type {rebar.test.model.SimpleJavaModel.InnerEmbededJavaModel}
   */
  this.customInnerField = new rebar.test.model.SimpleJavaModel.InnerEmbededJavaModel();

  /**
   * @type {rebar.test.model.SimpleJavaModel}
   */
  this.selfField = null;

  /**
   * @type {Date}
   */
  this.dateField = new Date();

  /**
   * @type {number}
   */
  this.intField = 0;

  /**
   * @type {*}
   */
  this.unknownField = null;

  /**
   * @type {boolean}
   */
  this.booleanField = false;

  /**
   * @type {Object}
   */
  this.mapField = {};
};
goog.inherits(rebar.test.model.java.SimpleJavaModel, rebar.mvc.Model);

/**
 * @override
 */
rebar.test.model.java.SimpleJavaModel.prototype.toJson = function() {
  var ret = rebar.test.model.java.SimpleJavaModel.superClass_.toJson.call(this);
  ret['intListField'] = this.intListField;
  ret['custom_list_field'] = this.listToJson(this.customListField);
  ret['customField'] = this.customField.toJson();
  ret['customInnerField'] = this.customInnerField.toJson();
  ret['selfField'] = this.selfField ? this.selfField.toJson() : null;
  ret['date_field'] = this.dateField.getTime();
  ret['int_field'] = this.intField;
  ret['unknownField'] = this.unknownField;
  ret['booleanField'] = this.booleanField;
  ret['mapField'] = this.mapField;
  return ret;
};

/**
 * @override
 */
rebar.test.model.java.SimpleJavaModel.prototype.initWithJson = function(obj) {
  if (!rebar.test.model.java.SimpleJavaModel.superClass_.initWithJson.call(this, obj)) {
    return false;
  }
  this.intListField = obj['intListField'] || this.intListField;
  this.customListField = this.initList(obj['custom_list_field'], rebar.test.model.SimpleEmbededJavaModel);
  this.customField.initWithJson(obj['customField']);
  this.customInnerField.initWithJson(obj['customInnerField']);
  this.selfField || (this.selfField = new rebar.test.model.SimpleJavaModel());
  this.selfField.initWithJson(obj['selfField']);
  this.dateField = new Date(obj['date_field']);
  if (goog.isNumber(obj['int_field']) || !isNaN(+obj['int_field'])) {
    this.intField = +obj['int_field'];
  }
  this.unknownField = obj['unknownField'];
  try {
    this.booleanField = !!goog.json.parse(obj['booleanField']);
  } catch (e) {
    // do nothing
  }
  this.mapField = obj['mapField'] || this.mapField;
  return true;
};

/**
 * @enum {string}
 */
rebar.test.model.java.SimpleJavaModel.Enumxx = {
  AA: 'aa',
  BB: 'bb'
};

/**
 * @constructor
 * @extends {rebar.test.model.SimpleEmbededJavaModel}
 */
rebar.test.model.java.SimpleJavaModel.InnerEmbededJavaModel = function() {
  rebar.test.model.SimpleEmbededJavaModel.call(this);

  /**
   * @type {string}
   */
  this.def = '';
};
goog.inherits(rebar.test.model.java.SimpleJavaModel.InnerEmbededJavaModel, rebar.test.model.SimpleEmbededJavaModel);

/**
 * @override
 */
rebar.test.model.java.SimpleJavaModel.InnerEmbededJavaModel.prototype.toJson = function() {
  var ret = rebar.test.model.java.SimpleJavaModel.InnerEmbededJavaModel.superClass_.toJson.call(this);
  ret['def'] = this.def;
  return ret;
};

/**
 * @override
 */
rebar.test.model.java.SimpleJavaModel.InnerEmbededJavaModel.prototype.initWithJson = function(obj) {
  if (!rebar.test.model.java.SimpleJavaModel.InnerEmbededJavaModel.superClass_.initWithJson.call(this, obj)) {
    return false;
  }
  this.def = obj['def'] || this.def;
  return true;
};
