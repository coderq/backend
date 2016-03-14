var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: {type: String, default: ''},
	nickname: {type: String, default: ''},
	mobile: {
		type: String, 
		required: true, 
		validate: {
	      	validator: function(v) {
	        	return /1\d{10,10}/.test(v);
	      	},
	      	message: '{VALUE} is not a valid phone number!'
	    }
	},
	password: {
		type: String,
		required: true,
		validate: {
			// 32位md5值
			validator: function(v) {
	        	return /^[0-z]{32,32}$/.test(v);
	      	},
	      	message: '{VALUE} is not a valid password!'
		}
	},
	password_salt: {
		type: String,
		required: true,
		validate: {
			validator: function(v) {
				return /^[0-z]{8,8}$/.test(v);
			},
			message: '{VALUE} is not a valid password salt.'
		}
	},
	qq: {
		type: String,
		validate: {
			validator: function(v) {
				return !v || /^\d{1,12}$/.test(v);
			},
			message: '{VALUE} is not a valid qq number.'
		},
		default: ''
	},
	email: {
		type: String,
		validate: {
			validator: function(v) {
				return !v || /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(v);
			},
			message: '{VALUE} is not a valid email!'
		},
		default: ''
	},
	gender: {type: Number, enum: [1, 2], default: 1},
	birthday: {type: Date, default: 0},
	schools: [{
		from: Date,
		to: Date,
		school: {
			type: Schema.Types.ObjectId,
			ref: 'school'
		}
	}],
	father: {type: Schema.Types.ObjectId, ref: 'user', default: null},
	mother: {type: Schema.Types.ObjectId, ref: 'user', default: null},
	lover: {type: Schema.Types.ObjectId, ref: 'user', default: null},
	children: [{type: Schema.Types.ObjectId, ref: 'user'}],
	followers: [{type: Schema.Types.ObjectId, ref: 'user'}],
	attention_to_users: [{type: Schema.Types.ObjectId, ref: 'user'}],
	collect_book_lists: [{type: Schema.Types.ObjectId, ref: 'book'}],

	disable: {type: Boolean, default: false},	
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
});

UserSchema.index({mobile: 1}, {unique: true});

mongoose.model('user', UserSchema, 'user');

module.exports = UserSchema;