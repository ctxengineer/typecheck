import { expect, test, describe } from "bun:test";
import { truncateType } from "../src/lib/truncate.ts";
import { truncateFixtures } from "./truncate.fixtures.ts";

describe("Truncate Type", () => {
  for (const { input, output } of truncateFixtures) {
    test(`${input} -> ${output}`, () => {
      expect(truncateType(input)).toBe(output);
    });
  }
});
