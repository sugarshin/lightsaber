###!
 * @license lightsaber
 * (c) sugarshin
 * License: MIT
###

"use strict"

require('insert-css') require '../index.styl'
Lightsaber = require './lightsaber'

new Lightsaber [
  'start.mp3'
  'slow.mp3'
  'normal.mp3'
  'clash.mp3'
  'stop.mp3'
], document.getElementById 'start'
