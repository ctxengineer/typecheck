# Changelog

All notable changes to `@ctxlyr/typecheck` are documented here.

## 0.2.0 - 2026-07-01

### Changed

- Switched CLI output to plain line-oriented diagnostics instead of wrapper
  summary blocks, making output easier for agents and shell tools to consume.
- Removed diagnostic truncation so long property names, type names, and object
  types remain visible in compressed output.
- Preserved full fallback diagnostic messages when a TypeScript error cannot be
  safely compressed into symbolic shorthand.
- Changed the CLI wrapper to run the local project `tsc`, pass through compiler
  arguments, and append `--noEmit --pretty false`.
- Updated package metadata to point at `https://github.com/ctxengineer/typecheck`.

### Added

- Added `--exit-zero` for workflows that need compressed diagnostics without a
  failing shell exit.
- Added support for no-location TypeScript diagnostics such as `TS18003`.
- Added support coverage for Windows-style diagnostic paths.
- Added TypeScript 6.0 diagnostic corpus coverage and an audit script for
  compression behavior.

### Fixed

- Resolved package-manager symlink execution so the CLI can find its bundled
  filter when invoked through `bunx` or package shims.
- Reported missing `tsc` with a clear CLI error.

## 0.1.254 - 2026-06-05

### Changed

- Published the current CLI package baseline for `@ctxlyr/typecheck`.
- Resolved the typecheck wrapper through symlinks so the bundled filter can be
  found when invoked from package-manager shims.
