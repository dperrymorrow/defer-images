(function () {
  'use strict';

  window.defer = {
    debugInfo: [],
    imgs: [],
    loadTimes: [],
    showConsole: true,
    allRegistered: false,
    scrollDir: 'down',
    viewInt: 200,
    bgInt: 100,
    ints: [],

    counts: {
      total: 0,
      lastInView: 0,
      loading: 0
    },

    start: function (el) {
      defer.dom.watchDom(el);

      this.ints.push(
        setInterval(function () {
          if (defer.allRegistered && defer.imgs.length === 0) {
            defer.destroy();
            return;
          }
          defer.images.checkAll();
        }, this.viewInt)
      );

      this.ints.push(
        setInterval(function () {
          defer.bg.guessNext();
        }, this.bgInt)
      );
    },

    done: function () {
      this.allRegistered = true;
      defer.dom.stopWatching();
    },

    trace: function (obj, type) {
      if (window.console === undefined || !this.showConsole) {
        this.debugInfo.push(obj);
        return;
      }

      type = type || 'log';
      console[type](obj);
    },

    destroy: function () {
      this.trace("shutdown, kill em' all..");

      for (var i = this.ints.length - 1; i >= 0; i--) {
        clearInterval(this.ints[i]);
      };

      delete defer.imgs;
      delete defer.images;
      delete defer.bg;
      delete defer.debugInfo;
      delete window.defer;
    }
  };
}());