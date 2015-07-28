var getTweets = angular.module('getTweets', ['ngSanitize']);

function mainController($scope, $http, $timeout) {
  $scope.formData = {};

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
      console.log(data);
      console.log($scope.tweets);

      // render tweets with widgets.js
      $timeout(function() {
        twttr.widgets.load();
      }, 30);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
}