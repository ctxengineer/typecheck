import type { TscError } from "./types.ts";
import { compressMessage } from "./compressor.ts";

/**
 * Format a single error for immediate output
 */
export function formatError(error: TscError): string {
  return `${error.location}:${compressMessage(error.message)}`;
}
