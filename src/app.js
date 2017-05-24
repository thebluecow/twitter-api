const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
// used to parse body of page for posting tweets
const bodyParser = require('body-parser');
// used to assist with asynchronous calls to Twitter API
const async = require('async');

// configure Twit
const Twit = require('twit');
const config = require('./config.js');
const T = new Twit(config);
const stream = T.stream('user');

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
	
	// log to console when the user connects
	console.log('user connected');
	
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

// if a tweet comes into timeline, send "tweeting event"
stream.on('tweet', function(tweet) {
	io.emit('tweeting', tweet);
});

// load tweets, friends, and direct messages on load
app.get('/', function(req, res) {

        let feed = {};

		// use asynce to run all three in parallel to prevent locking up the web page
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
				// if there's an error, display the error page
				res.render('error', { err: err });
			}
			// render the index page, passing along our data
			res.render('index', { friends: feed.friends, timeline: feed.timeline, messages: feed.messages });
        });
});

// when a "tweet" is posted on button click, post the message to Twitter
app.post('/tweet', function(req, res) {
        async.waterfall([
			function(callback) {
				T.post('statuses/update', { status: req.body.message }, function(err, data, response) {
					if (err) return callback(err);
					//console.log(data);
					res.end();
				});
			}
        ],
        function(err) {
			if (err) {
					res.render('error', { err: err });
			}
        });
});