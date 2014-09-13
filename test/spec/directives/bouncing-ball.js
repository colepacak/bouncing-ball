'use strict';

describe('Directive: bouncingBall', function () {

  // load the directive's module
  beforeEach(module('bouncingBallApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bouncing-ball></bouncing-ball>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bouncingBall directive');
  }));
});
