"use strict";
var home          = require('./home');

module.exports = function(app) {
	app.get( 	'/',				home.index );
	app.post( 	'/download',		home.download );
	app.post( 	'/downloadAll',		home.downloadAll );
};