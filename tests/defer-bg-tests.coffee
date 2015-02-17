describe "Defer Tests", ->
  "use strict"
  imgs = []

  beforeEach ->
    defer.destroy()
    # imgs = setup()

  afterEach ->
    defer.destroy()

  describe "check method", ->
    beforeEach ->
      spyOn defer.bg, 'findSpeed'
      spyOn defer.bg, 'findImgs'

    it 'is enabled by default', ->
      expect(defer.bg.enabled).toBeTrue

    it "does nothing if not enabled", ->
      defer.bg.enabled = false;
      defer.bg.check()

      expect(defer.bg.findSpeed).wasNotCalled
      expect(defer.bg.findImgs).wasNotCalled

    it 'finds images and speed if enabled', ->
      defer.bg.check()
      expect(defer.bg.findSpeed).toHaveBeenCalled
      expect(defer.bg.findImgs).toHaveBeenCalled

  describe "finding the speed and bucket size", ->
    beforeEach ->
      defer.loadTimes = [100, 250, 100]

    it "takes first speed if no load times recorded", ->
      defer.loadTimes = []
      defer.bg.findSpeed()
      expect(defer.bg.batchSize).toEqual defer.bg.speeds[0].batch

    it "handles NaN in the loadTimes", ->
      defer.loadTimes.push(0)
      defer.bg.findSpeed()
      expect(Math.round(defer.bg.avg)).toEqual 150

    it 'calculates the average based on load speeds', ->
      defer.bg.findSpeed()
      expect(Math.round(defer.bg.avg)).toEqual 150
      expect(defer.bg.batchSize).toEqual 5

    it 'does not divide by full count if items 0', ->
      defer.loadTimes = [0, 0, 0, 50]
      defer.bg.findSpeed()
      expect(Math.round(defer.bg.avg)).toEqual 50
      
     it 'does not divide by full count if items 0', ->
      defer.loadTimes = [NaN, NaN, 0, 0]
      defer.bg.findSpeed()
      expect(defer.bg.avg).toEqual 0


  describe "finds the right batch size based on speed", ->
    beforeEach ->
      defer.destroy()

    defer.bg.speeds.forEach (speed) ->
      it "finds the #{speed.lbl} speed", ->
        defer.loadTimes = [speed.speed + 1]
        defer.bg.findSpeed()
        expect(defer.bg.batchSize).toEqual speed.batch

  describe "finds images to laod in the bg", ->

    beforeEach ->
      defer.active = true
      setup()
      defer.bg.batchSize = 5
      defer.bg.findImgs()

    afterEach ->
      defer.destroy()

    it "should find 5 images to load", ->
      expect(defer.loading).toEqual 5
      expect(defer.bg.batchFull()).toBeTrue

    it "should set to 0 when full", ->
      expect(defer.bg.found).toEqual 0
      









