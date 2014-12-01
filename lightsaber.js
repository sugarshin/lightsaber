/*!
 * @license lightsaber v0.0.1
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
      var loader, request;
      request = new XMLHttpRequest;
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      loader = this;
      request.onload = function() {
        return loader.context.decodeAudioData(request.response, (function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount === loader.urlList.length) {
            return loader.onload(loader.bufferList);
          }
        }), function(err) {
          return console.error(err);
        });
      };
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
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

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
          var ag;
          ag = ev.accelerationIncludingGravity;
          if (ag.x > 20 || ag.y > 20 || ag.z > 20) {
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
