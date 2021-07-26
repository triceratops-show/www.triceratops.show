#!/usr/bin/env bash

set -euo pipefail

if [ $# -lt 3 ]; then
  echo "Converts a mp3 file to a flv"
  echo "Usage: [cover] [input] [output]"
  exit 1
fi

ffmpeg -r 1 -loop 1 -i "$1" -i "$2" -acodec copy -r 1 -shortest -vf scale=1280:1280 "$3"

