(function () {
  'use strict';

  ///// Array Methods /////

  // Shuffles array in place
  Array.prototype.shuffle = function () {
    var i = 0,
      j = 0,
      temp = null;

    for (i = this.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = this[i];
      this[i] = this[j];
      this[j] = temp;
    }
  };
})();
