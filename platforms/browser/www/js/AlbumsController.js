(function () {
  'use strict';

  angular.module('app')
    .controller('AlbumsController', AlbumsController);

  AlbumsController.$inject = ['Photos', '$interval'];
  function AlbumsController(Photos, $interval) {
    var vm = this;

    vm.loadingPhotos = true;
    vm.albums = Photos.albums;

    // Start photo sync
    if (!Photos.photosInitialized)
      Photos.initializePhotos();

    // Check every 500ms and once photos are initialized, switch view to show albums
    var stop = $interval(function () {
      if (Photos.arePhotosInitialized()) {
        vm.loadingPhotos = false;
        $interval.cancel(stop);
      } else {
      }
    }, 500);
  }
})();
