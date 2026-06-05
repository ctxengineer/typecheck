import { expect, test, describe } from "bun:test";
import { compressMessage } from "../src/lib/compressor.ts";
import { compressorFixtures } from "./compressor.fixtures.ts";

describe("Compress Error", () => {
  for (const { input, output } of compressorFixtures) {
    test(`${input} -> ${output}`, () => {
      expect(compressMessage(input)).toBe(output);
    });
  }
});
