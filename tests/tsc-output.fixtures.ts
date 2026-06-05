export const tscOutputFixtures: Array<{ input: string; output: string }> = [
  {
    input: `src/foo.ts(15,22): error TS2339: Property 'foo' does not exist on type 'Bar'.
src/foo.ts(16,28): error TS2339: Property 'foo' does not exist on type 'Bar'.
src/baz.ts(8,15): error TS2339: Property 'bar' does not exist on type 'Baz'.`,
    output: `<typecheck:summary>
  - TS2339:'foo'@'Bar' (x2)
  - TS2339:'bar'@'Baz'
</typecheck:summary>`,
  },
  {
    input: `src/foo.tsx(8,37): error TS2551: Property 'foo' does not exist on type '{ fo: () => Promise<Qux[]>; }'. Did you mean 'fo'?
src/foo.tsx(9,35): error TS7006: Parameter 'bar' implicitly has an 'any' type.
src/foo.tsx(10,41): error TS7006: Parameter 'bar' implicitly has an 'any' type.
src/foo.tsx(11,32): error TS7006: Parameter 'bar' implicitly has an 'any' type.`,
    output: `<typecheck:summary>
  - TS2551:'foo'@'{ fo: () => Promise<Qux[]>; }'?'fo'
  - TS7006:'bar' (x3)
</typecheck:summary>`,
  },
];
