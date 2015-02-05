defer.bg = {
  enabled: true,

  guessNext: function () {
    if (!this.enabled || defer.counts.loading !== 0) {
      return;
    }

    defer.dom.checkScroll();

    var i, view = defer.counts.lastInView, el;

    if (defer.scrollDir === 'up') {

      i = defer.imgs.length - 1;
      while (i >= 0) {
        el = defer.imgs[i];

        if (el.defer.index < view && !el.defer.loading) {
          defer.trace('loading #' + el.defer.index + " in bg");
          defer.images.loadImg(el);
          break;
        }
        i -= 1;
      }

    } else {
      i = 0;
      while (i < defer.imgs.length) {
        el = defer.imgs[i];

        if (el.defer.index > view && !el.defer.loading) {
          defer.trace('loading #' + el.defer.index + " in bg");
          defer.images.loadImg(el);
          break;
        }
        i += 1;
      }
    }
  }
};

