import CMS from "netlify-cms-app";
import React from "react";

// TODO keep this in sync with layouts/partials/episode.html
class EpisodesPreview extends React.Component {
  render() {
    const { entry, widgetFor } = this.props;

    return (
      <div class="container">
        <div class="row hero_container middle_container">
          <div class="col-md-12">
            <div class="row title">
              <div class="col">
                <h1>
                  <a href="#">
                    <h1>
                      #{entry.getIn(["data", "episode"])}{" "}
                      {entry.getIn(["data", "title"])}
                    </h1>
                  </a>
                </h1>
              </div>
            </div>
            <div class="row description-content">
              <div class="col">
                <div style={{ "margin-bottom": "12px" }}>
                  <h2>cabeça</h2>
                  {entry.getIn(["data", "description"])}
                </div>
                <div>{widgetFor("body")}</div>
              </div>
            </div>

            <div class="row youtube_row">
              <div class="col">
                <h2>Escute no youtube:</h2>
                <div class="embed-responsive embed-responsive-1by1">
                  <iframe
                    class="embed-responsive-item"
                    src={`//www.youtube.com/embed/${entry.getIn([
                      "data",
                      "youtube",
                    ])}`}
                    allowFullScreen=""
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

if (window.CSS_PATH) {
  console.log("Configuring CSS Preview");
  CMS.registerPreviewStyle(window.CSS_PATH);
  CMS.registerPreviewTemplate("episodios", EpisodesPreview);
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
        base_url: "https://auth.triceratops.show",
        branch: "main",
      },
    },
  });
}
