let express = require('express');
let app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');