(function () {
  'use strict';

  var ngDocument = angular.element(document);

  angular.element(ngDocument).ready(function () {
    ngDocument.on('deviceready', function () {
      var body = ngDocument.find('body');
      angular.bootstrap(body, ['app']);
    });
  });

  angular.module('app', ['ionic']);
})();