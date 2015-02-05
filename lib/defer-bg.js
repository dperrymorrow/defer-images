(function () {
  "use strict";

  defer.bg = {
    enabled: true,
    batchSize: 10,

    speeds: {
      modem: {
        speed: 4000,
        batch: 1
      },
      edge: {
        speed: 1000,
        batch: 3
      },
      dsl: {
        speed: 10,
        batch: 5
      },
      cable: {
        speed: 5,
        batch: 8
      }
    },

    check: function () {
      if (!this.enabled) {
        return;
      }

      this.scrollDir = defer.dom.getScrollDir();
      this.findSpeed();

      this.found = 0;
      this[this.scrollDir]();
    },

    up: function () {
      var i = defer.imgs.length - 1;

      while (i >= 0) {
        if (this.loadIfShould(i)) {
          break;
        }
        i -= 1;
      }
    },

    down: function () {
      var i = 0, len = defer.imgs.length;

      while (i < len) {
        if (this.loadIfShould(i)) {
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
        return false;
      }

      if ((this.scrollDir === 'up' && index < view) || (this.scrollDir === 'down' && index > view)) {
        this.found += 1;
        defer.trace('bg found ' + this.found + ' of ' + this.batchSize + ' limit');
        defer.images.loadImg(el);
      }

      return this.batchSize < this.found;
    },

    findSpeed: function () {
      var avg, sum = 0,
        x = 0, len = defer.loadTimes.length,
        key, group;

      for (x = 0; x < len; x += 1) {
        sum += defer.loadTimes[x];
      }

      avg = sum / len;
      defer.trace(avg + " avg DL time");

      for (key in this.speeds) {
        group = this.speeds[key];
        if (avg > group.speed) {
          defer.trace(key + " speed determined");
          this.batchSize = group.batch;
          break;
        }
      }
    }
  };
}());
