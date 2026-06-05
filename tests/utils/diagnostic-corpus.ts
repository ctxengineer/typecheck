import { compressMessage } from "../../src/lib/compressor.ts";

export interface DiagnosticTemplate {
  code: string;
  body: string;
  input: string;
}

export interface DiagnosticAuditEntry extends DiagnosticTemplate {
  output: string;
  kind: "compact" | "fallback";
}

const TEMPLATE_PATTERN = /^(TS\d+): (.+)$/;

export async function loadDiagnosticTemplates(): Promise<DiagnosticTemplate[]> {
  const path = new URL("./tsc-error-code-template.txt", import.meta.url);
  const text = await Bun.file(path).text();

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((input) => {
      const match = input.match(TEMPLATE_PATTERN);
      if (!match) {
        throw new Error(`Invalid diagnostic template: ${input}`);
      }

      return {
        code: match[1]!,
        body: match[2]!,
        input,
      };
    });
}

export function auditDiagnosticTemplate(
  template: DiagnosticTemplate
): DiagnosticAuditEntry {
  const output = compressMessage(template.input);
  const fallback = `${template.code}:${template.body}`;

  return {
    ...template,
    output,
    kind: output === fallback ? "fallback" : "compact",
  };
}

