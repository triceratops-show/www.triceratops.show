async function getContentLength(filename) {
  return new Promise(async (resolve, reject) => {
    // TODO: error validation
    const response = await fetch(filename, {
      method: "HEAD",
    });

    const contentLength = response.headers.get("content-length");
    console.log({ contentLength });
    if (!contentLength) {
      throw new Error("Could not find value of header content-length");
    }
    resolve(contentLength);
  });
}

export function initPodcastBytes(CMS, MP3_PREFIX) {
  console.log("initializing 'preSave' event for 'podcast_bytes' populator");

  CMS.registerEventListener({
    name: "preSave",
    handler: async function ({ entry }) {
      let podcastFilename = entry.get("data").get("podcast_file");
      if (!podcastFilename) {
        throw new Error("Field 'podcast_file' is required`");
      }
      podcastFilename = MP3_PREFIX + podcastFilename;

      let contentLength = entry.get("data").get("podcast_bytes");
      if (!contentLength) {
        console.log("Loading mp3 file into memory, it can take a while.");
        contentLength = await getContentLength(podcastFilename);
        console.log("Populating podcast_bytes with value", contentLength);
      } else {
        console.log(
          "NOT populating field 'podcast_bytes' since it's already populated."
        );
      }
      return entry.get("data").set("podcast_bytes", contentLength);
    },
  });
}
