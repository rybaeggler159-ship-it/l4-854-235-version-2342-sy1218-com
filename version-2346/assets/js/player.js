function initPlayer(src) {
  var video = document.getElementById('movieVideo');
  var cover = document.getElementById('playCover');
  var hlsInstance = null;
  var bound = false;

  function bind() {
    if (!video || !src || bound) {
      return;
    }
    bound = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls();
      hlsInstance.loadSource(src);
      hlsInstance.attachMedia(video);
    } else {
      video.src = src;
    }
  }

  function play() {
    bind();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    var action = video.play();
    if (action && typeof action.catch === 'function') {
      action.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', play);
  }
  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
  }
}
