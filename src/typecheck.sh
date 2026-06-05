#!/usr/bin/env bash
set -u

HELP_TEXT='typecheck - Token-efficient TypeScript error output for AI agents

Usage: typecheck [options] [tsc-args...]

Options:
  --exit-zero  Print compressed diagnostics but exit 0 even when tsc fails
  --help       Show this help message

All other arguments are passed directly to tsc.
The wrapper appends --noEmit --pretty false for clean, parseable output.
It resolves tsc from the nearest node_modules/.bin/tsc on or above the current
directory, then falls back to PATH.'

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
filter_path="$script_dir/filter.js"
filter_cmd=(node "$filter_path")

if [[ ! -f "$filter_path" ]]; then
  filter_path="$script_dir/filter.ts"
  if ! command -v bun >/dev/null 2>&1; then
    echo "typecheck: filter.js is missing; run bun run build" >&2
    exit 1
  fi
  filter_cmd=(bun "$filter_path")
fi

exit_zero=0
tsc_args=()

for arg in "$@"; do
  case "$arg" in
    --help)
      printf '%s\n' "$HELP_TEXT"
      exit 0
      ;;
    --exit-zero)
      exit_zero=1
      ;;
    *)
      tsc_args+=("$arg")
      ;;
  esac
done

search_dir="$PWD"
while [[ "$search_dir" != "/" ]]; do
  if [[ -x "$search_dir/node_modules/.bin/tsc" ]]; then
    export PATH="$search_dir/node_modules/.bin:$PATH"
    break
  fi
  search_dir="$(dirname "$search_dir")"
done

if ! command -v tsc >/dev/null 2>&1; then
  echo "typecheck: tsc not found. Install typescript or add tsc to PATH." >&2
  exit 127
fi

if [[ "${#tsc_args[@]}" -gt 0 ]]; then
  tsc "${tsc_args[@]}" --noEmit --pretty false 2>&1 | "${filter_cmd[@]}"
  pipeline_status=("${PIPESTATUS[@]}")
else
  tsc --noEmit --pretty false 2>&1 | "${filter_cmd[@]}"
  pipeline_status=("${PIPESTATUS[@]}")
fi
tsc_status="${pipeline_status[0]}"
filter_status="${pipeline_status[1]}"

if [[ "$filter_status" -ne 0 ]]; then
  exit "$filter_status"
fi

if [[ "$exit_zero" -eq 1 ]]; then
  exit 0
fi

exit "$tsc_status"
