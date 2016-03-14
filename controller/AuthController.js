'use strict';

let C = require('../config');
let U = require('../library/util');
let H = require('../library/helper');

exports.index = function*() {
	this.body = 'index';
};

exports.verify = function*() {
	try {
		let mobile = this.params.mobile;
		let password = this.params.password;

		let UserModel = this.mongoose.model('user');
		let user = yield UserModel.findOne({mobile: mobile}).exec();
		if (!user) {
			this.status = 410;
			this.body = {message: '用户不存在', timestamp: new Date()};
		} else if (user.password != H.generatePassword(password, user.password_salt)) {
			this.status = 400;
			this.body = {message: '密码错误', timestamp: new Date()};
		} else {
			user = U.extend({}, user, {password: null, password_salt: null}, U.extend.RN);
			let token = yield H.signToken(user);
			this.status = 200;
			this.body = {message: '正确', data: {token: token}};
		}	
	} catch (e) {
		console.log(e.stack);
		this.status = 500;
	}
};

exports.register = function*() {
	try {
		if (!this.request.body.mobile) {
			this.status = 400;
			this.body = {message: 'Mobile number is required!'};
			return ;
		}
		if (!this.request.body.password) {
			this.status = 400;
			this.body = {message: 'Password is required!'};
			return ;
		}
		let password_salt = U.randomString(8);
		let body = U.extend(this.request.body, {
			password: H.generatePassword(this.request.body.password, password_salt),
			password_salt: password_salt
		}, U.extend.RN);

		let UserModel = this.mongoose.model('user');
		let e_user = new UserModel(body);

		let ret = yield e_user.save();
		this.body = {message: '成功', data: ret};
	} catch (e) {
		console.log(e.stack);
		switch (e.code) {
			case 11000:
				this.status = 409;
				this.body = {message: '冲突，创建失败', timestamp: new Date()}
				break;
			default: 
				this.status = 500;
		}
	}
};