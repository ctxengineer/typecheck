import { expect, test, describe } from "bun:test";
import { parseLines } from "../src/lib/parser.ts";
import { groupErrors } from "../src/lib/grouper.ts";
import { formatGroups } from "../src/lib/formatter.ts";

/**
 * Helper to run the full TypeScript pipeline
 */
function formatTscOutput(log: string): string {
  const lines = log.split("\n");
  const errors = parseLines(lines);
  const groups = groupErrors(errors);
  return formatGroups(groups);
}

describe("format tsc", () => {
  test("property does not exist", () => {
    const log = `src/user.ts(15,22): error TS2339: Property 'name' does not exist on type 'User'.
src/user.ts(16,28): error TS2339: Property 'name' does not exist on type 'User'.
src/profile.ts(8,15): error TS2339: Property 'age' does not exist on type 'User'.`;

    const expected = `<typecheck:summary>
  - TS2339: Property 'name' does not exist on type 'User'.
  - TS2339: Property 'age' does not exist on type 'User'.
</typecheck:summary>`;

    const actual = formatTscOutput(log);
    expect(actual).toBe(expected);
  });

  test("truncate type '{ ... }'", () => {
    const log = `src/grid.tsx(8,37): error TS2551: Property 'findByCategory' does not exist on type '{ fndByCategory: () => Promise<ResultItem[]>; }'. Did you mean 'fndByCategory'?
src/grid.tsx(9,35): error TS7006: Parameter 'car' implicitly has an 'any' type.
src/grid.tsx(10,41): error TS7006: Parameter 'car' implicitly has an 'any' type.
src/grid.tsx(11,32): error TS7006: Parameter 'car' implicitly has an 'any' type.`;

    const expected = `<typecheck:summary>
  - TS2551: Property 'findByCategory' does not exist on type '{ ... }'. Did you mean 'fndByCategory'?
  - TS7006: Parameter 'car' implicitly has an 'any' type.
</typecheck:summary>`;

    const actual = formatTscOutput(log);
    expect(actual).toBe(expected);
  });
});
