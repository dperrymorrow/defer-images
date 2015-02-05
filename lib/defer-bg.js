(function () {
  "use strict";

  defer.bg = {
    enabled: true,
    allDown: false,
    allUp: false,
    batchSize: 10,

    check: function () {
      if (!this.enabled) {
        return;
      }

      var dir = defer.dom.getScrollDir();
      this.found = 0;
      if (dir === 'up') {
        this.scrollDir = (dir === 'up' && this.allUp) ? 'down' : 'up';
      } else {
        this.scrollDir = (dir === 'down' && this.allDown) ? 'up' : 'down';
      }

      this[this.scrollDir]();
    },

    up: function () {
      var i = defer.imgs.length - 1;

      while (i >= 0) {
        this.loadIfShould(i);
        this.allUp = (i === 0);
        console.log(i);
        if (this.batchIsFull()) {
          break;
        }
        i -= 1;
      }
    },

    down: function () {
      var i = 0, len = defer.imgs.length - 1;

      while (i < len) {
        this.loadIfShould(i);
        this.allDown = (i === len);
        if (this.batchIsFull()) {
          break;
        }
        i += 1;
      }
    },

    loadIfShould: function (i) {
      var el = defer.imgs[i],
        view = defer.counts.lastInView,
        index = el.defer.index;

      if (el.defer.loading) {
        return;
      }

      if ((this.scrollDir === 'up' && index < view) || (this.scrollDir === 'down' && index > view)) {
        this.found += 1;
        defer.trace('bg found ' + this.found + ' of ' + this.batchSize + 'limit');
        defer.images.loadImg(el);
      }
    },

    batchIsFull: function () {
      return this.batchSize < this.found;
    }
  };
}());
