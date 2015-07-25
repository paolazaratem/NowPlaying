// public/core.js
var getTweets = angular.module('getTweets', []);

//este codigo funciona correctamente
/*function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all tweets and show them
    $http.get('/search/tweets')
        .success(function(data) {
            $scope.tweets = data;
            console.log("*********** success from mainController");
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}*/

getTweets.controller('TweetsController', function($scope, $http){

    /**
     * init controller and set defaults
     */
    function init () {
      $scope.formData = {};

        // initiate masonry.js
      $scope.msnry = new Masonry('#tweet-list', {
        columnWidth: 320,
        itemSelector: '.tweet-item',
        transitionDuration: 0,
        isFitWidth: true
      });

      // layout masonry.js on widgets.js loaded event
      twttr.events.bind('loaded', function () {
        $scope.msnry.reloadItems();
        $scope.msnry.layout();
      });

      $scope.listTweets();
    }    

    /**
     * requests and processes tweet data
     */
    function listTweets () {
    // when landing on the page, get all tweets and show them
    $http.get('/search/tweets')
        .success(function(data) {
            $scope.tweets = data;
            var i = 0, len = tweets.length;
                for(i; i < len; i++) {
                getOEmbed($scope.tweets[i]);
            }
            
            console.log("*********** success from mainController");
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


                // render tweets with widgets.js
        $timeout(function () {
          twttr.widgets.load();
        }, 30);
    }

        /**
     * binded to 'Get More Tweets' button
     */
    $scope.getMoreTweets = function () {
      listTweets(true);
    }
});




var TWEET_COUNT = 15;
var MAX_WIDTH = 305;
var OEMBED_URL = 'statuses/oembed';
var USER_TIMELINE_URL = 'statuses/user_timeline';

/**
 * GET tweets json.
 */
router.get('/user_timeline/:user', function(req, res) {

  var oEmbedTweets = [], tweets = [],

  params = {
    screen_name: req.params.user, // the user id passed in as part of the route
    count: TWEET_COUNT // how many tweets to return
  };

  // the max_id is passed in via a query string param
  if(req.query.max_id) {
    params.max_id = req.query.max_id;
  }

  // request data 
  twitter.get(USER_TIMELINE_URL, params, function (err, data, resp) {

    tweets = data;

    var i = 0, len = tweets.length;

    for(i; i < len; i++) {
      getOEmbed(tweets[i]);
    }
  });
 /**
   * requests the oEmbed html
   */
  function getOEmbed (tweet) {

    // oEmbed request params
    var params = {
      "id": tweet.id_str,
      "maxwidth": MAX_WIDTH,
      "hide_thread": true,
      "omit_script": true
    };

    // request data 
    twitter.get(OEMBED_URL, params, function (err, data, resp) {
      tweet.oEmbed = data;
      oEmbedTweets.push(tweet);

      // do we have oEmbed HTML for all Tweets?
      if (oEmbedTweets.length == tweets.length) {
        res.setHeader('Content-Type', 'application/json');
        res.send(oEmbedTweets);
      }
    });
  }
});

