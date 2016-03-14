'use strict';

let koa = require('koa');
let body = require('koa-body');
let logger = require('koa-logger');
let router = require('./router');
let middleware = require('./middleware');
let C = require('./config');
let H = require('./library/helper');
let app = koa();

// 连接数据库
let mongoose = H.connectMongoose('test-backend');
let redis = H.connectRedis();

// 加载数据模型
require('./schema');

app.use(logger());
app.use(function* (next) {
	this.mongoose = mongoose;
	this.redis = redis;
	yield next;
});
app.use(body({formidable:{uploadDir: __dirname}}));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(C.port, function() {
	console.log('App is listenning on port %s.', C.port);
});