# Tricerátops Show

website for Tricerátops Show, brazilian alternative music podcast

[www.triceratops.show](https://www.triceratops.show)

based on the [Castanet](https://github.com/mattstratton/castanet) theme

## setup

requires: [go](https://go.dev/), [hugo](https://gohugo.io/), [node](https://nodejs.org/) (suggestion: use a version manager such as [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm))

## structure

- `auth` has the lambda for netlify cms authentication
- `checks` contains verifications and tests to run locally or in CI
- `scripts` contains miscellaneous helper scripts

## develop

everything you need should be in the `Makefile`

### live reload

```sh
make serve
```

will start hugo + netlify cms server

### styling

inspired by [every layout](https://every-layout.dev) and [cube css](https://cube.fyi/), also used css from [web.dev](https://github.com/GoogleChrome/web.dev/) as reference

### fontawesome icons

the fontawesome files in `static/fonts` are subsets containing only the icons that are actually used.

to include a new icon:
1. [search](https://fontawesome.com/icons) the corresponding unicode for the icon
2. add it to `scripts/fontawesome-subset.sh`
3. run the script to generate the new font files

### podcast specs

- [Spotify Podcast Delivery Specification](https://content-ops.atspotify.com/hc/en-us/sections/360010813671-Spotify-Podcast-Documentation-)
- [Apple Podcast RSS feed requirements](https://podcasters.apple.com/support/823-podcast-requirements)
- [RSS feed guidelines for Google Podcasts](https://support.google.com/podcast-publishers/answer/9889544?hl=en)
