#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"

rm -rf "$root_dir/bin"
mkdir -p "$root_dir/bin"

bun build "$root_dir/src/filter.ts" --outfile "$root_dir/bin/filter.js" --target node
cp "$root_dir/src/typecheck.sh" "$root_dir/bin/typecheck"
chmod +x "$root_dir/bin/typecheck"
