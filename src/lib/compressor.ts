/**
 * Token-efficient compression of TypeScript error messages.
 * Transforms verbose TS errors into symbolic shorthand for AI agents.
 */

/**
 * Pattern to extract TS error code
 */
const TS_CODE_PATTERN = /^(TS\d+):/;

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
  const quoted = message.match(/'[^']+'/g);

  // Pattern: "Did you mean 'X'?" -> 'A'@'B'?'X'
  if (quoted?.length === 3 && body.includes("Did you mean")) {
    return `${code}:${quoted[0]!}@${quoted[1]!}?${quoted[2]!}`;
  }

  // Pattern: "on type 'X'" -> 'A'@'X'
  if (quoted?.length === 2 && body.includes(" on type ")) {
    return `${code}:${quoted[0]!}@${quoted[1]!}`;
  }

  // Pattern: "Expected N argument(s), but got M" -> N!=M
  const argMatch = body.match(/Expected (\d+) arguments?, but got (\d+)/);
  if (argMatch) {
    return `${code}:${argMatch[1]!}!=${argMatch[2]!}`;
  }

  // Default: filter noise and join with ~
  if (quoted) {
    const filtered = quoted.filter((q) => !NOISE_WORDS.has(q));
    if (filtered.length) {
      return `${code}:${filtered.join('~')}`;
    }
  }

  return code;
}
