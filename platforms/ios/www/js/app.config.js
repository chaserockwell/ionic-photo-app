(function () {
  'use strict';

  angular
    .module('app')
    .config(appConfig);

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function appConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('albums', {
        url: '/',
        templateUrl: 'templates/albums.html'
      })
      .state('photos', {
        url: '/photos/:album',
        templateUrl: 'templates/photos.html',
        controller: "PhotosController as ctrl",
        resolve: {
          album: function ($stateParams, Photos) {
            return Photos.getAlbum($stateParams.album);
          }
        }
      });
  }
})();
