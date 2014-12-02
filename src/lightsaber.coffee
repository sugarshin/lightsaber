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



class Lightsaber

  AudioContext = window.AudioContext or window.webkitAudioContext

  constructor: (audioPath, startBtn) ->
    @startBtn = startBtn
    @context = new AudioContext
    @bufferLoader = new BufferLoader @context, [audioPath]
    @bufferLoader.load()
    @events()


  play: (buffer, vol) ->
    source = @context.createBufferSource()
    gainNode = @context.createGain()

    source.buffer = buffer
    source.connect gainNode

    gainNode.connect @context.destination
    gainNode.gain.value = if vol? then vol else 0

    source.start 0

  rm: (el) -> el.parentNode.removeChild el

  events: ->
    window.addEventListener 'devicemotion', (ev) =>
      aig = ev.accelerationIncludingGravity
      if aig.x > 20 or aig.y > 20 or aig.z > 20
        @play @bufferLoader.bufferList[0], 1

    @startBtn.addEventListener 'click', =>
      @play @bufferLoader.bufferList[0]
      @rm @startBtn

window.Lightsaber or= Lightsaber