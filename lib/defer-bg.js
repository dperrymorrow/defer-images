(function () {
  "use strict";

  defer.bg = {
    enabled: true,
    batchSize: 10,
    found: 0,

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
        batch: 5
      },
      {
        lbl: 'Cable',
        speed: 50,
        batch: 10
      }
    ],

    check: function () {
      if (!this.enabled) {
        return;
      }
      this.findSpeed();
      this.findImgs();
    },

    findImgs: function () {
      var i = 0, el;

      while (i < defer.imgs.length) {
        el = defer.imgs[i];

        if (!el.defer.loading) {
          this.found += 1;
          defer.trace('bg found #' + el.defer.index + ' | ' + this.found + ' of ' + this.batchSize + ' limit');
          defer.loadImg(el);
        }

        if (this.batchFull()) {
          this.found = 0;
          break;
        }
        i += 1;
      }
    },

    batchFull: function () {
      return this.batchSize <= this.found;
    },

    findSpeed: function () {
      if (defer.loadTimes.length === 0) {
        this.batchSize = this.speeds[0].batch;
      }

      var avg, sum = 0,
        x, len = defer.loadTimes.length,
        i, group;

      for (x = 0; x < len; x += 1) {
        sum += defer.loadTimes[x];
      }

      avg = sum / len;
      defer.trace(avg.toPrecision(5) + " avg DL time");

      for (i = 0; i < this.speeds.length; i += 1) {
        group = this.speeds[i];
        if (avg > group.speed) {
          // defer.trace(group.lbl + " speed determined");
          this.batchSize = group.batch;
          break;
        }
      }
    }
  };
}());
