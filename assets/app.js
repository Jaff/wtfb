(function() {
  // New Angular App
  var app = angular.module('wtfb', [ ]);

  var shuffle = function(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  function extractText( str ){
    var ret = "";

    if ( /"/.test( str ) ){
      ret = str.match( /"(.*?)"/ )[1];
    } else {
      ret = str;
    }

    return ret;
  }

  // Create the controller and inject Angular's $scope
  app.controller('wtfbController', function($scope, $http) {
    // Set the template variable to 'index' by default
    $scope.template = 'index';

    // No tweets at first
    $scope.tweets = 0;

    // Set the currentBand variable to 0
    $scope.currentBand = 0;

    $scope.messages = [
      "Here's what to call your stupid fucking band:",
      "When your significant other's parents ask what you do for a living, you say: \"I play in...\"",
      "Soon all of your friends will be mispronouncing:",
      "Have you heard? There's a new single out from:",
      "The radio's jamming the fuck out to:",
      "Coming soon to that terrible basement venue near you:",
      "Fuck shoegaze. Define your own genre with:",
      "Radio is obsolete but they'll still play:",
      "Use this name and people will describe you as 'seminal:'",
      "I like their first album best:",
      "Pitchfork gave a 4.2 to:",
      "Quick, check if the domain's taken:",
      "My mom likes:",
      "The sound guy hates:",
      "I swear they don't wash their hair:"
    ];

    $scope.goHome = function() {
      $scope.template = 'index';
    }

    // getBands Function
    $scope.getBands = function() {
      // Set to loading template...
      $scope.template = 'loading';

      if ($scope.tweets === 0 || $scope.tweets[$scope.currentBand]) {
        // Make our request to our API
        $http.get('bandvomit.php')
          .success(function(data, status, headers, config) {
            $scope.tweets = data;

            shuffle($scope.tweets);

            $scope.setBandData();
            // Show the result template
            $scope.template = 'result';
          })
          .error(function(data, status, headers, config) {
            // Show the error template
            $scope.template = 'error';
        });
      } else {
        // Show the out template
        $scope.template = 'out';
      }
    }

    $scope.setBandData = function() {
      $scope.setRandomMessage();
      $scope.setBandName();
      $scope.setTweetLink();
    }

    $scope.setBandName = function() {
      var text = $scope.tweets[$scope.currentBand].text;
      $scope.bandName = extractText(text);
    }
    $scope.setTweetLink = function() {
      var tweetID = $scope.tweets[$scope.currentBand].id_str;
      $scope.tweetLink = 'https://twitter.com/bandvomit/status/' + tweetID;
    }

    $scope.nextBand = function() {
      $scope.currentBand++;

      if ($scope.tweets[$scope.currentBand]) {
        $scope.setBandData();
      } else {
        $scope.template = 'out';
      }
    }

    $scope.setRandomMessage = function() {
      shuffle($scope.messages);
      $scope.randomMessage = $scope.messages[0];
    }
  });
})();