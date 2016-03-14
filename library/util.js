'use strict';

let util = require('util');

/**
 * 判断一个对象书否为ObjectId
 *
 * @param obj 对象
 * @return boolean
 */
let isObjectId = function(obj) {
    return util.isString(obj) && /^[0-z]{24,24}$/.test(obj);
}

/**
 * md5
 * 
 * @param string 加密的明文或文件路径
 * @param type 类型，加密字符串活加密文件内容
 * @return string 密文
 */
let md5 = function(string, type) {
    let crypto = require('crypto');
    let hash = crypto.createHash('md5');
    let is_file = type & md5.file;

    if (is_file) {
        var fs = require('fs');
        if (!fs.existsSync(string) || !fs.openSync(string)) {
            throw Error('无效的文件');
        }
        string = fs.readFileSync(string);
    }
    hash.update(string);
    return hash.digest('hex');
};
/**
 * 字符串
 */
md5.string = 0;
/**
 * 文件
 */
md5.file = 1;

/**
 * extend
 *
 * @param [object1, object2, ..., <options>]
 * @return object
 */
let extend = function() {
    let params = Array.prototype.slice.call(arguments),
        method = 'number' == typeof params[params.length - 1] ? params.pop() : 0,
        ret = method & extend.replaceFirst ? params.shift() : {},
        deep = method & extend.deepExtend,
        rmNull = method & extend.removeNull,
        obj;

    while (params.length) {
        obj = params.shift();
        for (var k in obj) {
            if (null === obj[k]) {
                rmNull ? delete ret[k] : ret[k] = obj[k];
            } else if (!ret[k] || ret[k].constructor !== Object || obj[k].constructor !== Object) {
                ret[k] = obj[k];
            } else {
                ret[k] = deep ? extend(ret[k], obj[k], method) : obj[k];
            }
        }
    }
    return ret;
};
/**
 * 将结果赋值给第一个对象
 */
extend.replaceFirst = extend.RF = 1;
/**
 * 深度合并
 */
extend.deepExtend = extend.DE = 2;
/**
 * 删除值为null的键
 */
extend.removeNull = extend.RN = 4;

/**
 * 生成随机字符串
 *
 * @param total 字符串长度
 * @param method 字符串类型，数字／小写字母／大写字母
 * @return string
 */
let randomString = function(total, method) {
    let codes = [], ret = '';
    method = method || 7;
    if (method & randomString.number) {
        let number_codes = new Array(10).fill(0).map(function(item, index) {return 48 + index;});
        codes = codes.concat(number_codes);
    }
    if (method & randomString.lower) {
        let number_codes = new Array(26).fill(0).map(function(item, index) {return 97 + index;});
        codes = codes.concat(number_codes);
    }
    if (method & randomString.upper) {
        let number_codes = new Array(26).fill(0).map(function(item, index) {return 65 + index;});
        codes = codes.concat(number_codes);
    }
    while (total--) {
        ret += String.fromCharCode(codes[Math.floor(Math.random() * codes.length)]);
    }
    return ret;
};
/**
 * 数字
 */
randomString.number = 1;
/** 
 * 小写字母
 */
randomString.lower = 2;
/**
 * 大写字母
 */
randomString.upper = 4;

module.exports = extend(util, {
    isObjectId: isObjectId,
    md5: md5,
    extend: extend,
    randomString: randomString
});