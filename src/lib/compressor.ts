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
 * Maximum length for quoted string content (excluding quotes)
 */
const MAX_QUOTED_LENGTH = 30;

/**
 * Truncate a quoted string if content exceeds MAX_QUOTED_LENGTH.
 * @param quoted The quoted string (e.g., "'SomeLongTypeName'")
 * @returns Truncated form with ellipsis if needed (e.g., "'SomeLongTypeNa...'")
 */
function truncateQuoted(quoted: string): string {
  const content = quoted.slice(1, -1);
  if (content.length <= MAX_QUOTED_LENGTH) {
    return quoted;
  }
  return `'${content.slice(0, MAX_QUOTED_LENGTH)}...'`;
}

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
    return `${code}:${truncateQuoted(quoted[0]!)}@${truncateQuoted(quoted[1]!)}?${truncateQuoted(quoted[2]!)}`;
  }

  // Pattern: "on type 'X'" -> 'A'@'X'
  if (quoted?.length === 2 && body.includes(" on type ")) {
    return `${code}:${truncateQuoted(quoted[0]!)}@${truncateQuoted(quoted[1]!)}`;
  }

  // Pattern: "Expected N argument(s), but got M" -> N!=M
  const argMatch = body.match(/Expected (\d+) arguments?, but got (\d+)/);
  if (argMatch) {
    return `${code}:${argMatch[1]!}!=${argMatch[2]!}`;
  }

  // Default: filter noise, truncate, join with ~
  if (quoted) {
    const filtered = quoted.filter((q) => !NOISE_WORDS.has(q)).map(truncateQuoted);
    if (filtered.length) {
      return `${code}:${filtered.join('~')}`;
    }
  }

  return code;
}
