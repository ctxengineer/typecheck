import { spawn } from "node:child_process";
import type { TscResult } from "./types.ts";

/**
 * Default arguments to pass to tsc for clean, parseable output
 */
const DEFAULT_TSC_ARGS = ["--noEmit", "--pretty", "false"];

/**
 * Run the TypeScript compiler and capture its output
 * @param args Additional arguments to pass to tsc (merged with defaults)
 * @param useTsgo Use tsgo (native TypeScript) instead of tsc
 * @returns TscResult with lines, exit code, and stderr
 */
export async function runTsc(
  args: string[] = [],
  useTsgo = false
): Promise<TscResult> {
  // Merge default args with user-provided args
  // User args come first so they can override defaults if needed
  const tscArgs = [...args, ...DEFAULT_TSC_ARGS];
  const cmd = useTsgo ? "tsgo" : "tsc";

  return new Promise((resolve, reject) => {
    const proc = spawn("npx", [cmd, ...tscArgs]);

    let stdout = "";
    let stderr = "";

    // Collect stdout data
    proc.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    // Collect stderr data
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    // Handle process exit
    proc.on("exit", (exitCode) => {
      // Split stdout into lines, filtering out empty trailing line
      const lines = stdout.split("\n").filter((line, index, arr) => {
        // Keep all lines except the last empty one (from trailing newline)
        return !(index === arr.length - 1 && line === "");
      });

      resolve({
        lines,
        exitCode: exitCode ?? 0,
        stderr,
      });
    });

    // Handle process errors (e.g., command not found)
    proc.on("error", (error) => {
      reject(error);
    });
  });
}
