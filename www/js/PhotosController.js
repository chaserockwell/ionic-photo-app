(function () {
  'use strict';

  angular.module('app')
    .controller('PhotosController', PhotosController);

  function PhotosController(album, Photos, $scope) {
    var vm = this;
    var photosReceivedIndex = 0;
    var nextPhotos = [];

    vm.loadingPhotos = true;
    vm.album = album;
    vm.loadingPhotos = false;
    vm.photos = [];

    vm.heartPhoto = heartPhoto;
    vm.poopPhoto = poopPhoto;
    vm.getPhotos = getPhotos;
    vm.getInfinitePhotos = getInfinitePhotos;

    getPhotos();

    function getPhotos() {
      try {
        var photosToAdd = Photos.getInitialPhotos(album.index);

        if (photosToAdd !== null && photosToAdd.length > 0) {
          for (var i = 0; i < photosToAdd.length; i++) {
            vm.photos.push(photosToAdd[i]);
          }
          photosReceivedIndex += Photos.photoLimit;
          getNextPhotos();
        }
      } catch (error) {
        console.log('getPhotos: ' + error);
      }
    }

    // Method called for infinite scroll to load next set of photos
    function getInfinitePhotos() {
      try {
        for (var i = 0; i < nextPhotos.length; i++) {
          vm.photos.push(nextPhotos[i]);
        }

        photosReceivedIndex += Photos.photoLimit;
        getNextPhotos();
      } catch (error) {
        console.log(error);
      }

      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    // Load next batch of photos so they're ready for infinite scroll
    function getNextPhotos() {
      nextPhotos = Photos.getPhotos(album.index, photosReceivedIndex);
      photosReceivedIndex += Photos.photoLimit;
    }

    // User clicks the heart eye emoji on photo, updates photo's album in service
    function heartPhoto(photoId) {
      var photo;

      for (var i = 0; i < vm.photos.length; i++) {
        if (vm.photos[i].id == photoId) {
          photo = vm.photos[i];

          if (!photo.loved) {

            for (var j = 0; j < photo.albums.length; j++) {
              if (photo.albums[j] === 3) {
                photo.albums.splice(j, 1);
              }
            }

            photo.albums.push(4);
            photo.loved = true;
          } else {
            for (var j = 0; j < photo.albums.length; j++) {
              if (photo.albums[j] == 4) {
                photo.albums.splice(j, 1);
              }
            }
            photo.loved = false;
          }

          photo.pooped = false;
          Photos.setPhoto(photo);
        }
      }
    }

    // User clicks poop emoji on photo, updates photo's album in service
    function poopPhoto(photoId) {
      var photo;

      for (var i = 0; i < vm.photos.length; i++) {
        if (vm.photos[i].id == photoId) {
          photo = vm.photos[i];

          if (!photo.pooped) {
            for (var j = 0; j < photo.albums.length; j++) {

              if (photo.albums[j] === 4) {
                photo.albums.splice(j, 1);
              }
            }

            photo.albums.push(3);
            photo.pooped = true;
          } else {
            for (var j = 0; j < photo.albums.length; j++) {
              if (photo.albums[j] == 3) {
                photo.albums.splice(j, 1);
              }
            }
            photo.pooped = false;
          }

          photo.loved = false;
          Photos.setPhoto(photo);
        }
      }
    }
  }
})();
