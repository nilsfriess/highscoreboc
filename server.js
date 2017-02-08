var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:12000/highscores');

var Highscore = require('./app/models/highscore');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
    console.log('request detected');
    next();
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


router.get('/', function(req, res) {
    res.json({message: 'api up and running'});
});

router.route('/highscore')

    .post(function(req, res) {
	var highscore = new Highscore();
	highscore.name = req.body.name;
	highscore.points = req.body.points;
	highscore.group = req.body.group;

	highscore.save(function(err) {
	    if (err) {
		res.send(err);
	    }

	    res.json({message: 'Highscore created'});
	});
    })

    .get(function(req, res) {
	Highscore.find(function(err, highscores) {
	    if (err)
		res.send(err);

	    res.json(highscores);
	});
    });

router.route('/highscores/:id')

    .get(function(req, res) {
	Highscore.findById(req.params.id, function(err, highscore) {
	    if (err)
		res.send(err);

	    res.json(highscore);
	});
    })

    .put(function(req, res) {
	Highscore.findById(req.params.id, function(err, highscore) {
	    if (err)
		res.send(err);

	    highscore.points = req.body.points;

	    highscore.save(function(err) {
		if (err)
		    res.send(err);

		res.json({message: 'Highscore updated'});
	    });
	});
    });

app.use('/api', router);

app.listen(port);
console.log('Server listening on port ' + port);
