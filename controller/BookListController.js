'use strict';

let U = require('../library/util');

exports.create = function*() {
	try {
		let body = this.request.body;
		if (!body.books || !Array.isArray(body.books) || !body.books.length) {
			this.status = 400;
			this.body = {message: '缺少书籍ID列表'};
			return ;
		}
		body.books = body.books.filter(function(book_id) {
			return U.isObjectId(book_id);
		});

		let BookModel = this.mongoose.model('book');
		let BookOldModel = this.mongoose.model('book_old');
		let BookListModel = this.mongoose.model('book_list');

		let books = yield BookModel.find({_id: {$in: body.books}, disable: false}).exec();
		let old_books = yield BookOldModel.find({_id: {$in: body.books}, disable: false}).exec();

		body.books = books.map(function(book) {
			return book._id;
		});
		body.old_books = old_books.map(function(book) {
			return book._id;
		});

		let e_book_list = new BookListModel(body);
		let ret = yield e_book_list.save();

		this.status = 200;
		this.body = {message: '成功', data: ret};
	} catch (e) {
		console.log(e.stack);
		if (/validation\sfailed$/.test(e.message)) {
			this.status = 400;
			this.body = {message: '参数有误'};
			return ;
		}
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

exports.update = function*() {
	try {
		let body = this.request.body;
		body.updated_by = this.user._id;

		let BookListModel = this.mongoose.model('book_list');
		let e_book_list = yield BookListModel.findOne({_id: body.book_list_id, disable: false}).exec();
		if (!e_book_list) {
			this.status = 410;
			this.body = {message: '不存在该书单'};
			return ;
		}

		if (body.books && Array.isArray(body.books) && body.books.length) {
			body.books = body.books.filter(function(book_id) {
				return U.isObjectId(book_id);
			});

			let BookModel = this.mongoose.model('book');
			let BookOldModel = this.mongoose.model('book_old');

			let books = yield BookModel.find({_id: {$in: body.books}, disable: false}).exec();
			let old_books = yield BookOldModel.find({_id: {$in: body.books}, disable: false}).exec();	

			e_book_list.books = books.map(function(book) {
				return book._id;
			});
			e_book_list.old_books = old_books.map(function(book) {
				return book._id;
			});
		}
		
		if (body.title) e_book_list.title = body.title;
		if (body.description) e_book_list.description = body.description;
		if (body.image) e_book_list.image = body.image;

		let ret = yield e_book_list.save();

		this.status = 200;
		this.body = {message: '成功', data: ret};
	} catch (e) {
		console.log(e.stack);
		if (/validation\sfailed$/.test(e.message)) {
			this.status = 400;
			this.body = {message: '参数有误'};
			return ;
		}
		this.status = 500;	
	}};

exports.read = function*() {
	try {
		let book_list_id = this.params.book_list_id;

		let BookListModel = this.mongoose.model('book_list');
		let e_book_list = yield BookListModel.findOne({_id: book_list_id, disable: false}).exec();
		if (!e_book_list) {
			this.status = 410;
			this.body = {message: '不存在该书单'};
			return;
		}

		this.status = 200;
		this.body = {message: '成功', data: e_book_list};
	} catch (e) {
		console.log(e.stack);
		this.status = 500;
	}
};

exports.delete = function*() {
	try {
		let book_list_id = this.params.book_list_id;
		let BookListModel = this.mongoose.model('book_list');
		let ret = yield BookListModel.update({
			_id: book_list_id
		}, {$set: {
			disable: true, 
			updated_by: this.user._id
		}}).exec();

		this.status = 200;
		this.body = {message: '成功', data: ret && ret.nModified};
	} catch (e) {
		console.log(e.stack);
		this.status = 500;
	}
}