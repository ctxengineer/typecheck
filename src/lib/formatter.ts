import type { ErrorGroup } from "./types.ts";
import { compressMessage } from "./compressor.ts";

/**
 * Format all error groups for console output
 * One line per unique error message, compressed to symbolic shorthand
 * @param groups Array of error groups to format
 * @returns Formatted string ready for console output
 */
export function formatGroups(groups: ErrorGroup[]): string {
  if (groups.length === 0) {
    return "<typecheck:passing />";
  }

  const items = groups
    .map((group) => {
      const compressed = compressMessage(group.message);
      const countSuffix = group.count > 1 ? ` (x${group.count})` : "";
      return `  - ${compressed}${countSuffix}`;
    })
    .join("\n");
  return `<typecheck:summary>\n${items}\n</typecheck:summary>`;
}
