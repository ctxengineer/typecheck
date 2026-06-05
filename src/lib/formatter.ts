import type { TscError } from "./types.ts";
import { compressMessage } from "./compressor.ts";
import { PREFIX_CLOSE, PREFIX_SELF_CLOSE } from "./constant.ts";

/**
 * Format a single error for immediate output
 */
export function formatError(error: TscError): string {
  return `${error.location}:${compressMessage(error.message)}`;
}

/**
 * Format summary footer
 */
export function formatSummary(
  hasErrors: boolean,
  errorCount?: number,
  fileCount?: number
): string {
  if (!hasErrors) {
    return `${PREFIX_SELF_CLOSE} ✓ typecheck`;
  }

  if (errorCount === undefined || fileCount === undefined) {
    return `${PREFIX_CLOSE} ✗ typecheck`;
  }

  const errorWord = errorCount === 1 ? "error" : "errors";
  const fileWord = fileCount === 1 ? "file" : "files";
  return `${PREFIX_CLOSE} ✗ typecheck: ${errorCount} ${errorWord}, ${fileCount} ${fileWord}`;
}
