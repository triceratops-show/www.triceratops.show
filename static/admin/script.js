const { CMS, initCMS: init } = window;

// Dirty but works
//const localDomains = ["localhost", "office"];
const localDomains = ["localhost"];

// When running locally, commit to the same repository
if (localDomains.includes(window.location.hostname)) {
  init({
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
  init({
    config: {
      publish_mode: "editorial_workflow",
      backend: {
        name: "github",
        repo: "triceratops-show/www.triceratops.show",
        base_url: "https://auth.triceratops.show",
      },
    },
  });
}
