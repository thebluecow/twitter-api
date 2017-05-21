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

// set the view engine to use pug and the views folder as the default directory
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	
	let feed = {};
	
	async.parallel([
		function(callback) {
			T.get('friends/list', { count: 5 },  function (err, data, response) {
				if (err) return callback(err);
				feed.friends = data;
				callback();
			});
		},
		function(callback) {
			T.get('statuses/user_timeline', { count: 5 },  function (err, data, response) {
				if (err) return callback(err);
				feed.timeline =  data;
				callback();
			});
		},
		function(callback) {
			T.get('direct_messages', { count: 6 },  function (err, data, response) {
				if (err) return callback(err);
				feed.messages =  data;
				callback();
			});
		}
		
	],
	function(err) {
		if (err) {
			res.render('error', { err: err });	
		} 
		res.render('index', { friends: feed.friends, timeline: feed.timeline, messages: feed.messages });	
	});
});

app.post('/tweet', function(req, res) {
	async.waterfall([
		function(callback) {
			T.post('statuses/update', { status: req.body.message }, function(err, data, response) {
  				if (err) return callback(err);
				console.log(data);
				callback();
			});
		}
	],
	function(err) {
		if (err) {
			res.render('error', { err: err });	
		} 
		res.redirect('back');	
	});
});

app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});