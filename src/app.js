const express = require('express');
const path = require('path');
let app = express();

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	// same as { path: path }
	let path = req.path;
	res.locals.path = path;
	res.render('index', { username: "thebluecow1" } );
});

app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});