(function () {
  "use strict";

  defer.bg = {
    enabled: true,
    batchSize: 10,

    speeds: [
      {
        lbl: 'Modem',
        speed: 4000,
        batch: 1
      },
      {
        lbl: 'EDGE',
        speed: 1000,
        batch: 3
      },
      {
        lbl: 'DSL',
        speed: 100,
        batch: 50
      },
      {
        lbl: 'Cable',
        speed: 50,
        batch: 80
      }
    ],

    check: function () {
      if (!this.enabled) {
        return;
      }

      this.scrollDir = defer.dom.getScrollDir();
      this.findSpeed();

      this.found = 0;
      this.startIndex = defer.counts.lastInView;
      this[this.scrollDir]();
      defer.trace("//// starting at " + this.startIndex);
      // if we found none, reverse it...
      if (!this.batchFull()) {
        if (this.scrollDir === 'up') {
          this.startIndex = 0;
          this.down();
        } else {
          this.startIndex = defer.imgs.length;
          this.up();
        }
      }
    },

    up: function () {
      var i = defer.imgs.length - 1;

      while (i >= 0) {
        this.loadIfShould(i);
        if (this.batchFull()) {
          break;
        }
        i -= 1;
      }
    },

    down: function () {
      var i = 0, len = defer.imgs.length;

      while (i < len) {
        this.loadIfShould(i);
        if (this.batchFull()) {
          break;
        }
        i += 1;
      }
    },

    loadIfShould: function (i) {
      var el = defer.imgs[i],
        index = el.defer.index;

      if (el.defer.loading) {
        return false;
      }

      if ((this.scrollDir === 'up' && index <= this.startIndex) || (this.scrollDir === 'down' && index >= this.startIndex)) {
        this.found += 1;
        defer.trace('bg found #' + el.defer.index + ' | ' + this.found + ' of ' + this.batchSize + ' limit');
        defer.images.loadImg(el);
      }
    },

    batchFull: function () {
      return this.batchSize <= this.found;
    },

    findSpeed: function () {
      var avg, sum = 0,
        x, len = defer.loadTimes.length,
        i, group;

      for (x = 0; x < len; x += 1) {
        sum += defer.loadTimes[x];
      }

      avg = sum / len;
      defer.trace(avg.toPrecision(5) + " avg DL time");

      for (var i = 0; i < this.speeds.length; i += 1) {
        group = this.speeds[i];
        if (avg > group.speed) {
          // defer.trace(group.lbl + " speed determined");
          this.batchSize = group.batch;
          break;
        }
      };
    }
  };
}());
