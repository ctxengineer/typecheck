/**
 * Represents a parsed TypeScript compiler error
 */
export interface TscError {
  /** File location, e.g., "src/user.ts(15,22)" */
  location: string;
  /** Error message, e.g., "error TS2339: Property 'name' does not exist..." */
  message: string;
  /** Original raw line from tsc output */
  raw: string;
}

/**
 * Represents a group of identical errors
 */
export interface ErrorGroup {
  /** The normalized error message (used as grouping key) */
  message: string;
  /** Number of occurrences of this error */
  count: number;
  /** Example file location (first occurrence) */
  exampleLocation: string;
}

/**
 * Result from running the tsc process
 */
export interface TscResult {
  /** All stdout lines from tsc */
  lines: string[];
  /** Process exit code */
  exitCode: number;
  /** Any stderr output */
  stderr: string;
}
