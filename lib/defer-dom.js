(function () {
  "use strict";
  defer.dom = {
    observer: false,
    className: 'defer',
    container: null,
    lastScrollPos: 0,

    watchDom: function (el) {
      this.container = el;
      if (window.MutationObserver === undefined) {
        return;
      }

      this.observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          defer.dom.findImgs(mutation.addedNodes);
        });
      });

      this.observer.observe(this.container, {
        attributes: true,
        childList: true,
        characterData: false,
        subTree: true,
        attributeFilter: ['class']
      });
    },

    stopWatching: function () {
      if (this.observer) {
        this.observer.disconnect();
      }
    },

    findImgs: function (nodes) {
      var i, node;
      for (i = 0; i < nodes.length; i += 1) {
        node = nodes[i];
        if (node.childNodes.length > 0) {
          defer.dom.findImgs(node.childNodes);
        }

        if (node.classList && node.classList.contains(defer.dom.className)) {
          defer.images.add(node);
        }
      }
    },

    inView: function (el) {
      var box = el.getBoundingClientRect(),
        bottom = (window.innerHeight || document.documentElement.clientHeight),
        visible = (box.bottom >= 0 && box.top <= bottom);

      if (visible) {
        defer.counts.lastInView = el.defer.index;
      }

      return visible;
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
