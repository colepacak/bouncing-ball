'use strict';

// TODO
// add collision
// exclude ball colors that match field color

angular.module('bouncingBallApp')
  .directive('bouncingBall', function ($document) {
    return {
      templateUrl: 'views/bouncing-ball.html',
      restrict: 'A',
      scope: {},
      link: function postLink(scope, element) {

        // set up field
        scope.field = {
          width: '',
          height: '',
          drawn: false,
          draw: function() {
            if (
              this.width !== '' &&
              this.width !== null &&
              this.height !== '' &&
              this.height !== null
            ) {
              this.drawn = true;
              element.find('.field')
                .css({
                  width: this.width + 'px',
                  height: this.height + 'px'
                });
            }
            else {
              this.drawn = false;
              element.find('.field')
                .css({
                  width: '0',
                  height: '0'
                });
            }
          }
        };

        // options for where a ball can start out on the field
        scope.startPositions = {
          x: ['left', 'right'],
          y: ['bottom', 'top']
        };

        scope.balls = [];

        var getRandomHex = function() {
          return '#' + Math.random().toString(16).substr(2,6);
        };

        // ball constructor
        var Ball = function() {
          this.id = scope.balls.length + 1;
          // has ball been added to field
          this.placed = false;
          this.motion = false;
          this.startPos = {
            x: '',
            y: ''
          };
          this.direction = {
            x: '',
            y: ''
          };
          this.color = getRandomHex();
          this.width = 10;
          this.height = 10;
        };

        // ball prototype methods
        Ball.prototype.placeOnField = function() {
          // check if both start positions have been assigned
          if (
            this.startPos.x !== '' &&
            this.startPos.x !== null &&
            this.startPos.y !== '' &&
            this.startPos.y !== null
          ) {
            // assign directions based on start positions
            this.placed = true;
            this.direction.x = (this.startPos.x === 'left') ? 'right' : 'left';
            this.direction.y = (this.startPos.y === 'bottom') ? 'up' : 'down';

            // calculate css position properties
            var xStart = (this.startPos.x === 'left') ? '0' : (scope.field.width - this.width) + 'px';
            var yStart = (this.startPos.y === 'bottom') ? '0' : (scope.field.height - this.height) + 'px';

            // add element property to object
            this.elem = element.find('#ball-' + this.id);

            // assign css properties
            this.elem.css({
              backgroundColor: this.color,
              left: xStart,
              bottom: yStart,
              width: this.width + 'px',
              height: this.height + 'px'
            });

            return this;
          }
          else {
            this.placed = false;
            return this;
          }
        };

        Ball.prototype.roll = function() {
          if (this.motion) {
            var xMove = (this.direction.x === 'right') ? '+' : '-';
            var yMove = (this.direction.y === 'up') ? '+' : '-';

            this.elem.animate({
              left: xMove + '=1',
              bottom: yMove + '=1'
            }, {
              duration: 20,
              complete: function() {
                // keyword 'this' gets taken over by jquery animate
                // thus needing to grab element explicitly again by object id
                var bid = parseInt(this.id.substring(5));
                var ball = getBallById(bid);

                return ball.activateSensors();
              }
            });
          }
        };

        // check if either bouncing criteria is met, otherwise roll on
        Ball.prototype.activateSensors = function() {
          var ballBottom = parseInt(this.elem.css('bottom'));
          var ballLeft = parseInt(this.elem.css('left'));
          if (
            ballBottom < scope.field.height - this.height &&
            ballBottom > 0 &&
            ballLeft < scope.field.width - this.width &&
            ballLeft > 0
          ) {
            return this.roll();
          }
          else {
            return this.bounce(ballBottom, ballLeft);
          }
        };

        Ball.prototype.bounce = function(ballBottom, ballLeft) {
          if (ballBottom >= scope.field.height - this.height) {
            this.direction.y = 'down';
          }
          if (ballBottom <= 0) {
            this.direction.y = 'up';
          }
          if (ballLeft >= scope.field.width - this.width) {
            this.direction.x = 'left';
          }
          if (ballLeft <= 0) {
            this.direction.x = 'right';
          }

          return this.roll();
        };

        Ball.prototype.pausePlay = function() {
          this.motion = !this.motion;

          return this.roll();
        };

        scope.createBall = function() {
          var ball = new Ball();
          scope.balls.push(ball);
        };

        var getBallById = function(bid) {
          var matches = [];
          angular.forEach(scope.balls, function(ball) {
            if (ball.id === bid) {
              matches.push(ball);
            }
          });

          if (matches.length === 1) {
            return matches[0];
          }
          else if (matches.length === 0) {
            console.log('Matches array is empty');
          }
          else {
            console.log('Matches array has too many values');
          }
        };

        $document.ready(function() {
          scope.field.draw();
        });
      }
    };
  });
