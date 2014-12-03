class Utility
  addEvent: (el, type, eventHandler) -> el.addEventListener type, eventHandler
  rmEvent: (el, type, eventHandler) -> el.removeEventListener type, eventHandler



class BufferLoader
  constructor: (context, urlList, callback) ->
    @context = context
    @urlList = urlList
    @onload = callback
    @bufferList = []
    @loadCount = 0

  loadBuffer: (url, index) ->
    request = new XMLHttpRequest
    request.open 'GET', url, true
    request.responseType = 'arraybuffer'

    request.onload = =>
      @context.decodeAudioData request.response, (buffer) =>
        unless buffer then console.error url
        @bufferList[index] = buffer
        if ++@loadCount is @urlList.length
          @onload? @bufferList
      , (err) -> console.error err

    request.onerror = -> console.error 'error'

    request.send()

  load: ->
    i = 0
    while i < @urlList.length
      @loadBuffer @urlList[i], i
      ++i



class Lightsaber extends Utility

  AudioContext = window.AudioContext or window.webkitAudioContext

  _isDeviceActivate = false

  constructor: (arrayAudioPath, startBtn) ->
    @startBtn = startBtn
    @context = new AudioContext
    @bufferLoader = new BufferLoader @context, arrayAudioPath
    @bufferLoader.load()
    @isPlaying = false
    @isStart = false
    @events()


  soundPlay: (buffer, vol, loopSound) ->
    # todo
    if loopSound is true
      loopSource = @context.createBufferSource()
      loopGainNode = @context.createGain()

      loopSource.buffer = buffer
      loopSource.connect loopGainNode

      loopGainNode.connect @context.destination
      loopGainNode.gain.value = if vol? then vol else 0

      loopSource.loop = true
      loopSource.start 0

    @source = @context.createBufferSource()
    @gainNode = @context.createGain()

    @source.buffer = buffer
    @source.connect @gainNode

    @gainNode.connect @context.destination
    @gainNode.gain.value = if vol? then vol else 0

    if @isStart is false then @source.start 0

    if @isPlaying is false and @isStart is true
      @source.start 0
      @isPlaying = true
      @source.onended = (ev) => @isPlaying = false

  shake: (event) =>
    aig = event.accelerationIncludingGravity
    # if 10 > aig.x > 5 or 10 > aig.y > 5 or 10 > aig.z > 5
    #   @soundPlay @bufferLoader.bufferList[1], 1
    if 20 > aig.x > 15 or 20 > aig.y > 15 or 20 > aig.z > 15
      @soundPlay @bufferLoader.bufferList[2], 1
    else if aig.x > 30 or aig.y > 30 or aig.z > 30
      @soundPlay @bufferLoader.bufferList[3], 1

  rm: (el) -> el.parentNode.removeChild el

  start: ->
    @addMotionEvent()
    @soundPlay @bufferLoader.bufferList[0], 1
    # Loop
    # @soundPlay @bufferLoader.bufferList[1], .2, true
    @isStart = true
    # todo
    document
      .getElementById 'sword'
      .style.display = 'block'

  end: ->
    @rmMotionEvent()
    @soundPlay @bufferLoader.bufferList[4], 1
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

  events: ->
    @startBtn.addEventListener 'click', =>
      if _isDeviceActivate is false
        @soundPlay @bufferLoader.bufferList[0]
        _isDeviceActivate = true
      @toggle()

  addMotionEvent: -> @addEvent window, 'devicemotion', @shake
  rmMotionEvent: -> @rmEvent window, 'devicemotion', @shake

window.Lightsaber or= Lightsaber
