
var express         = require('express');
var app             = express(); 								
var http            = require('http');
var path            = require('path');
var mongoose        = require('mongoose'); 			
var routes          = require('./routes');						
var morgan          = require('morgan'); 					// log requests to the console (express4)
var bodyParser      = require('body-parser'); 				// pull information from HTML POST (express4)
var cookieParser    = require('cookie-parser');

//mongoose.connect(database.url); 		

app.use(express.static(path.join(__dirname, 'public')));    // set the static files location /public/img will be /img for users
app.use(morgan('dev')); 							        // log every request to the console
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('environment', process.env.NODE_ENV || 'development');
app.use(cookieParser());
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ extended: true}));

routes(app);

app.listen(app.get('port'), function(){
    console.log("Server starting and running on port %s", app.get('port'));
});
