/**
 * @fileoverview 数据模型基类
 * @author hector<zzh-83@163.com>
 */
/* jshint -W069 */
/* eslint-disable fecs-properties-quote */
/* eslint-disable fecs-dot-notation */
/* eslint-disable new-cap */
goog.provide('rebar.mvc.BaseModel');

goog.require('goog.json');

/**
 * 所有model应该继承的基类。
 *
 * 关于toJson和initWithJson方法，首先要提到js的一个特点，就是如果对象user的值为
 * {isAdmin: true}，那么user.isAdmin和user['isAdmin']得到的结果是一样的。第一种
 * 方法是通过属性来访问，第二种是通过字符串下标来访问。其次要提到
 * closure compiler的高级编译模式的一个特性
 * （https://developers.google.com/closure/compiler/docs/api-tutorial3）。
 * 如该链接中所述，对象属性名在编译前后是不一样的 ，但是通过ajax请求得到的
 * 服务器返回的数据对象（称之为外部对象）的属性名却是不会改变的，那么就会导致
 * 编译后对外部对象的属性的引用失效。解决方案是将一个外部对象作为参数调用该类
 * 实例的initWithJson方法，在该方法中通过字符串下标来访问外部对象的属性，并赋值
 * 给该对象的字段，然后程序中再不和外部对象交互。toJson是解决将对象提供给外部
 * 使用的问题（比如通过ajax来POST一个对象给服务器），在toJson方法里创建一个外部
 * 对象，然后将该类实例的字段赋值给外部对象通过字符串下标访问的属性，即可生成一个
 * 外部对象。上面是以和服务器交互的角度阐述这个问题的，其实对于任何不在closure
 * 编译体系内的对象，都应该通过这一层方法处理后再使用。这两个方法其实是定义了
 * 和外部对象的交互接口。
 *
 * 关于该类的另一个用处是和js的如下特点有关的。假设一个js的对象user的值为{}，那么
 * 可以在任意时刻为它添加属性，比如user.isAdmin = true，添加以后就可以访问。如果
 * 一个数据对象在不同的位置不同的条件下添加许多不同的属性，就很难在一个时刻知道
 * 它到底有哪些属性，尤其是阅读代码的时候更加难以搞清楚这个对象到底有哪些属性。
 * 这里给它定义成一个model类，只使用model类中出现过的字段，那么代码读起来就
 * 一目了然了。并且定义字段时可以指定类型，那么在使用的地方如果类型不匹配还会
 * 编译报错，这样修改代码的时候会更有底气。
 *
 * @constructor
 */
rebar.mvc.BaseModel = function () {
};

/**
 * 转换成一个纯粹表示数据的json对象。一般的做法是创建一个空对象，然后将该类实例
 * 的字段赋值给该对象通过字符串下标访问的属性，最后返回这个空对象。
 *
 * 但是如果该类的某个字段不是基本类型，那么分几种情况。一是某个字段的类型也是
 * BaseModel，那么赋值时要调用该字段的toJson方法；二是某个字段是个元素为基本
 * 类型的Array，那么直接赋值即可；三是某个字段是元素类型为BaseModel的Array，那么
 * 使用以该字段为参数调用listToJson的返回值来赋值；四是某个字段是value为
 * BaseModel类型的map，那么要新建一个同样key但是value为对应BaseModel类型的
 * value调用toJson方法结果的map来赋值；其他复杂的复合类型很少使用，如遇到按要自行
 * 实现复杂的toJson方法，原则就是复合类型里的每个BaseModel都要调用toJson方法。
 *
 * @return {Object}
 */
rebar.mvc.BaseModel.prototype.toJson = function () {
    return {};
};

/**
 * @return {string}
 */
rebar.mvc.BaseModel.prototype.toJsonString = function () {
    return goog.json.serialize(this.toJson());
};

/**
 * 以json对象来初始化该类实例，一般的做法是将通过字符串下标引用的obj参数的属性值
 * 赋值给该类对应的字段。
 *
 * 对于该类的某个字段为复合对象的情况可以参考toJson方法，注意引用obj的属性一定
 * 要使用字符串下标的形式。如果某个字段的类型也是BaseModel，那么将obj参数的对应
 * 属性作为参数调用该字段的initWithJson方法；如果某个字段是元素为基本类型的
 * 数组，那么直接将obj参数的对应属性赋值即可；如果某个字段是元素类型为BaseModel
 * 的Array并且所有元素的实际类型一致（不可以一个元素是BaseModel的子类型A而另一个
 * 是子类型B），那么要调用initList方法。这里的原则是每个类型为BaseModel的字段都
 * 要通过initWithJson来赋值。
 *
 * @see toJson
 * @param {Object} obj The object used to initialize.
 * @return {boolean} 返回true表示init成功
 */
rebar.mvc.BaseModel.prototype.initWitJson = function (obj) {
    // do nothing in base class
    return !!obj;
};

/**
 * 克隆对象
 * @return {rebar.mvc.BaseModel}
 */
rebar.mvc.BaseModel.prototype.clone = function () {
    var model = new this.constructor();
    model.initWitJson(this.toJson());
    return model;
};

/**
 * Initialize a list of object derrived from rebar.mvc.BaseModel
 * @see initWitJson
 * @param {Array|Object} objList
 * @param {Function=} ctor The constructor
 * @return {Array.<rebar.mvc.BaseModel>}
 */
rebar.mvc.BaseModel.prototype.initList = function (objList, ctor) {
    return rebar.mvc.BaseModel.initList(objList, ctor || this.constructor);
};

/**
 * @see toJson
 * @param {Array.<rebar.mvc.BaseModel>} list
 * @return {Array.<Object>}
 */
rebar.mvc.BaseModel.prototype.listToJson = function (list) {
    return rebar.mvc.BaseModel.listToJson(list);
};

/**
 * @param {Array.<Object>} list
 * @param {rebar.mvc.KVDefinition} kvDef
 * @return {Object.<string, *>}
 */
rebar.mvc.BaseModel.prototype.initMapWithKVList = function (list, kvDef) {
    return rebar.mvc.BaseModel.initMapWithKVList(list, kvDef);
};

/**
 * @param {Object.<string, *>} map
 * @param {rebar.mvc.KVDefinition} kvDef
 * @return {Array.<Object>}
 */
rebar.mvc.BaseModel.prototype.mapToKVListJson = function (map, kvDef) {
    return rebar.mvc.BaseModel.mapToKVListJson(map, kvDef);
};

/**
 * @see toJson
 * @param {Array.<rebar.mvc.BaseModel>} list
 * @return {Array.<Object>}
 */
rebar.mvc.BaseModel.listToJson = function (list) {
    var ret = [];
    goog.array.forEach(list || [], function (item) {
        ret.push(item.toJson());
    });
    return ret;
};

/**
 * @see initWitJson
 * Initialize a list of object derrived from rebar.mvc.BaseModel
 * @param {Array|Object} objList
 * @param {Function} ctor The constructor
 * @return {Array.<rebar.mvc.BaseModel>}
 */
rebar.mvc.BaseModel.initList = function (objList, ctor) {
    var ret = [];
    goog.object.forEach(objList || [], function (obj) {
        var info = new ctor();
        info.initWitJson(obj);
        ret.push(info);
    });
    return ret;
};

/**
 * @param {Array.<Object>} list
 * @param {rebar.mvc.KVDefinition} kvDef
 * @return {Object.<string, *>}
 */
rebar.mvc.BaseModel.initMapWithKVList = function (list, kvDef) {
    var ret = {};
    if (!list) {
        return ret;
    }
    for (var i = 0; i < list.length; ++i) {
        ret[list[i][kvDef.getKeyName()]] = list[i][kvDef.getValName()];
    }
    return ret;
};

/**
 * @param {Object.<string, *>} map
 * @param {rebar.mvc.KVDefinition} kvDef
 * @return {Array.<Object>}
 */
rebar.mvc.BaseModel.mapToKVListJson = function (map, kvDef) {
    var ret = [];
    if (!map) {
        return ret;
    }
    goog.object.forEach(map, function (val, key) {
        var item = {};
        item[kvDef.getKeyName()] = key;
        item[kvDef.getValName()] = val;
        ret.push(item);
    });
    return ret;
};

/**
 * @constructor
 */
rebar.mvc.BaseModel.CachedFetcher = function () {

    /**
     * @type {Object.<string, *>}
     * @private
     */
    this.cachedData_ = {};

    /**
     * @type {Object.<string, Array.<Function>>}
     * @private
     */
    this.waitingCallbacks_ = {};
};

/**
 * 注意，如果只是简单的缓存请求结果，可以直接使用jquery的ajax的cache参数
 *
 * @param {function(function(boolean, *))} fetcher The fetcher function.
 *     The function parameter is a callback used to be triggered when data
 *     has been fetched, the boolean parameter is used
 *     to indicate whether succeed, the other parameter is used to transfer the data.
 * @param {string} key The key used to fetch data.
 * @param {function(boolean, *)} callback The callback function used when data ready.
 * @param {boolean=} optRefresh Whether to refres.
 */
rebar.mvc.BaseModel.CachedFetcher.prototype.getByKey = function (
    fetcher, key, callback, optRefresh) {
    if (!optRefresh && this.cachedData_.hasOwnProperty(key)) {
        callback.call(null, true, this.cachedData_[key]);
        return;
    }

    if (!this.waitingCallbacks_[key]) {
        this.waitingCallbacks_[key] = [callback];
    } else {
        this.waitingCallbacks_[key].push(callback);
        return;
    }
    fetcher.call(null, goog.bind(function (succeed, data) {
        if (succeed) {
            this.cachedData_[key] = data;
        }
        var funs = this.waitingCallbacks_[key];
        delete this.waitingCallbacks_[key];
        goog.array.forEach(funs, goog.bind(function (f) {
            f.call(null, succeed, this.cachedData_[key]);
        }, this));
    }, this));
};

/**
 * @param {string} keyName
 * @param {string} valName
 * @constructor
 */
rebar.mvc.KVDefinition = function (keyName, valName) {
    /**
     * @type {string}
     * @private
     */
    this.keyName_ = keyName;

    /**
     * @type {string}
     * @private
     */
    this.valName_ = valName;
};

/**
 * @return {string}
 */
rebar.mvc.KVDefinition.prototype.getKeyName = function () {
    return this.keyName_;
};

/**
 * @return {string}
 */
rebar.mvc.KVDefinition.prototype.getValName = function () {
    return this.valName_;
};

/**
 * @param {number=} start
 * @param {number=} end
 * @constructor
 * @extends {rebar.mvc.BaseModel}
 */
rebar.mvc.NumberRange = function (start, end) {
    /**
     * @type {number}
     */
    this.start = goog.isNumber(start) ? start : -Infinity;
    /**
     * @type {number}
     */
    this.end = goog.isNumber(end) ? end : Infinity;
};

/**
 * @return {boolean}
 */
rebar.mvc.NumberRange.prototype.isUniversal = function () {
    return !isFinite(this.start) && !isFinite(this.end) && this.start < this.end;
};

/**
 * @override
 */
rebar.mvc.NumberRange.prototype.toJson = function () {
    var ret = {};
    if (isFinite(this.start)) {
        ret['s'] = this.start;
    }
    if (isFinite(this.end)) {
        ret['e'] = this.end;
    }
    return ret;
};

/**
 * @override
 */
rebar.mvc.NumberRange.prototype.initWitJson = function (obj) {
    if (!obj) {
        return false;
    }
    if (goog.isNumber(obj['s'])) {
        this.start = obj['s'];
    }
    if (goog.isNumber(obj['e'])) {
        this.end = obj['e'];
    }
    return true;
};

