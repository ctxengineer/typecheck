import { expect, test, describe } from "bun:test";
import { formatTscOutput } from "../src/filter.ts";
import { tscOutputFixtures } from "./tsc-output.fixtures.ts";

describe("format tsc", () => {
  for (const { input, output } of tscOutputFixtures) {
    test(`${input.split("\n")[0]?.slice(0, 60) ?? ""}...`, () => {
      expect(formatTscOutput(input)).toBe(output);
    });
  }
});
