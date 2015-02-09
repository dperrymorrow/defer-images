describe "Defer Tests", ->
  "use strict"
  imgs = []

  beforeEach ->
    defer.showConsole = false
    imgs = setup()

  afterEach ->
    teardown(imgs)

  describe 'adding images', ->
    it "pushes into the array", ->
      expect(defer.imgs.length).toEqual imgs.length;

    it "sets defer propterties", ->
      expect(imgs[0].defer.src).not.toBeUndefined
      expect(imgs[0].defer.loading).toBe false
      expect(imgs[0].defer.loaded).toBe false
      expect(imgs[0].defer.index).not.toBeUndefined

    it "calls listen", ->
      expect(defer.listen.calls.any()).toBeTrue

  describe 'loading images', ->
    beforeEach ->
      spyOn(defer, 'removeLoaded').and.callThrough()
      spyOn(defer, 'imgLoaded').and.callThrough()
      defer.loadImg imgs[0]

    it 'calls hander on load', ->
      imgs[0].onload()
      expect(defer.imgLoaded).toHaveBeenCalled

    it 'a load error will not hang up the que', ->
      count = defer.loading
      defer.loadImg imgs[5]
      expect(defer.loading).toEqual count + 1
      imgs[5].onerror()
      expect(defer.loading).toEqual count

    it 'sets the data-src to src on load', ->
      expect(imgs[0].src).toEqual imgs[0].getAttribute('data-src')
      expect(imgs[0].defer.loading).toBeTrue

    it 'sets the data-src to src on load', ->
      expect(imgs[0].defer.loading).toBeTrue

    it 'clears the array when called', ->
      expect(defer.removeLoaded).toHaveBeenCalled


  describe 'removing loaded', ->
    it 'removes all imgs that are loaded', ->
      defer.imgs.forEach (img) ->
        img.defer.loaded = true

      defer.removeLoaded()
      expect(defer.imgs).toBeEmpty


    it 'shuts down if imgs empty and allIn', ->
      spyOn defer, 'destroy'
      defer.allIn = true;
      defer.imgs = []
      expect(defer.destroy).toHaveBeenCalled


  describe 'searching the viewport', ->
    beforeEach ->
      spyOn(defer, 'inView').and.returnValue(true);
      defer.checkAll()

    it 'loads anything in viewport', ->
      expect(defer.inView.calls.count()).toEqual imgs.length

    it 'incriments the loading counter', ->
      expect(defer.loading).toEqual imgs.length

  describe 'all in set on load', ->
    it 'sets all in when window is done', ->
      defer.allIn = false
      defer.listen()
      window.onload()
      expect(defer.allIn).toBeTrue

