import { expect, test, describe } from "bun:test";
import {
  auditDiagnosticTemplate,
  loadDiagnosticTemplates,
} from "./utils/diagnostic-corpus.ts";

const templates = await loadDiagnosticTemplates();

describe("TypeScript diagnostic corpus", () => {
  test("loads the expected TypeScript 4.7.3 diagnostic template corpus", () => {
    expect(templates).toHaveLength(1826);
  });

  test("every TypeScript diagnostic template has a handled output", () => {
    const failures: string[] = [];

    for (const template of templates) {
      const audit = auditDiagnosticTemplate(template);

      if (!audit.output.startsWith(`${template.code}:`)) {
        failures.push(`${template.input} -> ${audit.output}`);
      }
    }

    expect(failures).toEqual([]);
  });

  test("symbolic corpus outputs preserve template operands", () => {
    const failures: string[] = [];

    for (const template of templates) {
      const audit = auditDiagnosticTemplate(template);
      if (audit.kind !== "compact" || !template.input.includes("{0}")) {
        continue;
      }

      if (!audit.output.includes("'{0}'")) {
        failures.push(`${template.input} -> ${audit.output}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
