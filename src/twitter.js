const async = require('async');

module.exports = () => {
	async.parallel({
		one: function(callback) {
			callback(null, T.get('friends/list', { user_id: 'thebluecow1', count: 5 },  function (err, data, response) {
				return data;
			}));
		},
		two: function(callback) {
			callback(null, T.get('direct_messages', { count: 5 },  function (err, data, response) {
				return data;
			}));
		}
	}, function(err, results) {
		console.log(results);
	});
}