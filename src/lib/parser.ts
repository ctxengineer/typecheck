import type { TscError } from "./types.ts";

/**
 * Regex to match TSC error lines
 * Pattern: filename(line,col): error ...
 * Examples:
 *   src/user.ts(15,22): error TS2339: Property 'name' does not exist...
 *   C:\project\src\file.ts(10,5): error TS7006: Parameter 'x' implicitly has...
 *   error TS18003: No inputs were found in config file...
 */
const ERROR_WITH_LOCATION_PATTERN = /^(.+\([^)]+\)): error (TS\d+: .*)$/;
const ERROR_WITHOUT_LOCATION_PATTERN = /^error (TS\d+: .*)$/;

/**
 * Parse a line of TSC output into a structured error object
 * @param line Raw line from tsc output
 * @returns TscError if line is an error, null otherwise
 */
export function parseLine(line: string): TscError | null {
  const locationMatch = line.match(ERROR_WITH_LOCATION_PATTERN);
  if (locationMatch) {
    return {
      location: locationMatch[1]!,
      message: locationMatch[2]!,
      raw: line,
    };
  }

  const noLocationMatch = line.match(ERROR_WITHOUT_LOCATION_PATTERN);
  if (noLocationMatch) {
    return {
      message: noLocationMatch[1]!,
      raw: line,
    };
  }

  return null;
}
