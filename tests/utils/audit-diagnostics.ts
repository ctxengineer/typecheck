import {
  auditDiagnosticTemplate,
  loadDiagnosticTemplates,
} from "./diagnostic-corpus.ts";

const templates = await loadDiagnosticTemplates();
const audits = templates.map(auditDiagnosticTemplate);
const compact = audits.filter((audit) => audit.kind === "compact");
const fallback = audits.filter((audit) => audit.kind === "fallback");

console.log(
  JSON.stringify(
    {
      total: audits.length,
      compact: compact.length,
      fallback: fallback.length,
      compactSamples: compact.slice(0, 10).map(({ input, output }) => ({
        input,
        output,
      })),
      fallbackSamples: fallback.slice(0, 10).map(({ input, output }) => ({
        input,
        output,
      })),
    },
    null,
    2
  )
);

