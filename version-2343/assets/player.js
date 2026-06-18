(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var boxes = Array.prototype.slice.call(document.querySelectorAll('.player-box'));

    boxes.forEach(function (box) {
      var video = box.querySelector('video');
      var cover = box.querySelector('.player-cover');
      var button = box.querySelector('.play-action');
      var hls = null;

      if (!video) {
        return;
      }

      function loadStream() {
        if (video.dataset.ready === '1') {
          return;
        }

        var stream = video.getAttribute('data-stream');
        if (!stream) {
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        }

        video.dataset.ready = '1';
      }

      function startPlayback() {
        loadStream();
        box.classList.add('is-playing');
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {});
        }
      }

      if (cover) {
        cover.addEventListener('click', startPlayback);
      }
      if (button) {
        button.addEventListener('click', function (event) {
          event.stopPropagation();
          startPlayback();
        });
      }
      video.addEventListener('play', function () {
        box.classList.add('is-playing');
      });
      video.addEventListener('ended', function () {
        box.classList.remove('is-playing');
      });
      window.addEventListener('beforeunload', function () {
        if (hls && typeof hls.destroy === 'function') {
          hls.destroy();
        }
      });
    });
  });
})();
