var getTweets = angular.module('getTweets', []);

//este codigo funciona correctamente
function mainController($scope, $http) {
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
}