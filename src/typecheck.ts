#!/usr/bin/env node

import { parseLine } from "./lib/parser.ts";
import { formatError } from "./lib/formatter.ts";
import { runTscStream } from "./lib/tsc-runner.ts";

const HELP_TEXT = `
typecheck - Token-efficient TypeScript error output for AI agents

Usage: typecheck [--tsgo] [tsc-args...]

Options:
  --tsgo    Use tsgo instead of tsc
  --help    Show this help message

All other arguments are passed directly to tsc (or tsgo with --tsgo).
By default, uses --project <current-directory> if not specified.

Examples:
  typecheck                          Run tsc with default settings (uses cwd)
  typecheck --tsgo                   Use tsgo instead of tsc
  typecheck --project tsconfig.json  Use specific tsconfig
  typecheck src/index.ts             Check specific file
  typecheck -p ./lib                 Use tsconfig from ./lib directory

Output format:
  Each error is shown with location and compressed message.
`.trim();

async function main(): Promise<number> {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    console.log(HELP_TEXT);
    return 0;
  }

  const useTsgo = args.includes("--tsgo");
  const tscArgs = useTsgo ? args.filter((arg) => arg !== "--tsgo") : args;

  const result = runTscStream(tscArgs, useTsgo);
  let emittedDiagnostics = false;

  try {
    for await (const line of result.lines) {
      const error = parseLine(line);
      if (error) {
        emittedDiagnostics = true;
        console.log(formatError(error));
      }
    }
  } catch {
    // Ignore stream errors
    return 1;
  }

  // Handle stderr (only show lines containing "error")
  const stderrText = await new Response(result.stderr).text();
  const filteredStderr = stderrText
    .split("\n")
    .filter((line) => /error/i.test(line))
    .join("\n")
    .trim();
  if (filteredStderr) {
    emittedDiagnostics = true;
    console.error(filteredStderr);
  }

  if (!emittedDiagnostics) {
    console.log();
  }

  await result.exitCode;
  return 0;
}

main().then((exitCode) => {
  process.exit(exitCode);
});
