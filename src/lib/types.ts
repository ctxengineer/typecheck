/**
 * Represents a parsed TypeScript compiler error
 */
export interface TscError {
  /** File location, e.g., "src/user.ts(15,22)" */
  location?: string;
  /** Error message, e.g., "TS2339: Property 'name' does not exist..." */
  message: string;
  /** Original raw line from tsc output */
  raw: string;
}
