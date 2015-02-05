(function () {
  'use strict';

  window.defer = {
    debug: [],
    imgs: [],
    loadTimes: [],
    showConsole: true,
    allIn: false,
    dur: 200,
    int: 0,

    counts: {
      total: 0,
      lastInView: 0,
      loading: 0
    },

    start: function (el) {
      defer.dom.watchDom(el);

      this.int = setInterval(function () {
        if (defer.allIn && defer.imgs.length === 0) {
          defer.destroy();
          return;
        }
        // check for items in view
        defer.images.checkAll();
        // if none loading, load some background items
        if (defer.counts.loading === 0) {
          defer.bg.check();
        }
      }, this.dur);
    },

    done: function () {
      this.allIn = true;
      defer.dom.stopWatching();
    },

    trace: function (obj, type) {
      if (window.console === undefined || !this.showConsole) {
        this.debug.push(obj);
        return;
      }

      type = type || 'log';
      console[type](obj);
    },

    destroy: function () {
      this.trace("shutdown, kill em' all..");
      clearInterval(this.int);

      delete defer.imgs;
      delete defer.images;
      delete defer.bg;
      delete defer.debug;
      delete window.defer;
    }
  };
}());
