import type { TscError } from "./types.ts";

/**
 * Regex to match TSC error lines
 * Pattern: filename(line,col): error ...
 * Examples:
 *   src/user.ts(15,22): error TS2339: Property 'name' does not exist...
 *   C:\project\src\file.ts(10,5): error TS7006: Parameter 'x' implicitly has...
 */
const ERROR_LINE_PATTERN = /^[^:]+\([^)]+\): error /;

/**
 * Regex to match complex object type definitions that should be truncated
 * Matches: '{ anything with semicolons; }'
 * Example: '{ fndByCategory: () => Promise<ResultItem[]>; }' -> '{ ... }'
 */
const COMPLEX_TYPE_PATTERN = /'\{ [^}]*; \}'/g;

/**
 * Parse a line of TSC output into a structured error object
 * @param line Raw line from tsc output
 * @returns TscError if line is an error, null otherwise
 */
export function parseLine(line: string): TscError | null {
  // Check if this line matches the error pattern
  if (!ERROR_LINE_PATTERN.test(line)) {
    return null;
  }

  // Find the position of "): " separator
  const separatorIndex = line.indexOf("): ");
  if (separatorIndex === -1) {
    return null;
  }

  // Extract location (everything up to and including ")")
  // AWK: location = substr($0, 1, paren_colon_pos)
  const location = line.substring(0, separatorIndex + 1);

  // Extract message (everything after "): error ")
  // Skip "): error " (9 chars) to get just "TS2339: ..."
  let message = line.substring(separatorIndex + 9);

  // Normalize complex type definitions
  message = message.replace(COMPLEX_TYPE_PATTERN, "'{ ... }'");

  return {
    location,
    message,
    raw: line,
  };
}

/**
 * Parse multiple lines of TSC output
 * @param lines Array of lines from tsc stdout
 * @returns Array of parsed errors (non-error lines are filtered out)
 */
export function parseLines(lines: string[]): TscError[] {
  return lines.map(parseLine).filter((e): e is TscError => e !== null);
}
