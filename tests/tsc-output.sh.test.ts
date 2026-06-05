import { expect, test, describe } from "bun:test";
import { parseLine } from "../src/lib/parser.ts";
import { formatError, formatSummary } from "../src/lib/formatter.ts";
import { PREFIX_OPEN } from "../src/lib/constant.ts";
import { tscOutputFixtures } from "./tsc-output.fixtures.ts";

const SUMMARY_MULTI_FILES = /^Found (\d+) errors? in (\d+) files?\.$/;
const SUMMARY_SAME_FILE = /^Found (\d+) errors? in the same file/;

function formatTscOutput(log: string): string {
  const lines = log.split("\n");
  const outputLines: string[] = [];
  let hasErrors = false;
  let errorCount: number | undefined;
  let fileCount: number | undefined;

  for (const line of lines) {
    const error = parseLine(line);
    if (error) {
      if (!hasErrors) {
        outputLines.push(PREFIX_OPEN);
        hasErrors = true;
      }
      outputLines.push(formatError(error));
      continue;
    }

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

  outputLines.push(formatSummary(hasErrors, errorCount, fileCount));
  return outputLines.join("\n");
}

describe("format tsc", () => {
  for (const { input, output } of tscOutputFixtures) {
    test(`${input.split("\n")[0]?.slice(0, 60) ?? ""}...`, () => {
      expect(formatTscOutput(input)).toBe(output);
    });
  }
});
