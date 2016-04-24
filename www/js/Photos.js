(function () {
  'use strict';

  angular.module('app')
    .service('Photos', photoService);

  function photoService() {

    ///// Variables /////

    var index = 0;
    var photoId = 1;
    var photoLimit = 20;
    var photosInitialized = false;
    var photosShuffled = false;

    // Don't look in these dirs for photos
    var dirBlackList = [
      'cache',
      'temp'
    ];

    // Look in these dirs from root folder
    var dirWhiteList = [
      'DCIM',
      'Pictures',
      'Download',
      'Albums'
    ];

    // Only get these file extensions
    var photoExtensionWhiteList = [
      '.jpg',
      '.jpeg',
      '.png'
    ];

    var albums = [
      new Album("All Photos", null, []),
      new Album("Favorites", null, []),
      new Album("Selfies", null, []),
      new Album("Poop", "img/poop_emoji.png", []),
      new Album("Love", "img/heart_eyes.png", [])
    ];

    var photos = [];

    ///// Private Methods /////

    // Start file directory crawl here
    function initializePhotos() {
      try {
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, readInitialDirectory, error);
      } catch (error) {
        console.log(error);
      }
    }

    // Root dir needs to use white list to access specific dirs
    function readInitialDirectory(dir) {
      if (dir !== null)
        readEntries(dir, sortInitialEntries);
    }

    function readEntries(dir, callback) {
      var dirReader = dir.createReader();
      dirReader.readEntries(callback, error);
    }

    // If entries are directories and white listed, read them
    function sortInitialEntries(entries) {
      if (entries !== null && entries.length > 0) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isDirectory) {

            // Check dir against white list then read it
            if (checkDirWhiteList(entries[i]))
              readDirectory(entries[i]);
          }
        }
      }
    }

    // If dir isn't black listed, read it's entries
    function readDirectory(dir) {
      if (dir !== null && checkDir((dir))) {
        photosInitialized = false;
        readEntries(dir, sortFiles);
      }
    }

    // Sort and read files and dirs
    function sortFiles(files) {
      if (files !== null && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          if (files[i].isFile)
            readFile(files[i]);
          else if (files[i].isDirectory)
            readDirectory(files[i]);
        }

        photosInitialized = true;
      }
    }

    // If file is an image create a new Photo object and add it to photos array
    function readFile(file) {
      if (file !== null && checkFile(file)) {
        var nativeURL = file.nativeURL;

        file.file(
          function (file) {
            var dateModified = moment(file.lastModifiedDate);
            var photo = new Photo(name, dateModified, nativeURL, false, false, [0]);
            photos.push(photo);
          }, error);
      }
    }

    // Check dir against black list, return false if it's black listed
    function checkDir(dir) {
      for (var i = 0; i < dirBlackList.length; i++) {
        if (dir.fullPath.indexOf(dirBlackList[i]) > -1) return false;
      }
      return true;
    }

    // Check dir against white list, return true if it's white listed
    function checkDirWhiteList(dir) {
      for (var i = 0; i < dirWhiteList.length; i++) {
        if (dir.name === dirWhiteList[i]) {
          return true;
        }
      }
      return false;
    }

    // Check file extension against white list, return true if it's white listed
    function checkFile(file) {
      if (!file.name)
        return false;

      for (var i = 0; i < photoExtensionWhiteList.length; i++) {
        if (file.name.indexOf(photoExtensionWhiteList[i]) > -1) {
          return true;
        }
      }
      return false;
    }

    function error(error) {
      console.log("error: " + error.code);
    }

    ///// Object Constructors /////

    function Photo(title, date, src, loved, pooped, albums) {
      this.title = title;
      this.date = date;
      this.src = src;
      this.loved = loved;
      this.pooped = pooped;
      this.albums = albums;
      this.id = photoId;

      photoId++;
    }

    function Album(title, img, photos) {
      this.title = title;
      this.img = img;
      this.photos = photos;
      this.index = index;

      index++;
    }

    ///// Public Methods ///////

    // Returns specific photo album
    function getAlbum(index) {
      return albums[index];
    }

    // Shuffles photos and calls getPhotos
    function getInitialPhotos(albumId) {
      if (!photosShuffled) {
        photos.shuffle();
        photosShuffled = true;
      }

      return getPhotos(albumId, 0);
    }

    // Returns set amount of photos (photoLimit) in specified album
    function getPhotos(albumId, index) {
      var photosToSend = [];

      for (var i = index; i < photoLimit + index; i++) {
        for (var album in photos[i].albums) {
          if (albumId === photos[i].albums[album]) {
            photosToSend.push((photos[i]));
          }
        }
      }

      return photosToSend;
    }

    // Updates photo in storage
    function setPhoto(photo) {
      for (var i = 0; i < photos.length; i++) {
        if (photos[i].id == photo.id) {
          photos.splice(i, 1, photo);
        }
      }
    }

    function arePhotosInitialized() {
      return photosInitialized;
    }

    return {
      albums: albums,
      photosInitialized: photosInitialized,
      photoLimit: photoLimit,
      getAlbum: getAlbum,
      getPhotos: getPhotos,
      getInitialPhotos: getInitialPhotos,
      setPhoto: setPhoto,
      initializePhotos: initializePhotos,
      arePhotosInitialized: arePhotosInitialized
    }
  }
})();
