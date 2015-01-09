module.exports =
  class BufferLoader
    constructor: (context, urlList, callback) ->
      @context = context
      @urlList = urlList
      @onload = callback
      @bufferList = []
      @loadCount = 0

    loadBuffer: (url, index) ->
      req = new XMLHttpRequest
      req.open 'GET', url, true
      req.responseType = 'arraybuffer'

      req.onload = =>
        @context.decodeAudioData req.response, (buffer) =>
          unless buffer then console.error url
          @bufferList[index] = buffer
          if ++@loadCount is @urlList.length
            @onload? @bufferList
        , (err) -> console.error err

      req.onerror = -> console.error 'error'

      req.send()

    load: ->
      i = 0
      while i < @urlList.length
        @loadBuffer @urlList[i], i
        ++i
