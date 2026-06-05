import type { TscResult } from "./types.ts";

/**
 * Default arguments to pass to tsgo for clean, parseable output
 */
const DEFAULT_TSC_ARGS = ["--noEmit", "--pretty", "false"];

/**
 * Run the TypeScript compiler (tsgo) and capture its output
 * @param args Additional arguments to pass to tsgo (merged with defaults)
 * @returns TscResult with lines, exit code, and stderr
 */
export async function runTsc(args: string[] = []): Promise<TscResult> {
  // Merge default args with user-provided args
  // User args come first so they can override defaults if needed
  const tscArgs = [...args, ...DEFAULT_TSC_ARGS];

  const proc = Bun.spawn(
    ["bunx", "--silent","--bun",  "@typescript/native-preview", "tsgo", ...tscArgs],
    {
      stdout: "pipe",
      stderr: "pipe",
    }
  );

  // Read stdout and stderr
  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();

  // Wait for process to exit
  const exitCode = await proc.exited;

  // Split stdout into lines, filtering out empty trailing line
  const lines = stdout.split("\n").filter((line, index, arr) => {
    // Keep all lines except the last empty one (from trailing newline)
    return !(index === arr.length - 1 && line === "");
  });

  return {
    lines,
    exitCode,
    stderr,
  };
}
