var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: {type: String, required: true, trim: true},
	publisher: {type: String, required: true, trim: true},
	publish_date: {
		type: String, 
		required: true,
		validate: {
			validator: function(v) {
				return /^\d{4,4}\-\d{1,2}$/.test(v);
			},
			message: '{VALUE} is not a valid publish date.'
		}
	},
	subtitle: {type: String, default: '', trim: true},
	isbn10: {
		type: String, 
		validate: {
			validator: function(v) {
				return !v || /^\d{10,10}$/.test(v);
			},
			message: '{VALUE} is not a valid isbn10.'
		}
	},
	isbn13: {
		type: String, 
		required: true, 
		validate: {
			validator: function(v) {
				return /^\d{13,13}$/.test(v);
			},
			message: '{VALUE} is not a valid isbn13.'
		}
	},
	price: {type: Number, default: 0},
	translator: [String],
	author: [String],
	origin_title: {type: String, default: '', trim: true},
	page: {type: Number, default: 0},
	binding: {type: String, default: '简装', enum: ['简装', '精装']},
	score: {type: Number, default: 0, max: 10, min: 0},
	intro: {type: String, default: ''},
	tags: [String],
	images: [{
		type: String,
		validate: {
			validator: function (v) {
				return /^(https?:\/\/.*\.(?:png|jpg))$/i.test(v);
			},
			message: '{VALUE} is not a valid image url.'
		}
	}],

	disable: {type: Boolean, default: false},
	created_by: {type: Schema.Types.ObjectId, required: true, ref: 'user'},
	updated_by: {type: Schema.Types.ObjectId, required: true, ref: 'user'},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
});

BookSchema.index({isbn13: 1}, {unique: 1});

mongoose.model('book', BookSchema, 'book');

module.exports = BookSchema;