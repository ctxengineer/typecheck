#!/usr/bin/env bun

import { parseLines } from "./lib/parser.ts";
import { groupErrors } from "./lib/grouper.ts";
import { formatGroups } from "./lib/formatter.ts";
import { runTsc } from "./lib/tsc-runner.ts";

const HELP_TEXT = `
typecheck - Token-efficient TypeScript error output for AI agents

Usage: typecheck [tsc-args...]

Options:
  --help    Show this help message

All other arguments are passed directly to tsgo.

Examples:
  typecheck                          Run tsgo with default settings
  typecheck --project tsconfig.json  Use specific tsconfig
  typecheck src/index.ts             Check specific file

Output format:
  Errors are grouped by message to reduce token usage.
  Each group shows occurrence count and an example location.
`.trim();

async function main(): Promise<number> {
  const args = process.argv.slice(2);

  // Handle --help flag
  if (args.includes("--help")) {
    console.log(HELP_TEXT);
    return 0;
  }

  // Run tsgo with provided arguments
  const result = await runTsc(args);

  // Output any stderr (tsc warnings, config errors, etc.)
  if (result.stderr) {
    console.error(result.stderr);
  }

  // Parse error lines and group by message
  const errors = parseLines(result.lines);
  const groups = groupErrors(errors);

  // Format and output (shows <typecheck:passing /> if no errors)
  const output = formatGroups(groups);
  console.log(output);

  return result.exitCode;
}

// Run main and exit with appropriate code
main().then((exitCode) => {
  process.exit(exitCode);
});
