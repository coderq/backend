// 'use strict';

// let assert = require('assert');

// describe('Test map structure.', function() {
// 	var myMap = new Map();

// 	var keyString = "a string",
// 	    keyObj = {},
// 	    keyFunc = function () {};

// 	myMap.set(keyString, "value associated with 'a string'");
// 	myMap.set(keyObj, "value associated with keyObj");
// 	myMap.set(keyFunc, "value associated with keyFunc");

// 	myMap.size;

// 	// getting the values
// 	myMap.get(keyString);    // "value associated with 'a string'"
// 	myMap.get(keyObj);       // "value associated with keyObj"
// 	myMap.get(keyFunc);      // "value associated with keyFunc"

// 	myMap.get("a string");   // "value associated with 'a string'"
// 	                         // because keyString === 'a string'
// 	myMap.get({});           // undefined, because keyObj !== {}
// 	myMap.get(function() {}) // undefined, because keyFunc !== function () {}
// })

'use strict';

let assert = require('assert');
let path = require('path');
let H = require('../library/helper');

describe('Test util functions.', function() {
	describe('Test import function.', function() {
		var controller_path = path.join(__dirname, 'controller');
		var controllers = H.import(controller_path, function(file) {
			return ((file.match(/^[A-Z][0-z]+(?=Controller)/) || []).shift() || '').toLowerCase();
		});
		assert.equal(typeof controllers.home, 'object', 'Should be an object.');
		assert.equal(typeof controllers.home.home, 'function', 'Should be a function.');
	});
});