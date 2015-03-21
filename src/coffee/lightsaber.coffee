"use strict"

util = require './util'
BufferLoader = require './bufferloader'

module.exports =
class Lightsaber

  AudioContext = window.AudioContext or window.webkitAudioContext

  constructor: (arrayAudioPath, @startBtn) ->
    @context = new AudioContext
    @bufferLoader = new BufferLoader @context, arrayAudioPath
    @bufferLoader.load()
    @isPlaying = false
    @isStart = false
    @events()

  soundPlay: (buffer, vol) ->
    @source = @context.createBufferSource()
    @gainNode = @context.createGain()

    @source.buffer = buffer
    @source.connect @gainNode

    @gainNode.connect @context.destination
    @gainNode.gain.value = if vol? then vol else 0

    # todo: start用
    if @isStart is false then @source.start 0

    if @isPlaying is false and @isStart is true
      @source.start 0
      @isPlaying = true
      @source.onended = (ev) => @isPlaying = false

  start: ->
    @soundPlay @bufferLoader.bufferList[0], 1
    @addMotionEvent()
    @isStart = true
    # todo
    document
      .getElementById 'sword'
      .style.display = 'block'

  end: ->
    @soundPlay @bufferLoader.bufferList[4], 1
    @rmMotionEvent()
    @isStart = false
    # todo
    document
      .getElementById 'sword'
      .style.display = 'none'

  toggle: ->
    if @isStart is false
      @start()
    else
      @end()

  onShake: (ev) =>
    aig = ev.accelerationIncludingGravity
    # if 10 > aig.x > 5 or 10 > aig.y > 5 or 10 > aig.z > 5
    #   @soundPlay @bufferLoader.bufferList[1], 1
    if 20 > aig.x > 15 or 20 > aig.y > 15 or 20 > aig.z > 15
      @soundPlay @bufferLoader.bufferList[2], 1
    else if aig.x > 30 or aig.y > 30 or aig.z > 30
      @soundPlay @bufferLoader.bufferList[3], 1

  events: -> util.addEvent @startBtn, 'click', => @toggle()

  addMotionEvent: -> util.addEvent window, 'devicemotion', @onShake
  rmMotionEvent: -> util.rmEvent window, 'devicemotion', @onShake
