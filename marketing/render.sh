#!/usr/bin/env bash
# Renders the listing images in marketing/out/ from marketing/src/boards.html.
# Needs: `npm run preview` running (for fresh shots in marketing/shots/) and Google Chrome.
set -e
cd "$(dirname "$0")"
C="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
P="$(mktemp -d)"
SRC="file:///$(cd src && pwd -W 2>/dev/null || pwd)/boards.html"
mkdir -p out
r() { "$C" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$P" --window-size="$2" \
  --virtual-time-budget=6000 --screenshot="$(pwd -W 2>/dev/null || pwd)/out/$1.png" "$SRC?b=$1" >/dev/null 2>&1; echo "out/$1.png"; }
r cover 2000,1084
r strip 1516,275
r features 1040,3900
r presets 2000,1180
r setup 1516,746
r icon 512,512
