#!/usr/bin/env bash

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Converts a mp4 file into 2 m4a audio tracks"
  echo "Usage: [mp4 files]"
  exit 1
fi

for a in $@; do
  ffmpeg -hide_banner -n -threads 8 -i "$a" -vn -map 0:a:0? -c copy "${a%%.*} audio track 1.m4a" -map 0:a:1? -c copy "${a%%.*} audio track 2.m4a";
done
