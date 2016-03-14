'use strict';

let fs = require('fs');
let redis = require('redis');
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let C = require("../config");
let U = require('./util');

/**
 * 连接mongodb数据库
 *
 * @param db string 要连接的数据库
 * @param conf object 配置信息
 * @return object mongoose对象
 */
exports.connectMongoose = function(db, conf) {
	conf = conf || C.mongo;

	let auth = conf.user ? conf.pass ? `${conf.user}:${conf.pass}@` : `${conf.user}@` : '';
	let link = `${auth}${conf.host}:${conf.port}/${db}`;

	mongoose.Promise = Promise;
	mongoose.connect(`mongodb://${link}`, function (err) {
	    if (err) {
	        console.error(err.message);
	        process.exit(1);
	    } else {
	        console.log("Connect to %s [%s:%s] success!", db, conf.host, conf.port);
	    }
	});

	return mongoose;
}

/**
 * 连接redis数据库
 *
 * @param conf object 配置信息
 * @return object redis对象
 */
exports.connectRedis = function(conf) {
	conf = conf || C.redis;

	var client = redis.createClient(conf.port, conf.host, {});

	client.on('connect', function () {
	    console.log('connect redis [%s:%s] success! ', conf.host, conf.port);
	});

	client.on('error', function(err) {
		console.error(err.message);
	    process.exit(1);
	})

	return client;
}

/**
 * 验证令牌
 *
 * @param token string 令牌
 * @return object err|decoded 错误或解密后的内容
 */
exports.verifyToken = function(token) {
	return new Promise(function(resolve, reject) {
		jwt.verify(token, C.jwt.secret, {
			algorithms: C.jwt.algorithms,
			// audience: C.jwt.audience,
			// issuer: C.jwt.issuer,
			// ignoreExpiration: C.jwt.ignoreExpiration,
			// ignoreNotBefore: C.jwt.ignoreNotBefore,
		}, function(err, decoded) {
			if (err) reject(err);
			else resolve(decoded);
		})
	});
}

/**
 * 生成令牌
 *
 * @param payload 加密的内容
 * @return string 令牌
 */
exports.signToken = function(payload) {
	return new Promise(function(resolve, reject) {
		jwt.sign(payload, C.jwt.secret, {
			algorithms: C.jwt.algorithms,
			expiresIn: "7d"
			// audience: C.jwt.audience,
			// issuer: C.jwt.issuer,
			// ignoreExpiration: C.jwt.ignoreExpiration,
			// ignoreNotBefore: C.jwt.ignoreNotBefore,
		}, function(token) {
			resolve(token);
		})
	})
}

/**
 * 导入某个目录下的所有文件
 *
 * @param path string 目录
 * @param keyfn function 将文件转为key的函数
 * @param excepts string|array 排除文件
 * @return object 读取的模块
 */
exports.import = function(path, keyfn, excepts) {
	if (excepts && !Array.isArray(excepts) && typeof excepts != 'string') 
		throw Error('Excepts type error.');

	excepts = excepts || [];
	excepts = Array.isArray(excepts) ? excepts : [excepts];

	let files = fs.readdirSync(path);
	files = files.filter(function(file) {
		return !~excepts.indexOf(file);
	});

	let modules = {};
	files.forEach(function(file) {
		let key = keyfn ? keyfn(file) : file.split('.').shift();
		if (!key) return;
		modules[key] = require(`${path}/${file}`);
	});

	return modules;
};

/**
 * 密码生成器
 *
 * @param password string 明文密码
 * @param password_salt string 密钥
 * @return string 密文
 */
exports.generatePassword = function(password, password_salt) {
	return U.md5(password + password_salt);
}