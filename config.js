'use strict';

exports.mongo = {
	host: process.env.MONGO_HOST || '127.0.0.1',
	port: process.env.MONGO_PORT || 27017,
	user: process.env.MONGO_USER,
	pass: process.env.MONGO_PASS
};

exports.redis = {
	host: process.env.REDIS_HOST || '127.0.0.1',
	port: process.env.REDIS_PORT || 6379
};

exports.jwt = {
	algorithm: 'HS256',
	expiresIn: '7d',
	secret: 'your secret'
}

exports.port = process.env.PORT || 3000;