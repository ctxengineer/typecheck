export const tscOutputFixtures: Array<{ input: string; output: string }> = [
  {
    input: ``,
    output: "\n",
  },
  {
    input: `src/foo.ts(15,22): error TS2339: Property 'foo' does not exist on type 'Bar'.
src/foo.ts(16,28): error TS2339: Property 'foo' does not exist on type 'Bar'.
src/baz.ts(8,15): error TS2339: Property 'bar' does not exist on type 'Baz'.

Found 3 errors in 2 files.`,
    output: `src/foo.ts(15,22):TS2339:'foo'@'Bar'
src/foo.ts(16,28):TS2339:'foo'@'Bar'
src/baz.ts(8,15):TS2339:'bar'@'Baz'`,
  },
  {
    input: `src/foo.tsx(8,37): error TS2551: Property 'foo' does not exist on type '{ fo: () => Promise<Qux[]>; }'. Did you mean 'fo'?
src/foo.tsx(9,35): error TS7006: Parameter 'bar' implicitly has an 'any' type.
src/foo.tsx(10,41): error TS7006: Parameter 'bar' implicitly has an 'any' type.
src/foo.tsx(11,32): error TS7006: Parameter 'bar' implicitly has an 'any' type.

Found 4 errors in the same file, starting at: src/foo.tsx:8`,
    output: `src/foo.tsx(8,37):TS2551:'foo'@'{ fo: () => Promise<Qux[]>; }'?'fo'
src/foo.tsx(9,35):TS7006:'bar'
src/foo.tsx(10,41):TS7006:'bar'
src/foo.tsx(11,32):TS7006:'bar'`,
  },
  {
    input: `src/api.ts(42,15): error TS2339: Property 'getUserProfileWithSettings' does not exist on type 'VeryLongTypeNameThatExceedsThirtyCharacters'.

Found 1 error in 1 file.`,
    output: `src/api.ts(42,15):TS2339:'getUserProfileWithSettings'@'VeryLongTypeNameThatExceedsThi...'`,
  },
  {
    input: `src/typecheck.ts(74,5): error TS2552: Cannot find name 'onsole'. Did you mean 'console'?`,
    output: `src/typecheck.ts(74,5):TS2552:'onsole'~'console'`,
  },
];
