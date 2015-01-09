module.exports =
  class Utility
    @addEvent: (el, type, eventHandler) -> el.addEventListener type, eventHandler
    @rmEvent: (el, type, eventHandler) -> el.removeEventListener type, eventHandler
