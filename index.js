const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const pg = require("pg");
const Pool = pg.Pool;

//setup template handlebars as the template engine
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
//setup middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//configure the port number using and environment number
app.get('/', async function (req, res) {
    res.render('index')
})
app.get('/validation',  async function (req, res) {
    res.render('validation', {
        layout: 'validation',
    })
})

var portNumber = process.env.PORT || 3020;

//start everything up
app.listen(portNumber, function () {
    console.log('Starting on:', portNumber);
});