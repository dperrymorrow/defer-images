(function () {
  "use strict";
  defer.dom = {
    lastScrollPos: 0,

    inView: function (el) {
      var box = el.getBoundingClientRect(),
        bottom = (window.innerHeight || document.documentElement.clientHeight);
      return (box.bottom >= 0 && box.top <= bottom);
    },

    getScrollDir: function () {
      var supportPageOffset = window.pageXOffset !== undefined,
        isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat'),
        y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop,
        dir = (y >= this.lastScrollPos) ? 'down' : 'up';

      this.lastScrollPos = y;
      return dir;
    }

  };
}());
