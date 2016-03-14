'use strict';

let jwt = require('jsonwebtoken');
let C = require('../library/util');
let H = require('../library/helper');

exports.authenticate = function*(next) {
	try {
		let token = this.query.token;
		if (!token) {
			this.status = 401;
			this.body = {message: '请传送令牌'};
			return ;
		}
		let ret = yield H.verifyToken(token);
		this.user = ret;
		yield next;
	} catch (e) {
		this.status = 401;
		this.body = {message: '令牌已失效'};
	}	
};