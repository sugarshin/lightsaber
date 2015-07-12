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
      unless buffer then return console.log 'ondecodesuccess', url
      @bufferList[index] = buffer

    ondecodeerror = (err) -> console.log 'ondecodeerror', err

    req.onload = =>
      @context.decodeAudioData req.response, ondecodesuccess, ondecodeerror

    req.onerror = (err) -> console.log 'req.onload', err

    req.send()

  load: ->
    for url, i in @urlList
      @loadBuffer url, i
