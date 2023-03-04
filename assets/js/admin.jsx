import CMS from "@staticcms/core";
import React from "react";

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
        <p>{entry.getIn(["data", "description"])}</p>

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

if (window.CSS_PATH) {
  console.log("Configuring CSS Preview");
  CMS.registerPreviewStyle(window.CSS_PATH);
  CMS.registerPreviewTemplate("episodios", EpisodesPreview);
}

// Dirty but works
//const localDomains = ["localhost", "office"];
const localDomains = ["localhost"];

const configs = {
  display_url: "https://www.triceratops.show",
  logo_url: "https://www.triceratops.show/img/logo-400px.png",
  public_folder: "/episodios",
  media_folder: "static/episodios",
  locale: "pt",
  collections: [
    {
      name: "episodios",
      label: "Episódios",
      label_singular: "Episódio",
      summary: "#{{episode}} {{title}}",
      folder: "content/episodios",
      slug: "{{episode}}",
      create: true,
      delete: false,
      sortable_fields: {
        fields: ["episode", "publishDate"],
      },
      fields: [
        {
          label: "Episódio",
          hint: "número do episódio",
          name: "episode",
          widget: "number",
          required: false,
        },
        {
          label: "Título",
          name: "title",
          widget: "string",
          required: false,
        },
        {
          label: "Capa",
          name: "image",
          widget: "image",
          required: false,
        },
        {
          label: "Descrição",
          name: "description",
          widget: "text",
          required: false,
        },
        {
          label: "Artistas tocados",
          hint: "separados por vírgula",
          name: "artistas",
          widget: "list",
          required: false,
          fields: [
            {
              name: "artistas",
              label: "Artistas",
              widget: "string",
              default: "",
            },
          ],
        },
        {
          label: "Participações",
          hint: "separadas por vírgula",
          name: "participacoes",
          widget: "list",
          required: false,
          fields: [
            {
              name: "Participações",
              label: "Participações",
              widget: "string",
              default: "",
            },
          ],
        },
        {
          label: "Arquivo",
          name: "podcast_file",
          widget: "string",
          required: false,
        },
        {
          label: "Duração",
          hint: "no formato hh:mm:ss",
          name: "podcast_duration",
          widget: "string",
          required: false,
        },
        {
          label: "Tamanho",
          hint: "em bytes",
          name: "podcast_bytes",
          widget: "string",
          required: false,
        },
        {
          label: "YouTube",
          name: "youtube",
          widget: "string",
          required: false,
        },
        {
          label: "Publicado",
          name: "published",
          widget: "boolean",
          default: false,
        },
        {
          label: "Data de publicação",
          name: "publishDate",
          widget: "datetime",
          required: false,
        },
        {
          label: "Corpo",
          name: "body",
          widget: "markdown",
          required: false,
          default:
            "## tocamos\n* {banda} - {música}\n\n## participaram\n* {alguém que mandou um alô}\n\n## recomendamos\n* {algum filme} (*tradução*) (ano), filme massa de fulano\n\n## mencionados\n* {algum namedropping}\n\n## escusas\n* {alguma merda que falamos}\n\n## otras cositas más\n* [playlists com as músicas do podcast](https://www.triceratops.show/playlists/)\n* [instagram](https://www.instagram.com/triceratops.show/)\n* [twitter](https://twitter.com/TriceratopsShow/)\n* nosso email de contato é `contato@triceratops.show`\n",
        },
      ],
    },
    {
      name: "participacoes",
      label: "Participações",
      label_singular: "Participação",
      folder: "content/participacoes",
      nested: {
        depth: 2,
      },
      meta: {
        path: {
          label: "Path",
          hint: "nome da pasta/arquivo, mantenha acentos, ex.: laís-marinoni",
          widget: "string",
          index_file: "_index",
        },
      },
      create: true,
      delete: false,
      editor: {
        preview: false,
      },
      fields: [
        {
          label: "Nome",
          name: "title",
          widget: "string",
          required: false,
        },
        {
          label: "Tagline",
          hint: 'ex.: "melhor jogador de snooker de todos os tempos"',
          name: "tagline",
          widget: "string",
          required: false,
        },
        {
          label: "Corpo",
          name: "body",
          widget: "markdown",
          required: false,
        },
      ],
    },
    {
      name: "artistas",
      label: "Artistas",
      label_singular: "Artista",
      folder: "content/artistas",
      nested: {
        depth: 2,
      },
      meta: {
        path: {
          label: "Path",
          hint: "nome da pasta/arquivo, mantenha acentos, ex.: polímeros-semicondutores",
          widget: "string",
          index_file: "_index",
        },
      },
      create: true,
      delete: false,
      editor: {
        preview: false,
      },
      fields: [
        {
          label: "Nome",
          name: "title",
          widget: "string",
          required: false,
        },
        {
          label: "Corpo",
          name: "body",
          widget: "markdown",
          required: false,
        },
      ],
    },
    {
      name: "about",
      label: "Sobre",
      create: true,
      delete: false,
      editor: {
        preview: false,
      },
      files: [
        {
          name: "about-index",
          label: "Sobre",
          file: "content/sobre/_index.md",
          fields: [
            {
              label: "Título",
              name: "title",
              widget: "string",
              required: false,
            },
            {
              label: "Descrição",
              name: "description",
              widget: "string",
              required: false,
            },
            {
              label: "Corpo",
              name: "body",
              widget: "markdown",
              required: false,
            },
          ],
        },
      ],
    },
  ],
};

// When running locally, commit to the same repository
if (localDomains.includes(window.location.hostname)) {
  CMS.init({
    config: {
      ...configs,
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
      ...configs,
      backend: {
        name: "github",
        repo: "triceratops-show/www.triceratops.show",
        base_url: "https://auth.triceratops.show",
        branch: "main",
      },
    },
  });
}
