/*!
 * @license lightsaber v0.0.2
 * (c) 2014 sugarshin https://github.com/sugarshin
 * License: MIT
 */
(function() {
  var BufferLoader, Lightsaber;

  BufferLoader = (function() {
    function BufferLoader(context, urlList, callback) {
      this.context = context;
      this.urlList = urlList;
      this.onload = callback;
      this.bufferList = [];
      this.loadCount = 0;
    }

    BufferLoader.prototype.loadBuffer = function(url, index) {
      var request;
      request = new XMLHttpRequest;
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = (function(_this) {
        return function() {
          return _this.context.decodeAudioData(request.response, function(buffer) {
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
      request.onerror = function() {
        return console.error('error');
      };
      return request.send();
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

  Lightsaber = (function() {
    var AudioContext;

    AudioContext = window.AudioContext || window.webkitAudioContext;

    function Lightsaber(audioPath, startBtn) {
      this.startBtn = startBtn;
      this.context = new AudioContext;
      this.bufferLoader = new BufferLoader(this.context, [audioPath]);
      this.bufferLoader.load();
      this.events();
    }

    Lightsaber.prototype.play = function(buffer, vol) {
      var gainNode, source;
      source = this.context.createBufferSource();
      gainNode = this.context.createGain();
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.context.destination);
      gainNode.gain.value = vol != null ? vol : 0;
      return source.start(0);
    };

    Lightsaber.prototype.rm = function(el) {
      return el.parentNode.removeChild(el);
    };

    Lightsaber.prototype.events = function() {
      window.addEventListener('devicemotion', (function(_this) {
        return function(ev) {
          var aig;
          aig = ev.accelerationIncludingGravity;
          if (aig.x > 20 || aig.y > 20 || aig.z > 20) {
            return _this.play(_this.bufferLoader.bufferList[0], 1);
          }
        };
      })(this));
      return this.startBtn.addEventListener('click', (function(_this) {
        return function() {
          _this.play(_this.bufferLoader.bufferList[0]);
          return _this.rm(_this.startBtn);
        };
      })(this));
    };

    return Lightsaber;

  })();

  window.Lightsaber || (window.Lightsaber = Lightsaber);

}).call(this);
