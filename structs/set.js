/**
 * @fileoverview 拷贝自goog.struts.Set
 * @author hector<zzh-83@163.com>
 */
/* jshint camelcase: false */
/* jshint iterator: true */
/* eslint-disable no-iterator */
goog.provide('baidu.ls.structs.Set');

goog.require('goog.structs');
goog.require('goog.structs.Collection');
goog.require('goog.structs.Map');



/**
 * 拷贝自goog.structs.Set，那个有一点太矬了，每个对象都是唯一的，不管值是什么
 * @param {Array|Object=} optValues Initial values to start with.
 * @constructor
 * @implements {goog.structs.Collection}
 */
baidu.ls.structs.Set = function (optValues) {
    this.map_ = new goog.structs.Map();
    if (optValues) {
        this.addAll(optValues);
    }
};


/**
 * Obtains a unique key for an element of the set.  Primitives will yield the
 * same key if they have the same type and convert to the same string.  Object
 * references will yield the same key only if they refer to the same object.
 * @param {*} val Object or primitive value to get a key for.
 * @return {string} A unique key for this value/object.
 * @private
 */
baidu.ls.structs.Set.getKey_ = function (val) {
    var type = typeof val;
    return type.substr(0, 1) + val;
};


/**
 * @return {number} The number of elements in the set.
 * @override
 */
baidu.ls.structs.Set.prototype.getCount = function () {
    return this.map_.getCount();
};


/**
 * Add a primitive or an object to the set.
 * @param {*} element The primitive or object to add.
 * @override
 */
baidu.ls.structs.Set.prototype.add = function (element) {
    this.map_.set(baidu.ls.structs.Set.getKey_(element), element);
};


/**
 * Adds all the values in the given collection to this set.
 * @param {Array|Object} col A collection containing the elements to add.
 */
baidu.ls.structs.Set.prototype.addAll = function (col) {
    var values = goog.structs.getValues(col);
    var l = values.length;
    for (var i = 0; i < l; i++) {
        this.add(values[i]);
    }
};


/**
 * Removes all values in the given collection from this set.
 * @param {Array|Object} col A collection containing the elements to remove.
 */
baidu.ls.structs.Set.prototype.removeAll = function (col) {
    var values = goog.structs.getValues(col);
    var l = values.length;
    for (var i = 0; i < l; i++) {
        this.remove(values[i]);
    }
};


/**
 * Removes the given element from this set.
 * @param {*} element The primitive or object to remove.
 * @return {boolean} Whether the element was found and removed.
 * @override
 */
baidu.ls.structs.Set.prototype.remove = function (element) {
    return this.map_.remove(baidu.ls.structs.Set.getKey_(element));
};


/**
 * Removes all elements from this set.
 */
baidu.ls.structs.Set.prototype.clear = function () {
    this.map_.clear();
};


/**
 * Tests whether this set is empty.
 * @return {boolean} True if there are no elements in this set.
 */
baidu.ls.structs.Set.prototype.isEmpty = function () {
    return this.map_.isEmpty();
};


/**
 * Tests whether this set contains the given element.
 * @param {*} element The primitive or object to test for.
 * @return {boolean} True if this set contains the given element.
 * @override
 */
baidu.ls.structs.Set.prototype.contains = function (element) {
    return this.map_.containsKey(baidu.ls.structs.Set.getKey_(element));
};


/**
 * Tests whether this set contains all the values in a given collection.
 * Repeated elements in the collection are ignored, e.g.  (new
 * baidu.ls.structs.Set([1, 2])).containsAll([1, 1]) is True.
 * @param {Object} col A collection-like object.
 * @return {boolean} True if the set contains all elements.
 */
baidu.ls.structs.Set.prototype.containsAll = function (col) {
    return goog.structs.every(col, this.contains, this);
};


/**
 * Finds all values that are present in both this set and the given collection.
 * @param {Array|Object} col A collection.
 * @return {!baidu.ls.structs.Set} A new set containing all the values (primitives
 *   or objects) present in both this set and the given collection.
 */
baidu.ls.structs.Set.prototype.intersection = function (col) {
    var result = new baidu.ls.structs.Set();

    var values = goog.structs.getValues(col);
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        if (this.contains(value)) {
            result.add(value);
        }
    }

    return result;
};


/**
 * Finds all values that are present in this set and not in the given
 * collection.
 * @param {Array|Object} col A collection.
 * @return {!baidu.ls.structs.Set} A new set containing all the values
 *   (primitives or objects) present in this set but not in the given
 *   collection.
 */
baidu.ls.structs.Set.prototype.difference = function (col) {
    var result = this.clone();
    result.removeAll(col);
    return result;
};


/**
 * Returns an array containing all the elements in this set.
 * @return {!Array} An array containing all the elements in this set.
 */
baidu.ls.structs.Set.prototype.getValues = function () {
    return this.map_.getValues();
};


/**
 * Creates a shallow clone of this set.
 * @return {!baidu.ls.structs.Set} A new set containing all the same elements as
 *   this set.
 */
baidu.ls.structs.Set.prototype.clone = function () {
    return new baidu.ls.structs.Set(this);
};


/**
 * Tests whether the given collection consists of the same elements as this set,
 * regardless of order, without repetition.  Primitives are treated as equal if
 * they have the same type and convert to the same string; objects are treated
 * as equal if they are references to the same object.  This operation is O(n).
 * @param {Object} col A collection.
 * @return {boolean} True if the given collection consists of the same elements
 *   as this set, regardless of order, without repetition.
 */
baidu.ls.structs.Set.prototype.equals = function (col) {
    return this.getCount() === goog.structs.getCount(col) && this.isSubsetOf(col);
};


/**
 * Tests whether the given collection contains all the elements in this set.
 * Primitives are treated as equal if they have the same type and convert to the
 * same string; objects are treated as equal if they are references to the same
 * object.  This operation is O(n).
 * @param {Object} col A collection.
 * @return {boolean} True if this set is a subset of the given collection.
 */
baidu.ls.structs.Set.prototype.isSubsetOf = function (col) {
    var colCount = goog.structs.getCount(col);
    if (this.getCount() > colCount) {
        return false;
    }
    // TODO(user) Find the minimal collection size where the conversion makes
    // the contains() method faster.
    if (!(col instanceof baidu.ls.structs.Set) && colCount > 5) {
        // Convert to a baidu.ls.structs.Set so that goog.structs.contains runs in
        // O(1) time instead of O(n) time.
        col = new baidu.ls.structs.Set(col);
    }
    return goog.structs.every(this, function (value) {
        return goog.structs.contains(col, value);
    });
};


/**
 * Returns an iterator that iterates over the elements in this set.
 * @param {boolean=} optKeys This argument is ignored.
 * @return {!goog.iter.Iterator} An iterator over the elements in this set.
 */
baidu.ls.structs.Set.prototype.__iterator__ = function (optKeys) {
    return this.map_.__iterator__(false);
};
