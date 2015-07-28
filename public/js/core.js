var getTweets = angular.module('getTweets', ['ngSanitize']);

function mainController($scope, $http, $timeout, $window) {
  $scope.formData = {};
  // set a default latitude value
  $window.navigator.geolocation.getCurrentPosition(function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(position);

    $scope.$apply(function() {
      $scope.latitude = latitude;
      $scope.longitude = longitude;
    });
  });


  // initiate masonry.js
  $scope.msnry = new Masonry('#tweet-list', {
    columnWidth: 320,
    itemSelector: '.tweet-item',
    transitionDuration: 0,
    isFitWidth: true
  });

  // layout masonry.js on widgets.js loaded event
  twttr.events.bind('loaded', function() {
    $scope.msnry.reloadItems();
    $scope.msnry.layout();
  });

  // when landing on the page, get all tweets and show them
  $http.get('/search/tweets')
    .success(function(data) {
      $scope.tweets = data;
      console.log("*********** success from mainController");

      // render tweets with widgets.js
      $timeout(function() {
        twttr.widgets.load();
      }, 30);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
}

/*

//-----------------------
function get_location() {
  navigator.geolocation.getCurrentPosition(show_map);
  console.log('nav: ', navigator);
}

function show_map(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  self.mapoutput = "http://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
  console.log("latitude: ", latitude);
  console.log("longitude: ", longitude);
}

get_location();



*/