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
    loaded: 0,
    active: false,
    callback: null,

    listen: function () {
      this.active = true;
      this.addEvent(window, 'load', this.winLoaded);
      this.int = setInterval(this.run, this.dur);
    },

    addCallback: function (callback) {
      this.callback = callback;
    },

    winLoaded: function () {
      defer.allIn = true;
    },

    run: function () {
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
    },

    add: function (el) {
      el.defer = {
        src: el.getAttribute('data-src'),
        index: this.imgs.length,
        loading: false,
        loaded: false
      };

      this.imgs.push(el);

      if (!this.browserSupports()) {
        this.loadImg(el);

      } else if (!this.active) {
        this.listen();
        this.run();
      }
    },

    imgLoaded: function (event) {
      // this is the scope of event
      var el = defer.getTarget(event),
        now = new Date().getTime();

      if (el) {
        el.defer.loaded = true;
        defer.trace('#' + el.defer.index + ' loaded');
        defer.removeEvent(el, 'load', defer.imgLoaded);
        defer.loadTimes.push(now - el.defer.loadStart);

        if (defer.callback) {
          defer.callback(now);
        }
      }

      defer.loaded += 1;
      defer.loading -= 1;
    },

    imgError: function (event) {
      var img = defer.getTarget(event);
      if (img && img.defer) {
        img.defer.loaded = true;
      }
      defer.loading -= 1;
    },

    loadImg: function (el) {
      this.loading += 1;
      el.setAttribute('onload', '');
      this.trace('#' + el.defer.index + ' requested');

      this.addEvent(el, 'load', this.imgLoaded);
      this.addEvent(el, 'error', this.imgError);

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
      for (i; i < this.imgs.length; i += 1) {
        el = this.imgs[i];
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
    },

    // ultilities
    trace: function (obj, type) {
      if (window.console === undefined || !this.showConsole) {
        this.debug.push(obj);
        return;
      }

      type = type || 'log';
      console[type](obj);
    },

    browserSupports: function () {
      var el = document.body;
      return el.getBoundingClientRect &&
        (window.innerHeight || document.documentElement.clientHeight) &&
        (el.attachEvent || el.addEventListener);
    },

    // shims, mostly for IE
    getTarget: function (event) {
      event = event || window.event;
      var target;
      if (event) {
        target = event.target || event.srcElement;
      }
      return target;
    },

    addEvent: function (el, name, callback) {
      if (el.addEventListener) { // Modern
        el.addEventListener(name, callback, false);
      } else if (el.attachEvent) { // Internet Explorer
        el.attachEvent("on" + name, callback);
      }
    },

    removeEvent: function (el, name, callback) {
      if (el.removeEventListener) { // Modern
        el.removeEventListener(name, callback);
      } else if (el.attachEvent) { // Internet Explorer
        el.detachEvent("on" + name, callback);
      }
    }

  };
}());
