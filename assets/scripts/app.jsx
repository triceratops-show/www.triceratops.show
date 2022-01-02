import CMS from "netlify-cms-app";

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
