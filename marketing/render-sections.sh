#!/usr/bin/env bash
# Renders marketing/out/s-<id>.png from marketing/src/sections.html. Needs `npm run preview` running on :5173.
set -e
cd "$(dirname "$0")/.."
cp marketing/src/sections.html .preview/sections.html
mkdir -p .preview/shots && cp marketing/shots/*.png .preview/shots/
C="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"; P="$(mktemp -d)"
OUT="$(cd marketing/out && pwd -W 2>/dev/null || pwd)"
for s in ${@:-product sidebar login quantity setup ranks sales pages}; do
  "$C" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$P" --window-size=2000,1386 --virtual-time-budget=8000 \
    --screenshot="$OUT/s-$s.png" "http://localhost:5173/sections.html?s=$s" >/dev/null 2>&1
  echo "marketing/out/s-$s.png"
done
