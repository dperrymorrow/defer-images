(function () {
  "use strict";

  window.defer.bg = {

    loadTimes: [],
    bgDelay: 300,
    bg: null,
    enabled: true,
    d: null,

    listen: function () {
      if (!this.enabled) {
        return;
      }

      this.d = defer.images;
      this.bg = setInterval(function () {
        defer.bg.guessNext();
      }, this.bgDelay);
    },

    guessNext: function () {
      if ((this.d.allRegistered && this.d.imgs.length === 0) || defer.counts.loading !== 0) {
        return;
      }

      defer.trace('guess next called ' + this.d.scrollDir);
      var i = defer.counts.lastInView, el;

      if (this.d.scrollDir === 'up') {

        while (i >= 0) {
          el = this.d.imgs[i];

          if (el && !el.defer.loading) {
            this.d.loadImg(el);
            break;
          }
          i -= 1;
        }

      } else {

        while (i < this.d.imgs.length) {
          el = this.d.imgs[i];
          if (el && !el.defer.loading) {
            this.d.loadImg(el);
            break;
          }
          i += 1;
        }
      }
    },

    destroy: function () {
      clearInterval(this.bg);
    }
  };

}());