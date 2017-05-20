const express = require('express');
const path = require('path');
const app = express();
const Twit = require('twit');
const config = require('./config.js');
const twitter = require('./twitter.js');
const aSync = require('async');

const T = new Twit(config);

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	
	let feed = {};
	
	aSync.parallel([
		function(callback) {
			T.get('friends/list', { user_id: 'thebluecow1', count: 5 },  function (err, data, response) {
				if (err) return callback(err);
				feed.friends = data;
				callback();
			});
		},
		function(callback) {
			T.get('statuses/user_timeline', { user_id: 'thebluecow1', count: 5 },  function (err, data, response) {
				if (err) return callback(err);
				feed.timeline =  data;
				callback();
			});
		},
		function(callback) {
			T.get('direct_messages', { count: 5 },  function (err, data, response) {
				if (err) return callback(err);
				feed.messages =  data;
				callback();
			});
		}
		
	],
	function(err) {
		if (err) throw err;
		console.log(feed.timeline);
		res.render('index', { username: "thebluecow1", friends: feed.friends, timeline: feed.timeline, messages: feed.messages });	
	});
});

/*
app.get('/', function(req, res){
	// same as { path: path }
	let path = req.path;
	res.locals.path = path;
	//const twitter_data = twitter;
	//res.locals.twitter_data = twitter;
	
	res.render('index', { username: "thebluecow1", twitter_data: res.locals.twitter_data } );
});
*/

app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});