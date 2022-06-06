const audio = document.getElementById("episode-audio-player");

if (audio) {
  audio.addEventListener("play", () => {
    gtag("event", "audio_start", {
      // audio_duration: audio.duration,
      audio_url: audio.currentSrc,
    });
  });

  audio.addEventListener("ended", () => {
    gtag("event", "audio_complete", {
      // audio_duration: audio.duration,
      audio_url: audio.currentSrc,
    });
  });
}

const video = document.getElementById("episode-video-player");

if (video) {
  video.addEventListener("play", () => {
    gtag("event", "video_local_start", {
      // video_duration: video.duration,
      video_url: video.currentSrc,
    });
  });

  video.addEventListener("ended", () => {
    gtag("event", "video_local_complete", {
      // video_duration: video.duration,
      video_url: video.currentSrc,
    });
  });
}
