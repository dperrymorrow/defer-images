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
    loading: 0,
    active: false,

    listen: function () {
      this.active = true;

      window.onload = function () {
        defer.allIn = true;
      };


      this.int = setInterval(function () {
        if (defer.allIn) {
          defer.removeLoaded();
        }

        if (defer.allIn && defer.imgs.length === 0) {
          defer.destroy();
          return;
        }
        // check for items in view
        defer.checkAll();
        // if none loading, load some background items
        if (defer.loading === 0) {
          defer.bg.check();
        }
      }, this.dur);
    },

    trace: function (obj, type) {
      if (window.console === undefined || !this.showConsole) {
        this.debug.push(obj);
        return;
      }

      type = type || 'log';
      console[type](obj);
    },

    add: function (el) {
      el.defer = {
        src: el.getAttribute('data-src'),
        index: this.imgs.length,
        loading: false,
        loaded: false
      };

      defer.imgs.push(el);
      // console.log(this.active)
      // if (!this.active) {
        this.listen();
      // }
    },

    imgLoaded: function (event) {
      event = event || window.event;
      if (event) {
        var el = event.target || event.srcElement;
        this.trace('#' + el.defer.index + ' loaded');
        el.onload = null;
        el.defer.loaded = true;
        this.loadTimes.push(new Date().getTime() - el.defer.loadStart);
      }

      this.loading -= 1;
    },

    loadImg: function (el) {
      this.loading += 1;
      this.trace('#' + el.defer.index + ' requested');

      el.onload = function (event) {
        defer.imgLoaded(event);
      };

      el.onerror = function (event) {
        event = event || window.event;
        if (event) {
          var img = event.target || event.srcElement;
          img.defer.loaded = true;
        }
        defer.loading -= 1;
      };

      el.src = el.defer.src;
      el.defer.loading = true;
      el.defer.loadStart = new Date().getTime();
    },

    removeLoaded: function () {
      var i, tmp = [];
      for (i = 0; i < this.imgs.length; i += 1) {
        if (this.imgs[i].defer.loaded) {
          delete this.imgs[i].defer;
        } else {
          tmp.push(this.imgs[i]);
        }
      }
      this.imgs = tmp;
    },

    checkAll: function () {
      var i = 0, el;
      for (i; i < defer.imgs.length; i += 1) {
        el = defer.imgs[i];
        if (this.inView(el) && !el.defer.loading) {
          this.loadImg(el);
        }
      }
    },

    inView: function (el) {
      var box = el.getBoundingClientRect(),
        bottom = (window.innerHeight || document.documentElement.clientHeight);
      return (box.bottom >= 0 && box.top <= bottom);
    },

    destroy: function () {
      this.trace("shutdown, kill em' all..");
      clearInterval(this.int);
      this.active = false;
      this.loading = 0;
      this.allIn = false;
      this.imgs = [];
      defer.bg.avg = 0;
      defer.bg.batchSize = 10;
      defer.bg.found = 0;
      // delete defer.bg;
      this.debug = [];
    }
  };
}());
