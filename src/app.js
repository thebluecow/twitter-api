const express = require('express');
const path = require('path');
const app = express();
// used to parse body of page for posting tweets
const bodyParser = require('body-parser');
const Twit = require('twit');
const config = require('./config.js');
// used to assist with asynchronous calls to Twitter API
const async = require('async');

const T = new Twit(config);

let feed = {};

const friendsList = callback => {
	T.get('friends/list', { count: 5 },  function (err, data, response) {
		if (err) return callback(err);
		feed.friends = data;
		callback();
	});
};

const timeLine = callback => {
	T.get('statuses/user_timeline', { count: 5 },  function (err, data, response) {
		if (err) return callback(err);
		feed.timeline =  data;
		callback();
	});
};

const directMessages = callback => {
	T.get('direct_messages', { count: 6 },  function (err, data, response) {
		if (err) return callback(err);
		feed.messages =  data;
		callback();
	});
};

// set the view engine to use pug and the views folder as the default directory
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
	
	async.parallel([
		friendsList,
		timeLine,
		directMessages	
	],
	function(err) {
		if (err) {
			res.render('error', { err: err });	
		} 
		next();	
	});
});

app.get('/', function(req, res) {
	res.render('index', { friends: feed.friends, timeline: feed.timeline, messages: feed.messages });
});

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

app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});