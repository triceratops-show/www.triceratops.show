#!/usr/bin/env bash

set -euo pipefail

# prerequisites:
# npm install -g glyphhanger
# pip install fonttools brotli zopfli

# regular
# home, podcast, rss
glyphhanger --formats=ttf,woff2 \
    --subset=node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf \
    --whitelist=U+f015,U+f2ce,U+f09e

mv node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400-subset.* \
    static/fonts

mv static/fonts/fa-regular-400-subset.ttf static/fonts/fa-regular-400.ttf
mv static/fonts/fa-regular-400-subset.woff2 static/fonts/fa-regular-400.woff2

# solid
# home, podcast, rss
glyphhanger --formats=ttf,woff2 \
    --subset=node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf \
    --whitelist=U+f015,U+f2ce,U+f09e

mv node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900-subset.* \
    static/fonts

mv static/fonts/fa-solid-900-subset.ttf static/fonts/fa-solid-900.ttf
mv static/fonts/fa-solid-900-subset.woff2 static/fonts/fa-solid-900.woff2

# brands
# android, facebook-square, github-square, google-play, instagram, linkedin
# pinterest-square, soundcloud, spotify, twitch, twitter-square, youtube-square
glyphhanger --formats=ttf,woff2 \
    --subset=node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf \
    --whitelist=U+f17b,U+f082,U+f092,U+f3ab,U+f16d,U+f08c,U+f0d3,U+f1be,U+f1bc,U+f1e8,U+f081,U+f431

mv node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400-subset.* \
    static/fonts

mv static/fonts/fa-brands-400-subset.ttf static/fonts/fa-brands-400.ttf
mv static/fonts/fa-brands-400-subset.woff2 static/fonts/fa-brands-400.woff2
