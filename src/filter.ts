#!/usr/bin/env node

import { formatError } from "./lib/formatter.ts";
import { parseLine } from "./lib/parser.ts";

interface OutputState {
  emittedDiagnostics: boolean;
  bufferedUnparsed: string[];
}

function createOutputState(): OutputState {
  return {
    emittedDiagnostics: false,
    bufferedUnparsed: [],
  };
}

function normalizeLine(line: string): string {
  return line.endsWith("\r") ? line.slice(0, -1) : line;
}

function formatLine(line: string, state: OutputState): string | null {
  const normalized = normalizeLine(line);
  const error = parseLine(normalized);

  if (error) {
    state.emittedDiagnostics = true;
    return formatError(error);
  }

  if (!state.emittedDiagnostics && normalized.trim()) {
    state.bufferedUnparsed.push(normalized);
  }

  return null;
}

function finishOutput(state: OutputState): string[] {
  if (state.emittedDiagnostics) {
    return [];
  }

  return state.bufferedUnparsed.length > 0 ? state.bufferedUnparsed : [""];
}

export function formatTscOutput(output: string): string {
  const state = createOutputState();
  const lines = output.split("\n");
  const formatted: string[] = [];

  for (const line of lines) {
    const formattedLine = formatLine(line, state);
    if (formattedLine !== null) {
      formatted.push(formattedLine);
    }
  }

  formatted.push(...finishOutput(state));
  if (formatted.length === 1 && formatted[0] === "") {
    return "\n";
  }

  return formatted.join("\n");
}

async function main(): Promise<number> {
  const state = createOutputState();
  let buffer = "";

  for await (const chunk of process.stdin) {
    buffer += String(chunk);
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const formattedLine = formatLine(line, state);
      if (formattedLine !== null) {
        console.log(formattedLine);
      }
    }
  }

  if (buffer) {
    const formattedLine = formatLine(buffer, state);
    if (formattedLine !== null) {
      console.log(formattedLine);
    }
  }

  for (const line of finishOutput(state)) {
    console.log(line);
  }

  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then((exitCode) => {
    process.exit(exitCode);
  });
}
