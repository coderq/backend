'use strict';

exports.create = function* () {
	try {
		let body = this.request.body;
		body.created_by = this.user._id;
		body.updated_by = this.user._id;

		let BookModel = this.mongoose.model(body.isbn13 ? 'book' : 'book_old');
		let e_book = new BookModel(body);
		let ret = yield e_book.save();

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

exports.update = function* () {
	try {
		let body = this.request.body;
		body.updated_by = this.user._id;

		let BookModel = this.mongoose.model('book');
		let BookOldModel = this.mongoose.model('book_old');
		let e_book = (yield BookModel.findOne({_id: body.book_id}).exec()) || (yield BookOldModel.findOne({_id: body.book_id}).exec());
		if (!e_book || e_book.disable) {
			this.status = 410;
			this.body = {message: '书籍不存在'};
			return ;
		}

		if (body.title) e_book.title = body.title;
		if (body.publisher) e_book.publisher = body.publisher;
		if (body.publish_data) e_book.publish_data = body.publish_data;
		if (body.subtitle) e_book.subtitle = body.subtitle;
		if (body.isbn10) e_book.isbn10 = body.isbn10;
		if (body.isbn13) e_book.isbn13 = body.isbn13;
		if (body.number) e_book.number = body.number;
		if (body.price) e_book.price = body.price;
		if (body.translator) e_book.translator = body.translator;
		if (body.author) e_book.author = body.author;
		if (body.origin_title) e_book.origin_title = body.origin_title;
		if (body.page) e_book.page = body.page;
		if (body.binding) e_book.binding = body.binding;
		if (body.score) e_book.score = body.score;
		if (body.intro) e_book.intro = body.intro;
		if (body.tags) e_book.tags = body.tags;
		if (body.images) e_book.images = body.images;

		let ret = yield e_book.save();
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
	}
};

exports.read = function* () {
	try {
		let book_id = this.params.book_id;

		let BookModel = this.mongoose.model('book');
		let BookOldModel = this.mongoose.model('book_old');
		let e_book = (yield BookModel.findOne({
			_id: book_id, 
			disable: false
		}).exec()) || (yield BookOldModel.findOne({
			_id: book_id,
			disable: false
		}).exec());
		if (!e_book || e_book.disable) {
			this.status = 410;
			this.body = {message: '书籍不存在'};
			return ;
		}

		this.status = 200;
		this.body = {message: '成功', data: e_book};
	} catch (e) {
		console.log(e.stack);
		this.status = 500;
	}
}

exports.delete = function*() {
	try {
		let book_id = this.params.book_id;

		let BookModel = this.mongoose.model('book');
		let BookOldModel = this.mongoose.model('book_old');

		let b_ret, bo_ret;
		b_ret = yield BookModel.update({
			_id: book_id
		}, {$set: {
			disable: true, 
			updated_by: this.user._id
		}}).exec();
		if (!b_ret.nModified) {
			bo_ret = yield BookOldModel.update({
				_id: book_id
			}, {$set: {
				disable: true, 
				updated_by: this.user._id
			}}).exec();
		}

		this.status = 200; 
		this.body = {message: '成功', data: b_ret.nModified || bo_ret.nModified};
	} catch (e) {
		console.log(e.stack);
		this.status = 500;
	}
};