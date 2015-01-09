/*!
 * @license lightsaber v1.1.0
 * (c) 2015 sugarshin https://github.com/sugarshin
 * License: MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Lightsaber, lightsaber;

Lightsaber = require('./lightsaber');

lightsaber = new Lightsaber(['start.mp3', 'slow.mp3', 'normal.mp3', 'clash.mp3', 'stop.mp3'], document.getElementById('start'));



},{"./lightsaber":4}],2:[function(require,module,exports){

/*!
 * @license coffee-mixin v2.1.0
 * (c) 2014 sugarshin https://github.com/sugarshin
 * License: MIT
 */
var Mixin,
  __hasProp = {}.hasOwnProperty;

module.exports = Mixin = (function() {
  function Mixin() {}

  Mixin.inheritance = function(child, parent) {
    var ctor, key;
    for (key in parent) {
      if (!__hasProp.call(parent, key)) continue;
      child[key] = parent[key];
    }
    ctor = function() {
      this.constructor = child;
    };
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };

  Mixin.extend = function(obj, mixin) {
    var key, value;
    for (key in mixin) {
      if (!__hasProp.call(mixin, key)) continue;
      value = mixin[key];
      obj[key] = value;
    }
    return this;
  };

  Mixin.include = function(obj, mixin) {
    var key, value;
    for (key in mixin) {
      if (!__hasProp.call(mixin, key)) continue;
      value = mixin[key];
      obj.prototype[key] = value;
    }
    return this;
  };

  return Mixin;

})();



},{}],3:[function(require,module,exports){
var BufferLoader;

module.exports = BufferLoader = (function() {
  function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = [];
    this.loadCount = 0;
  }

  BufferLoader.prototype.loadBuffer = function(url, index) {
    var req;
    req = new XMLHttpRequest;
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.onload = (function(_this) {
      return function() {
        return _this.context.decodeAudioData(req.response, function(buffer) {
          if (!buffer) {
            console.error(url);
          }
          _this.bufferList[index] = buffer;
          if (++_this.loadCount === _this.urlList.length) {
            return typeof _this.onload === "function" ? _this.onload(_this.bufferList) : void 0;
          }
        }, function(err) {
          return console.error(err);
        });
      };
    })(this);
    req.onerror = function() {
      return console.error('error');
    };
    return req.send();
  };

  BufferLoader.prototype.load = function() {
    var i, _results;
    i = 0;
    _results = [];
    while (i < this.urlList.length) {
      this.loadBuffer(this.urlList[i], i);
      _results.push(++i);
    }
    return _results;
  };

  return BufferLoader;

})();



},{}],4:[function(require,module,exports){
var BufferLoader, Lightsaber, Mixin, Utility,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Mixin = require('../../coffee-mixin/dest/mixin');

Utility = require('./utility');

BufferLoader = require('./bufferloader');

module.exports = Lightsaber = (function() {
  var AudioContext;

  Mixin.include(Lightsaber, Utility);

  AudioContext = window.AudioContext || window.webkitAudioContext;

  function Lightsaber(arrayAudioPath, startBtn) {
    this.shake = __bind(this.shake, this);
    this.startBtn = startBtn;
    this.context = new AudioContext;
    this.bufferLoader = new BufferLoader(this.context, arrayAudioPath);
    this.bufferLoader.load();
    this.isPlaying = false;
    this.isStart = false;
    this.events();
  }

  Lightsaber.prototype.soundPlay = function(buffer, vol) {
    this.source = this.context.createBufferSource();
    this.gainNode = this.context.createGain();
    this.source.buffer = buffer;
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.gainNode.gain.value = vol != null ? vol : 0;
    if (this.isStart === false) {
      this.source.start(0);
    }
    if (this.isPlaying === false && this.isStart === true) {
      this.source.start(0);
      this.isPlaying = true;
      return this.source.onended = (function(_this) {
        return function(ev) {
          return _this.isPlaying = false;
        };
      })(this);
    }
  };

  Lightsaber.prototype.shake = function(event) {
    var aig, _ref, _ref1, _ref2;
    aig = event.accelerationIncludingGravity;
    if ((20 > (_ref = aig.x) && _ref > 15) || (20 > (_ref1 = aig.y) && _ref1 > 15) || (20 > (_ref2 = aig.z) && _ref2 > 15)) {
      return this.soundPlay(this.bufferLoader.bufferList[2], 1);
    } else if (aig.x > 30 || aig.y > 30 || aig.z > 30) {
      return this.soundPlay(this.bufferLoader.bufferList[3], 1);
    }
  };

  Lightsaber.prototype.start = function() {
    this.soundPlay(this.bufferLoader.bufferList[0], 1);
    this.addMotionEvent();
    this.isStart = true;
    return document.getElementById('sword').style.display = 'block';
  };

  Lightsaber.prototype.end = function() {
    this.soundPlay(this.bufferLoader.bufferList[4], 1);
    this.rmMotionEvent();
    this.isStart = false;
    return document.getElementById('sword').style.display = 'none';
  };

  Lightsaber.prototype.toggle = function() {
    if (this.isStart === false) {
      return this.start();
    } else {
      return this.end();
    }
  };

  Lightsaber.prototype.events = function() {
    return this.addEvent(this.startBtn, 'click', (function(_this) {
      return function() {
        return _this.toggle();
      };
    })(this));
  };

  Lightsaber.prototype.addMotionEvent = function() {
    return this.addEvent(window, 'devicemotion', this.shake);
  };

  Lightsaber.prototype.rmMotionEvent = function() {
    return this.rmEvent(window, 'devicemotion', this.shake);
  };

  return Lightsaber;

})();



},{"../../coffee-mixin/dest/mixin":2,"./bufferloader":3,"./utility":5}],5:[function(require,module,exports){
var Utility;

module.exports = Utility = (function() {
  function Utility() {}

  Utility.addEvent = function(el, type, eventHandler) {
    return el.addEventListener(type, eventHandler);
  };

  Utility.rmEvent = function(el, type, eventHandler) {
    return el.removeEventListener(type, eventHandler);
  };

  return Utility;

})();



},{}]},{},[1]);
