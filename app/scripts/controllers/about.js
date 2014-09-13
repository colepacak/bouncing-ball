'use strict';

/**
 * @ngdoc function
 * @name bouncingBallApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bouncingBallApp
 */
angular.module('bouncingBallApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
