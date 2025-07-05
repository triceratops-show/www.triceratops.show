// It loads the entire file in memory
// Which is slow
// But since it should be done only once it's fine
async function getMp3Duration(filename) {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const request = new XMLHttpRequest();
    request.open("GET", filename, true);
    request.responseType = "arraybuffer";
    request.onload = function () {
      audioContext.decodeAudioData(request.response, function (buffer) {
        let duration = buffer.duration;
        resolve(toHHMMSS(duration));
      });
    };
    request.send();
  });
}
function toHHMMSS(timeInSeconds) {
  var sec_num = parseInt(timeInSeconds, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
}

export function initPodcastDuration(CMS, MP3_PREFIX) {
  console.log("initializing 'preSave' event for 'podcast_duration' populator");

  CMS.registerEventListener({
    name: "preSave",
    handler: async function ({ entry }) {
      let podcastFilename = entry.get("data").get("podcast_file");
      if (!podcastFilename) {
        throw new Error("Field 'podcast_file' is required`");
      }
      podcastFilename = MP3_PREFIX + podcastFilename;

      let contentDuration = entry.get("data").get("podcast_duration");
      if (!contentDuration) {
        contentDuration = await getMp3Duration(podcastFilename);
        console.log("Populating podcast_duration with value", contentDuration);
      } else {
        console.log(
          "NOT populating field 'podcast_duration' since it's already populated."
        );
      }
      return entry.get("data").set("podcast_duration", contentDuration);
    },
  });
}
