import { expect, test, describe } from "bun:test";
import { parseLines } from "../src/lib/parser.ts";
import { groupErrors } from "../src/lib/grouper.ts";
import { formatGroups } from "../src/lib/formatter.ts";
import { tscOutputFixtures } from "./tsc-output.fixtures.ts";

function formatTscOutput(log: string): string {
  const lines = log.split("\n");
  const errors = parseLines(lines);
  const groups = groupErrors(errors);
  return formatGroups(groups);
}

describe("format tsc", () => {
  for (const { input, output } of tscOutputFixtures) {
    test(`${input.split("\n")[0]?.slice(0, 60) ?? ""}...`, () => {
      expect(formatTscOutput(input)).toBe(output);
    });
  }
});
