'use strict';

let U = require('../library/util');

exports.setting = function* () {
	try {
		let body = U.extend(this.request.body, {
			attention_to_users: null,
			attention_to_books: null,
			attention_to_musics: null
		}, U.extend.RN);
		if (body.schools && body.schools.length) {
			body.schools = body.schools.sort(function(a, b) {
				return (a.from || 0) - (b.from || 0);
			});
		}

		let m_user = this.mongoose.model('user');
		let user = yield m_user.findOne({_id: this.user._id});
		if (!user) {
			this.status = 410;
			this.body = {message: '用户不存在'};
			return ;
		}
		if (body.father_id) {
			let father = yield m_user.findOne({_id: body.father_id});
			if (!father) {
				this.status = 410;
				this.body = {message: '父亲不存在'};
				return ;
			}
			user.father = father._id;
			if (!~father.children.indexOf(user._id)) {
				father.children.push(user._id);
				yield father.save();
			}
		}
		if (body.mother_id) {
			let mother = yield m_user.findOne({_id: body.mother_id});
			if (!mother) {
				this.status = 410;
				this.body = {message: '母亲不存在'};
				return ;
			}
			user.mother = mother._id;
			if (!~mother.children.indexOf(user._id)) {
				mother.children.push(user._id);
				yield mother.save();
			}
		}
		if (body.lover_id) {
			let lover = yield m_user.findOne({_id: body.lover_id});
			if (!lover) {
				this.status = 410;
				this.body = {message: '爱人不存在'};
				return ;
			}
			user.lover = lover._id;
		}
		
		if (body.name) user.name = body.name;
		if (body.nickname) user.nickname = body.nickname;
		if (body.email) user.email = body.email;
		if (body.qq) user.qq = body.qq;
		if (body.birthday) user.birthday = body.birthday;
		if (body.gender) user.gender = body.gender;
		if (body.schools) user.schools = body.schools;

		let ret = yield user.save();
		this.status = 200;
		this.body = {message: '成功', data: ret};
	} catch (e) {
		console.log(e.stack);
		if (e.message === 'user validation failed') {
			this.status = 400;
			this.body = {message: '参数有误'};
			return ;
		}
		this.status = 500;
	}
}

exports.attentionToUser = function* () {
	try {
		let user_id = this.request.body.user_id;

		let UserModel = this.mongoose.model('user');
		
		// 查找目标用户
		let e_user = new UserModel({_id: user_id, disable: false});
		if (!e_user) {
			this.status = 410;
			this.body = {message: '目标用户不存在'};
			return ;
		}
		if (!~e_user.followers.indexOf(this.user._id)) {
			e_user.followers.push(this.user._id);
		}
		yield e_user.save();
		
		// 查找当前用户
		let e_me = new UserModel({_id: this.user._id, disable: false});
		if (!e_me) {
			this.status = 410;
			this.body = {message: '当前用户不存在'};
			return ;
		}
		if (!~e_me.attention_to_users.indexOf(user_id)) {
			e_me.attention_to_users.push(user_id);
		}
		yield e_me.save();

		this.status = 200;
		this.body = {message: '成功'};
	} catch (e) {
		console.log(e.stack);
		this.status = 500;
	}
}

exports.cancelAttentionToUser = function* () {
	try {
		let user_id = this.request.body.user_id;

		let UserModel = this.mongoose.model('user');
		let index;
		
		// 查找目标用户
		let e_user = new UserModel({_id: user_id, disable: false});
		if (!e_user) {
			this.status = 410;
			this.body = {message: '目标用户不存在'};
			return;
		}
		if (~(index = e_user.followers.indexOf(this.user._id))) {
			e_user.followers.splice(index, 1);
		}
		yield e_user.save();

		// 查找当前用户
		let e_me = new UserModel({_id: this.user._id, disable: false});
		if (!e_me) {
			this.status = 410;
			this.body = {message: '当前用户不存在'};
			return;
		}
		if (~(index = e_me.attention_to_users.indexOf(user_id))) {
			e_me.attention_to_users.splice(index, 1);
		}
		yield e_me.save();

		this.status = 200;
		this.body = {message: '成功'};
	} catch (e) {
		console.log(e.stack);
		this.status = 500;
	}
}

exports.collectBookList = function* () {
	try {
		let book_list_id = this.request.body.book_list_id;

		let UserModel = this.mongoose.model('user');
		let BookListModel = this.mongoose.model('book_list');

		// 查找书单
		let e_book_list = new BookListModel({_id: book_list_id, disable: false});
		if (!e_book_list) {
			this.status = 410;
			this.body = {message: '书单不存在'};
			return ;
		}
		if (!~e_book_list.followers.indexOf(this.user._id)) {
			e_book_list.push(this.user._id);
			yield e_book_list.save();
		}

		// 查找当前用户
		let e_me = new UserModel({_id: this.user._id, disable: false});
		if (!e_me) {
			this.status = 410;
			this.body = {message: '当前用户不存在'};
			return ;
		}
		if (!~e_me.collect_book_list.indexOf(book_list_id)) {
			e_me.collect_book_list.push(book_list_id);
			yield e_me.save();
		}
		
		this.status = 200;
		this.body = {message: '成功'};
	} catch (e) {
		console.log(e.stack);
		this.status = 500;
	}
};

exports.cancelCollectBookList = function* () {
	try {
		let book_list_id = this.request.body.book_list_id;

		let UserModel = this.mongoose.model('user');
		let BookListModel = this.mongoose.model('book_list');
		let index;

		// 查找书单
		let e_book_list = new BookList({_id: book_list_id, disable: false});
		if (!e_book_list) {
			this.status = 410;
			this.body = {message: '书单不存在'};
			return ;
		}
		if (~(index = e_book_list.followers.indexOf(this.user._id))) {
			e_book_list.followers.splice(this.user._id, 1);
			yield e_book_list.save();
		}
		
		// 查找当前用户
		let e_me = new UserModel({_id: this.user._id, disable: false});
		if (!e_me) {
			this.status = 410;
			this.body = {message: '当前用户不存在'};
			return ;
		}
		if (~(index = e_me.collect_book_list.indexOf(book_list_id))) {
			e_me.collect_book_list.splice(index, 1);
			yield e_me.save();
		}

		this.status = 200;
		this.body = {message: '成功'};
	} catch (e) {
		console.log(e.stack);
		this.status = 500;
	}
};
