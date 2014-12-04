/*!
 * @license lightsaber v1.0.2
 * (c) 2014 sugarshin https://github.com/sugarshin
 * License: MIT
 */
(function() {
  var BufferLoader, Lightsaber, Utility,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Utility = (function() {
    function Utility() {}

    Utility.prototype.addEvent = function(el, type, eventHandler) {
      return el.addEventListener(type, eventHandler);
    };

    Utility.prototype.rmEvent = function(el, type, eventHandler) {
      return el.removeEventListener(type, eventHandler);
    };

    return Utility;

  })();

  BufferLoader = (function() {
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

  Lightsaber = (function(_super) {
    var AudioContext, _isDeviceActivate;

    __extends(Lightsaber, _super);

    AudioContext = window.AudioContext || window.webkitAudioContext;

    _isDeviceActivate = false;

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

    Lightsaber.prototype.soundPlay = function(buffer, vol, loopSound) {
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
      this.addMotionEvent();
      this.soundPlay(this.bufferLoader.bufferList[0], 1);
      this.isStart = true;
      return document.getElementById('sword').style.display = 'block';
    };

    Lightsaber.prototype.end = function() {
      this.rmMotionEvent();
      this.soundPlay(this.bufferLoader.bufferList[4], 1);
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
      return this.startBtn.addEventListener('click', (function(_this) {
        return function() {
          if (_isDeviceActivate === false) {
            _this.soundPlay(_this.bufferLoader.bufferList[0]);
            _isDeviceActivate = true;
          }
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

  })(Utility);

  window.Lightsaber || (window.Lightsaber = Lightsaber);

}).call(this);
