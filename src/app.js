const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
// used to parse body of page for posting tweets
const bodyParser = require('body-parser');
// used to assist with asynchronous calls to Twitter API
const async = require('async');

const Twit = require('twit');
const config = require('./config.js');
const T = new Twit(config);
const stream = T.stream('user' );

let feed = {};

const friendsList = () => {
	T.get('friends/list', { count: 5 },  function (err, data, response) {
		if (err) res.render('error', { err: err });
		feed.friends = data;
	});
};

const timeLine = () => {
	T.get('statuses/user_timeline', { count: 5 },  function (err, data, response) {
		if (err) res.render('error', { err: err });
		feed.timeline =  data;
	});
};

const directMessages = () => {
	T.get('direct_messages', { count: 6 },  function (err, data, response) {
		if (err) res.render('error', { err: err });
		feed.messages =  data;
	});
};

http.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});

// set the view engine to use pug and the views folder as the default directory
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set socket.io listeners
io.on('connection', (socket) => {
	
	console.log('user connected');
	
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

app.get('/', function(req, res, next) {
	
	async.parallel
	//friendsList();
	next();
});

app.get('/', function(req, res) {
	res.render('index');
});


stream.on('tweet', function(tweet) {
	io.emit('tweeting', tweet);
});

//stream.on('connect', resp => {
	//console.log('twitter', resp);
//});

/*
app.get('/timeline', function(req, res) {
	console.log('timeline called');
	let userTweets = {};
	T.get('statuses/user_timeline', { count: 5 },  function (err, data, response) {
		userTweets.timeline =  data;
	});
	res.render('partials/_timeline', { timeline: userTweets});  
});
*/

/*
app.post('/tweet', function(req, res) {
	async.waterfall([
		function(callback) {
			T.post('statuses/update', { status: req.body.message }, function(err, data, response) {
  				if (err) return callback(err);
			});
		}
	],
	function(err) {
		if (err) {
			res.render('error', { err: err });
		}		
	});
});
*/