// server.js
// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)}
// configuration =================
mongoose.connect('mongodb://root:root@proximus.modulusmongo.net:27017/raw4Ujyg'); // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
  'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(5000);
console.log("App listening on port 5000");

// routes ======================================================================
// api ---------------------------------------------------------------------
var Twit = require('twit');
var twitInfo = require('./config.js');
var twitter = new Twit(twitInfo);

//--------------------------------------------------
// get 5 tweets
var tweets = [];
var oEmbedTweets = [];
var OEMBED_URL = 'statuses/oembed';

//var sanFrancisco = ['-122.75', '36.8', '-121.75', '37.8'];
//console.log("latitude: " + latitude );

var locations = ['37.781157', '-122.398720', '50mi'];
//var locations = [latitude,longitude,'50mi'];
var MAX_WIDTH = 300;

twitter.get('search/tweets', {
  q: '#nowplaying',
  geocode: locations,
  count: 5,
  result_type: 'recent'
}, function(req, res) {
console.log("latitude: " + req.latitude );
  tweets = res.statuses;

  for (index in tweets) {
    getOEmbed(tweets[index]);
  }

  function getOEmbed(tweet) {

    // oEmbed request params
    var params = {
      id: tweet.id_str,
      maxwidth: MAX_WIDTH,
      hide_thread: true,
      omit_script: true
    };
    console.log("tweet.id: " + tweet.id_str);
    // request data 
    twitter.get(OEMBED_URL, params, function(err, data, resp) {
      tweet.oEmbed = data;
      oEmbedTweets.push(tweet);
      console.log("oEmbedTweets: " + oEmbedTweets[0]);

    });
  }
  for (index in tweets) {
    console.log(index + " " + tweets[index].text);
  }
});

// get all tweets
app.get('/tweets/', function(req, res) {
  console.log("All tweets" + res.text);
  res.json(tweets); // return all tweets in JSON format
});

// application -------------------------------------------------------------
app.get('*', function(req, res) {
  console.log("oEmbedTweets.length: " + oEmbedTweets.length);
  console.log("tweets.length " + tweets.length);

  // do we have oEmbed HTML for all Tweets?
  if (oEmbedTweets.length == tweets.length) {
    res.setHeader('Content-Type', 'application/json');
    res.send(oEmbedTweets);
  }
  res.json(tweets); // return all tweets in JSON format
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});