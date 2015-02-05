
(function () {
  "use strict";

  defer.images = {
    add: function (el) {
      defer.counts.total += 1;

      el.defer = {
        src: el.getAttribute('data-src'),
        index: defer.counts.total,
        loading: false,
        loaded: false
      };

      // this.setWidth(el);
      defer.imgs.push(el);

      if (defer.dom.inView(el)) {
        this.loadImg(el);
      }
    },

    // setWidth: function (el) {
    //   if (el.style.width === '') {
    //     var w = el.defer.src.split("px")[0].split('/');
    //     el.style.width = w[w.length - 1] + 'px';
    //   }
    // },

    imgLoaded: function (event) {
      var el = event.srcElement;
      el.className = 'loaded';

      defer.counts.loading -= 1;
      defer.trace('#' + el.defer.index + ' loaded');
      el.onload = null;
      el.defer.loaded = true;

      defer.loadTimes.push(new Date().getTime() - el.defer.loadStart);
      this.removeLoaded();
    },

    loadImg: function (el) {
      defer.counts.loading += 1;
      defer.trace('#' + el.defer.index + ' requested');

      el.onload = function (event) {
        defer.images.imgLoaded(event);
      };

      el.src = el.defer.src;
      el.defer.loading = true;
      el.defer.loadStart = new Date().getTime();
    },

    removeLoaded: function () {
      var i, tmp = [];
      for (i = 0; i < defer.imgs.length; i += 1) {
        if (defer.imgs[i].defer.loaded) {
          delete defer.imgs[i].defer;
        } else {
          tmp.push(defer.imgs[i]);
        }
      }
      defer.imgs = tmp;
    },

    checkAll: function () {
      var i = 0, el;
      for (i; i < defer.imgs.length; i += 1) {
        el = defer.imgs[i];

        if (defer.dom.inView(el) && !el.defer.loading) {
          this.loadImg(el);
        }
      }
    }
  };
}());
