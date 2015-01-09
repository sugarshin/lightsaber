module.exports =
  class Utility
    @addEvent: (el, type, handler) ->
      el.addEventListener type, handler
    @rmEvent: (el, type, handler) ->
      el.removeEventListener type, handler
