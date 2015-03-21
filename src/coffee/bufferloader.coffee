"use strict"

module.exports =
class BufferLoader
  constructor: (@context, @urlList) ->
    @bufferList = []

  loadBuffer: (url, index) ->
    req = new XMLHttpRequest
    req.open 'GET', url, true
    req.responseType = 'arraybuffer'

    ondecodesuccess = (buffer) =>
      unless buffer then console.error url
      @bufferList[index] = buffer

    ondecodeerror = (err) -> console.error err

    req.onload = =>
      @context.decodeAudioData req.response, ondecodesuccess, ondecodeerror

    req.onerror = -> console.error 'error'

    req.send()

  load: ->
    for url, i in @urlList
      @loadBuffer url, i
