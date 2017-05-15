let express = require('express');
let app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
	// same as { path: path }
	let path = req.path;
	res.locals.path = path;
	res.render('index');
});

app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});