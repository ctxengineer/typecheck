/**
 * Token-efficient compression of TypeScript error messages.
 * Transforms verbose TS errors into symbolic shorthand for AI agents.
 */

/**
 * Pattern to extract TS error code
 */
const TS_CODE_PATTERN = /^(TS\d+):/;
const QUOTED_TEXT_PATTERN = /(?<![A-Za-z])'[^']+'(?![A-Za-z])/g;

/**
 * Noise words to filter from quoted strings
 */
const NOISE_WORDS = new Set(["'any'", "'undefined'", "'null'", "'async'"]);

/**
 * Compress a TypeScript error message to symbolic shorthand.
 * Uses pattern-based detection rather than per-error-code rules.
 *
 * @param message The error message (e.g., "TS2339: Property 'name' does not exist...")
 * @returns Compressed form (e.g., "TS2339:'name'@'User'")
 */
export function compressMessage(message: string): string {
  const codeMatch = message.match(TS_CODE_PATTERN);
  if (!codeMatch) return message;

  const code = codeMatch[1]!;
  const body = message.slice(codeMatch[0]!.length).trim();

  // Extract all quoted strings once
  const quoted = message.match(QUOTED_TEXT_PATTERN);

  // Pattern: "Did you mean 'X'?" -> 'A'@'B'?'X'
  if (
    quoted?.length === 3 &&
    body.includes(" does not exist on type ") &&
    body.includes("Did you mean '")
  ) {
    return `${code}:${quoted[0]!}@${quoted[1]!}?${quoted[2]!}`;
  }

  // Pattern: "Cannot find name 'A'. Did you mean 'B'?" -> 'A'?'B'
  if (quoted?.length === 2 && body.includes("Did you mean '")) {
    return `${code}:${quoted[0]!}?${quoted[1]!}`;
  }

  // Pattern: "on type 'X'" -> 'A'@'X'
  if (quoted?.length === 2 && body.includes(" on type ")) {
    return `${code}:${quoted[0]!}@${quoted[1]!}`;
  }

  // Pattern: assignability or compatibility between two named types
  if (
    quoted?.length === 2 &&
    (body.includes(" is not assignable to ") ||
      body.includes(" has no properties in common with type "))
  ) {
    return `${code}:${quoted[0]!}~${quoted[1]!}`;
  }

  // Pattern: "Expected N argument(s), but got M" -> N!=M
  const argMatch = body.match(/Expected (\d+) arguments?, but got (\d+)/);
  if (argMatch) {
    return `${code}:${argMatch[1]!}!=${argMatch[2]!}`;
  }

  const firstClearQuoted = quoted?.find((q) => !NOISE_WORDS.has(q));
  if (
    firstClearQuoted &&
    (body.startsWith("Cannot find name ") ||
      body.startsWith("Cannot find module ") ||
      body.includes(" implicitly has an 'any' type") ||
      body.includes(" is possibly ") ||
      body.includes(" is used before being assigned"))
  ) {
    return `${code}:${firstClearQuoted}`;
  }

  return `${code}:${body}`;
}
