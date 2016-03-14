var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookListSchema = new Schema({
	title: {type: String, required: true},
	description: {type: String, required: true},
	image: {
		type: String,
		required: true,
		validate: {
			validator: function (v) {
				return /(https?:\/\/.*\.(?:png|jpg))/i.test(v);
			},
			message: '{VALUE} is not a valid image url.'
		}
	},
	books: [{
		type: Schema.Types.ObjectId,
		ref: 'book'
	}],
	old_books: [{
		type: Schema.Types.ObjectId,
		ref: 'book_old'
	}],
	followers: [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],

	disable: {type: Boolean, default: false},
	created_by: {type: Schema.Types.ObjectId, ref: 'user', required: true},
	updated_by: {type: Schema.Types.ObjectId, ref: 'user', required: true},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
});

mongoose.model('book_list', BookListSchema, 'book_list');

module.exports = BookListSchema;