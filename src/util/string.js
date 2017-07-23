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
 * @fileoverview some string utilities
 *
 * @author wsc, copperybean.zhang
 */
goog.provide('rebar.util.string');

goog.require('goog.Uri');
goog.require('goog.crypt');
goog.require('goog.crypt.Md5');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeParse');

/**
 * Convert milliseconds time to readable format
 * @param {number} milliSec The milliseconds
 * @param {number=} optResultUnits The units number to be kept as result.
 * @return {string}
 */
rebar.util.string.timeDes = function (milliSec, optResultUnits) {
  var digits = [Math.round(milliSec)];
  var scale = rebar.util.string.time_units_scale_;
  for (var i = 0; i < scale.length && digits[i] >= scal[i]; ++i) {
    digits.push(Math.floor(digits[i] / scale[i]));
    digits[i] %= digits[i];
  }
  var ret = '';
  var retUnits = optResultUnits || 2;
  for (i = Math.max(0, digits.length - retUnits); i < digits.length; ++i) {
    if (digits[i] === 0 && !ret) {
      continue;
    }
    ret = digits[i] + unitDes[i] + ret;
  }
  return ret;
};

/**
 * Update the default time units
 * @param {Array.<string>} units The time unit names
 * @param {Array.<number>=} optUnitScales The optional unit scales.
 */
rebar.util.string.setTimeUnits = function (units, optUnitScales) {
  var unitScales = optUnitScales || rebar.util.string.time_units_scale_;
  if (units.length != unitScales.length) {
    return;
  }
  rebar.util.string.time_units_ = units;
  rebar.util.string.time_units_scale_ = unitScales;
};

/**
 * Defines the time unit names
 * @type {Array.<string>}
 * @private
 */
rebar.util.string.time_units_ = ['ms', 'sec', 'min', 'hour', 'day']

/**
 * Defines the time unit scales
 * @type {Array.<number>}
 * @private
 */
rebar.util.string.time_units_scale_ = [1000, 60, 60, 24, Infinity]

/**
 * Convert date string to seconds
 * @param {string} dateStr The date string
 * @param {string=} optFormat The format of date string
 * @return {number}
 */
rebar.util.string.dateStrToSeconds = function (dateStr, optFormat) {
  var date = new Date();
  var parser = new goog.i18n.DateTimeParse(optFormat || 'y-MM-dd HH:mm:ss');
  parser.parse(dateStr, date);
  return Math.floor(date.getTime() / 1000);
};

/**
 * Convert seconds to date string
 * @param {number} secondsTimestamp The seconds
 * @param {string=} optFormat The format of result
 * @return {string}
 */
rebar.util.string.secondsToDateStr = function (secondsTimestamp, optFormat) {
  var formatter = new goog.i18n.DateTimeFormat(optFormat || 'y-MM-dd HH:mm:ss');
  return formatter.format(new Date(secondsTimestamp * 1000));
};

/**
 * Escape string for mysql, copied from following link:
 * http://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly
 * @param {string} str The string to be escaped
 * @return {string}
 */
rebar.util.string.mysqlEscapeString = function (str) {
  return str.replace(/[\u0000\u0008\u0009\u001a\n\r"'\\\%]/g, function (c) {
    switch (c) {
      case '\u0000':
        return '\\0';
      case '\u0008':
        return '\\b';
      case '\u0009':
        return '\\t';
      case '\u001a':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '\'':
      case '"':
      case '\\':
      case '%':
        // prepends a backslash to backslash, percent,
        // and double/single quotes
        return '\\' + c;
    }
  });
};

/**
 * Wrap the query in a string by emphasize tag
 * @param {string} str The content string
 * @param {string} query The query to be emphasized
 * @param {string=} optTag The wrap tag name
 */
rebar.util.string.emphasizeQuery = function (str, query, optTag) {
  if (!query) {
    return str;
  }
  var reg = new RegExp('(' + goog.string.regExpEscape(query) + ')', 'i');
  var tagName = optTag || 'em';
  var replaceStr = '<' + tagName + '>$1</' + tagName + '>';
  return str.replace(reg, replaceStr);
};

/**
 * Get hexadecimal format md5 string
 * @param {string} str The string to be md5 encoded
 * @return {string}
 */
rebar.util.string.hexMd5 = function (str) {
  var md5 = new goog.crypt.Md5();
  md5.update(str);
  return goog.crypt.byteArrayToHex(md5.digest());
};

/**
 * Readable bytes
 * @param {number} bytes The bytes to be formated
 * @param {string} type type
 * @return {string} result result
 */
rebar.util.string.bytesDes = function (bytes) {
  var unitsLen = rebar.util.string.byte_units_.length;
  var unitName = rebar.util.string.byte_units_[unitsLen - 1];
  for (var i = 0; i < unitsLen; ++i) {
    if (bytes < 1024) {
      unitName = rebar.util.string.byte_units_[i];
      break;
    }
    bytes /= 1024;
  }
  if (bytes >= 100) {
    return Math.round(bytes) + unitName;
  }
  return bytes.toFixed(1).replace(/\.*0+$/, '') + unitName;
};

/**
 * The byte units name
 * @type {Array.<string>}
 * @private
 */
rebar.util.string.byte_units_ = ['B', 'K', 'M', 'G', 'T', 'P', 'E'];
