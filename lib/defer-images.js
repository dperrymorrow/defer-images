(function () {
  'use strict';
  window.defer = {
    debugInfo: [],

    counts: {
      total: 0,
      lastInView: 0,
      loading: 0
    },

    showConsole: true,

    trace: function (obj, type) {
      if (window.console === undefined || !this.showConsole) {
        this.debugInfo.push(obj);
        return;
      }

      type = type || 'log';
      console[type](obj);
    }
  };

  window.defer.images = {
    observer: false,
    imgs: [],
    listening: false,
    allRegistered: false,
    lastScrollPos: 0,
    scrollDir: 'down',
    className: 'defer',
    scrollDelay: 200,

    start: function (el) {
      if (window.MutationObserver === undefined) {
        return;
      }

      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          defer.images.findImgs(mutation.addedNodes);
        });
      });

      observer.observe(el, {
        attributes: true,
        childList: true,
        characterData: false,
        subTree: true,
        attributeFilter: ['class']
      });
    },

    findImgs: function (nodes) {
      var i, node;
      for (i = 0; i < nodes.length; i += 1) {
        node = nodes[i];
        if (node.childNodes.length > 0) {
          defer.images.findImgs(node.childNodes);
        }

        if (node.classList && node.classList.contains(defer.images.className)) {
          defer.images.add(node);
        }
      }
    },

    done: function () {
      if (this.observer) {
        this.observer.disconnect();
      }
      this.allRegistered = true;
    },

    add: function (el) {
      defer.counts.total += 1;

      el.defer = {
        src: el.getAttribute('data-src'),
        index: defer.counts.total,
        loaded: false,
        loading: false
      };

      // this.setWidth(el);
      this.imgs.push(el);
      this.listen();

      // load it immediately if its in the view, or first one
      if (this.inView(el) || this.imgs.length === 1) {
        this.loadImg(el);
      }
    },

    // setWidth: function (el) {
    //   if (el.style.width === '') {
    //     var w = el.defer.src.split("px")[0].split('/');
    //     el.style.width = w[w.length - 1] + 'px';
    //   }
    // },

    listen: function () {
      if (this.listening) {
        return;
      }

      this.listening = true;

      this.viewPort = setInterval(function () {
        if (defer.images.recordScroll()) {
          defer.images.checkAll();
        }
      }, this.scrollDelay);

      defer.bg.listen();
    },

    destroy: function () {
      defer.trace('destroyed');
      clearInterval(this.viewPort);
      defer.bg.destroy();

      this.imgs = [];
      delete this.imgs;
      delete window.deferImages;
    },

    imgLoaded: function (event) {
      var el = event.srcElement;
      el.className = 'loaded';

      this.loading -= 1;
      defer.trace('#' + el.defer.src + ' loaded');
      el.onload = null;

      el.defer.loaded = true;
      defer.bg.loadTimes.push(new Date().getTime() - el.defer.loadStart);
      this.removeLoaded();
      defer.trace(this.imgs.length + ' remaining');
    },

    loadImg: function (el) {
      this.loading += 1;
      defer.trace('#' + el.defer.src + ' requested');

      el.onload = function (event) {
        defer.images.imgLoaded(event);
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
      if (this.allRegistered && this.imgs === 0) {
        deferBg.destroy();
        this.destroy();
      }

      var i = 0, el;
      for (i; i < this.imgs.length; i += 1) {
        el = this.imgs[i];

        if (this.inView(el) && !el.defer.loading) {
          this.loadImg(el);
        }
      }
    },

    recordScroll: function () {
      var supportPageOffset = window.pageXOffset !== undefined,
        isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat'),
        y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

      // has not changed since last check
      if (this.lastScrollPos === y) {
        return false;
      }

      this.scrollDir = (y > this.lastScrollPos) ? 'down' : 'up';
      this.lastScrollPos = y;
      defer.trace('scrolling ' + this.scrollDir);
      return true;
    },

    inView: function (el) {
      var box = el.getBoundingClientRect(),
        bottom = (window.innerHeight || document.documentElement.clientHeight);
      defer.counts.lastInView = el.defer.index;

      return (box.bottom >= 0 && box.top <= bottom);
    },

  };
}());