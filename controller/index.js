'use strict';

let H = require('../library/helper');

module.exports = H.import(__dirname, function (file) {
	return ((file.match(/^[A-Z][0-z]+(?=Controller)/) || []).shift() || '').replace(/[A-Z]/g, function($, i) {
		return (i ? '_' : '') + $.toLowerCase();
	});
}, 'index.js');