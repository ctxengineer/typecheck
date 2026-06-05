import { expect, test, describe } from "bun:test";
import { parseLine } from "../src/lib/parser.ts";
import { formatError } from "../src/lib/formatter.ts";
import { tscOutputFixtures } from "./tsc-output.fixtures.ts";

function formatTscOutput(log: string): string {
  const lines = log.split("\n");
  const outputLines: string[] = [];

  for (const line of lines) {
    const error = parseLine(line);
    if (error) {
      outputLines.push(formatError(error));
    }
  }

  return outputLines.length > 0 ? outputLines.join("\n") : "\n";
}

describe("format tsc", () => {
  for (const { input, output } of tscOutputFixtures) {
    test(`${input.split("\n")[0]?.slice(0, 60) ?? ""}...`, () => {
      expect(formatTscOutput(input)).toBe(output);
    });
  }
});
