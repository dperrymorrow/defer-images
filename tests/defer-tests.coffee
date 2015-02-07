describe "Defer Tests", ->
  "use strict"
  img = document.createElement 'img'

  beforeEach ->
    defer.showConsole = false;
    img.setAttribute 'data-src', 'http://placekitten.com/200/300'
    defer.add img

  describe 'adding images', ->
    it "pushes into the array", ->
      expect(defer.imgs.length).toEqual 1;

    it "add load listener", ->
      expect(img.onload).not.toBeUndefined

    it "adds error listener", ->
      expect(img.onload).not.toBeUndefined

  describe 'loading images', ->

    beforeEach ->
      defer.loadImg img

    it "sets the src to the data-src when loaded", ->
      expect(img.getAttribute('src')).toEqual img.getAttribute('data-src')

    it "defer data set when loading", ->
      expect(img.defer.loading).toBeTrue

    it "defer data set when loaded", ->
      img.onload();
      expect(img.defer.loaded).toBeTrue


