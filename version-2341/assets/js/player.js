import { H as Hls } from './hls-vendor.js';

const video = document.getElementById('moviePlayer');
const playButton = document.getElementById('playButton');
let initialized = false;
let hlsInstance = null;

function initializePlayer() {
  if (!video || initialized) {
    return;
  }

  const source = video.dataset.src;

  if (!source) {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
  } else if (Hls && Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });
    hlsInstance.loadSource(source);
    hlsInstance.attachMedia(video);
  } else {
    video.src = source;
  }

  initialized = true;
}

async function startPlayback() {
  initializePlayer();

  if (!video) {
    return;
  }

  if (playButton) {
    playButton.classList.add('hidden');
  }

  try {
    await video.play();
  } catch (error) {
    if (playButton) {
      playButton.classList.remove('hidden');
    }
  }
}

if (playButton) {
  playButton.addEventListener('click', startPlayback);
}

if (video) {
  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener('play', function () {
    if (playButton) {
      playButton.classList.add('hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (playButton && video.currentTime === 0) {
      playButton.classList.remove('hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
