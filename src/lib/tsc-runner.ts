import { spawn } from "child_process";
import { Readable } from "stream";
import type { TscStreamResult } from "./types.ts";

/**
 * Default arguments to pass to tsgo for clean, parseable output
 */
const DEFAULT_TSC_ARGS = ["--noEmit", "--pretty", "false"];

/**
 * Check if the user has already specified a project flag
 * @param args User-provided arguments
 * @returns true if --project or -p is present
 */
function hasProjectFlag(args: string[]): boolean {
  return args.some(arg =>
    arg === '--project' ||
    arg === '-p' ||
    arg.startsWith('--project=')
  );
}

/**
 * Build the full tsc arguments array
 */
function buildTscArgs(args: string[]): string[] {
  const tscArgs: string[] = [];
  if (!hasProjectFlag(args)) {
    tscArgs.push('--project', process.cwd());
  }
  tscArgs.push(...args);
  tscArgs.push(...DEFAULT_TSC_ARGS);
  return tscArgs;
}

/**
 * Async generator that yields lines from a ReadableStream
 */
async function* streamLines(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n");
      buffer = parts.pop() ?? "";

      for (const line of parts) {
        yield line;
      }
    }
    if (buffer) {
      yield buffer;
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Run tsc with streaming output
 * Returns an async iterator over lines as they arrive
 * @param args User-provided arguments
 * @param useTsgo If true, use tsgo instead of tsc
 */
export function runTscStream(args: string[] = [], useTsgo = false): TscStreamResult {
  const tscArgs = buildTscArgs(args);
  const compiler = useTsgo ? "tsgo" : "tsc";

  const proc = spawn("npx", [compiler, ...tscArgs], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  const exitCode = new Promise<number>((resolve) => {
    proc.on("close", (code) => resolve(code ?? 1));
  });

  const stdout = Readable.toWeb(proc.stdout!) as ReadableStream<Uint8Array>;
  const stderr = Readable.toWeb(proc.stderr!) as ReadableStream<Uint8Array>;

  return {
    lines: streamLines(stdout),
    exitCode,
    stderr,
  };
}

