#!/usr/bin/env node

import { parseLine } from "./lib/parser.ts";
import { formatError, formatSummary } from "./lib/formatter.ts";
import { runTscStream } from "./lib/tsc-runner.ts";
import { PREFIX_OPEN } from "./lib/constant.ts";

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

const SUMMARY_MULTI_FILES = /^Found (\d+) errors? in (\d+) files?\.$/;
const SUMMARY_SAME_FILE = /^Found (\d+) errors? in the same file/;

async function main(): Promise<number> {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    console.log(HELP_TEXT);
    return 0;
  }

  const useTsgo = args.includes("--tsgo");
  const tscArgs = useTsgo ? args.filter((arg) => arg !== "--tsgo") : args;

  const result = runTscStream(tscArgs, useTsgo);
  let hasErrors = false;
  let errorCount: number | undefined;
  let fileCount: number | undefined;

  try {
    for await (const line of result.lines) {
      const error = parseLine(line);
      if (error) {
        if (!hasErrors) {
          console.log(PREFIX_OPEN);
          hasErrors = true;
        }
        console.log(formatError(error));
        continue;
      }

      // Check for summary line
      const multiMatch = line.match(SUMMARY_MULTI_FILES);
      if (multiMatch) {
        errorCount = parseInt(multiMatch[1]!, 10);
        fileCount = parseInt(multiMatch[2]!, 10);
        continue;
      }

      const sameMatch = line.match(SUMMARY_SAME_FILE);
      if (sameMatch) {
        errorCount = parseInt(sameMatch[1]!, 10);
        fileCount = 1;
      }
    }
  } catch {
    // Ignore stream errors
    return 1
  }

  // Handle stderr (only show lines containing "error")
  const stderrText = await new Response(result.stderr).text();
  const filteredStderr = stderrText
    .split("\n")
    .filter((line) => /error/i.test(line))
    .join("\n")
    .trim();
  if (filteredStderr) {
    console.error(filteredStderr);
  }

  console.log(formatSummary(hasErrors, errorCount, fileCount));

  return await result.exitCode;
}

main().then((exitCode) => {
  process.exit(exitCode);
});
