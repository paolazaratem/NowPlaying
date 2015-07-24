// server.js
// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================
mongoose.connect('mongodb://root:root@proximus.modulusmongo.net:27017/raw4Ujyg');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(5000);
console.log("App listening on port 5000");

// routes ======================================================================
// api ---------------------------------------------------------------------
var Twit = require('twit');
var twitInfo = require('./config.js');
var twitter = new Twit(twitInfo);

// get 5 tweets
var tweets = [];

twitter.get('search/tweets', { q: '#nowplaying', count: 5, result_type: 'recent' }, function(req, res) {
  tweets = res.statuses;

  for (index in tweets) {
    console.log(index + " " +tweets[index].text);
    //res.json(tweets[index].text);
    //res.json(tweets);
  }
  console.log("Res:" + res.tweets);
  //res.json("{a: 'b', c: 'd'}");
});

// get all tweets
app.get('/tweets/', function(req, res) {
    res.json(tweets); // return all tweets in JSON format
});

// application -------------------------------------------------------------
app.get('*', function(req, res) {
	res.json(tweets); // return all tweets in JSON format
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
