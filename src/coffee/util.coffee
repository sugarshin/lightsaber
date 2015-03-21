"use strict"

module.exports =
  addEvent: (el, type, handler, useCapture = false) ->
    el.addEventListener type, handler, useCapture
  rmEvent: (el, type, handler, useCapture = false) ->
    el.removeEventListener type, handler, useCapture
