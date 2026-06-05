import type { ErrorGroup } from "./types.ts";

/**
 * Format all error groups for console output
 * One line per unique error message
 * @param groups Array of error groups to format
 * @returns Formatted string ready for console output
 */
export function formatGroups(groups: ErrorGroup[]): string {
  if (groups.length === 0) {
    return "<typecheck:passing />";
  }

  const items = groups.map((group) => `  - ${group.message}`).join("\n");
  return `<typecheck:summary>\n${items}\n</typecheck:summary>`;
}
