import CMS from "decap-cms-app";
import React from "react";
import { initPodcastBytes } from "./podcast_bytes_hook";
import { initPodcastDuration } from "./podcast_duration_hook";

// TODO keep this in sync with layouts/partials/episode.html
class EpisodesPreview extends React.Component {
  render() {
    const { entry, widgetFor } = this.props;

    return (
      <div class="section prose">
        <h1>
          <a href="https://wwww.triceratops.show">
            #{entry.getIn(["data", "episode"])} {entry.getIn(["data", "title"])}
          </a>
        </h1>

        <h2 id="#cabeça">
          <a href="#cabeça">cabeça</a>
        </h2>
        {widgetFor("description")}

        {widgetFor("body")}

        <div class="all-center flow">
          <h2>Escute no youtube:</h2>
          <div class="embed responsive-1by1 max-width">
            <iframe
              class="responsive-item"
              src={`//www.youtube.com/embed/${entry.getIn([
                "data",
                "youtube",
              ])}`}
              allowFullScreen=""
            ></iframe>
          </div>
        </div>
      </div>
    );
  }
}

// TODO keep this in sync with layouts/videos/single.html
class VideosPreview extends React.Component {
  render() {
    const { entry, widgetFor } = this.props;

    return (
      <>
        <div class="section prose">
          <h1>
            <a href="https://wwww.triceratops.show">
              {entry.getIn(["data", "title"])}
            </a>
          </h1>

          {widgetFor("body")}

          <div class="all-center flow">
            <div class="embed responsive-16by9 max-width">
              <iframe
                class="responsive-item"
                src={`//www.youtube.com/embed/${entry.getIn([
                  "data",
                  "youtube",
                ])}`}
                allowFullScreen=""
              ></iframe>
            </div>
          </div>
        </div>
        <section class="section prose" data-type="image">
          <span class="visually-hidden">Capa do episódio</span>
          <img src={entry.getIn(["data", "image"])} loading="lazy" alt="" />
        </section>
      </>
    );
  }
}

if (window.CSS_PATH) {
  console.log("Configuring CSS Preview");
  CMS.registerPreviewStyle(window.CSS_PATH);
  CMS.registerPreviewTemplate("episodios", EpisodesPreview);
  CMS.registerPreviewTemplate("videos", VideosPreview);
}

// Dirty but works
//const localDomains = ["localhost", "office"];
const localDomains = ["localhost"];

// When running locally, commit to the same repository
if (localDomains.includes(window.location.hostname)) {
  CMS.init({
    config: {
      backend: {
        name: "git-gateway",
      },
      local_backend: {
        allowed_hosts: localDomains,
      },
    },
  });
} else {
  // Otherwise, push to our github repo
  CMS.init({
    config: {
      backend: {
        name: "github",
        repo: "triceratops-show/www.triceratops.show",
        base_url: "https://api.triceratops.show",
        branch: "main",
      },
    },
  });
}

const MP3_PREFIX = "https://www.triceratops.show";

initPodcastBytes(CMS, MP3_PREFIX);
initPodcastDuration(CMS, MP3_PREFIX);
