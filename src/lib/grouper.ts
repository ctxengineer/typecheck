import type { TscError, ErrorGroup } from "./types.ts";

/**
 * Groups TSC errors by their message string.
 * Maintains insertion order for consistent output.
 */
export class ErrorGrouper {
  private groups = new Map<string, ErrorGroup>();
  private order: string[] = [];

  /**
   * Add an error to the grouper
   * @param error Parsed TSC error
   */
  addError(error: TscError): void {
    const existing = this.groups.get(error.message);

    if (existing) {
      // Increment count for existing group
      existing.count++;
    } else {
      // Create new group with this error
      const group: ErrorGroup = {
        message: error.message,
        count: 1,
        exampleLocation: error.location,
      };
      this.groups.set(error.message, group);
      this.order.push(error.message);
    }
  }

  /**
   * Get all error groups in order of first appearance
   * @returns Array of ErrorGroup objects
   */
  getGroups(): ErrorGroup[] {
    return this.order.map((message) => this.groups.get(message)!);
  }

  /**
   * Reset the grouper state
   */
  clear(): void {
    this.groups.clear();
    this.order = [];
  }
}

/**
 * Group an array of errors by message
 * Convenience function that creates a grouper, adds all errors, and returns groups
 * @param errors Array of parsed TSC errors
 * @returns Array of ErrorGroup objects in order of first appearance
 */
export function groupErrors(errors: TscError[]): ErrorGroup[] {
  const grouper = new ErrorGrouper();
  for (const error of errors) {
    grouper.addError(error);
  }
  return grouper.getGroups();
}
