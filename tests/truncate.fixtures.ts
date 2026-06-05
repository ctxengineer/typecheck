export const truncateFixtures: Array<{ input: string; output: string }> = [
  // Single key objects - no ellipsis needed
  { input: "'{ foo: string; }'", output: "'{ foo: string; }'" },
  {
    input: "'{ fo: () => Promise<Qux[]>; }'",
    output: "'{ fo: () => Promise<Qux[]>; }'",
  },

  // Multiple keys - longest key wins, ellipsis added
  { input: "'{ a: number; b: string; }'", output: "'{ a: number; ... }'" },
  {
    input: "'{ a: number; longKey: string; }'",
    output: "'{ longKey: string; ... }'",
  },
  {
    input: "'{ short: number; longerKey: string; x: boolean; }'",
    output: "'{ longerKey: string; ... }'",
  },

  // Nested object values - always get ellipsis (value was truncated)
  {
    input: "'{ data: { nested: any; }; }'",
    output: "'{ data: { ... }; ... }'",
  },
  {
    input: "'{ x: number; config: { a: number; }; }'",
    output: "'{ config: { ... }; ... }'",
  },

  // Objects inside generics - single key, no ellipsis
  {
    input: "Record<string, { foo: string; }>",
    output: "Record<string, { foo: string; }>",
  },
  { input: "Promise<{ data: any; }>", output: "Promise<{ data: any; }>" },
  {
    input: "Map<string, { key: value; }>",
    output: "Map<string, { key: value; }>",
  },

  // Objects inside generics - multiple keys, ellipsis added
  {
    input: "Array<{ id: number; name: string; }>",
    output: "Array<{ name: string; ... }>",
  },

  // Quoted generics with single-key objects
  {
    input: "'Record<string, { foo: string; }>'",
    output: "'Record<string, { foo: string; }>'",
  },
  {
    input: "'Promise<{ data: any; }>'",
    output: "'Promise<{ data: any; }>'",
  },

  // Nested generics - single key, no ellipsis
  {
    input: "Promise<Record<string, { foo: bar; }>>",
    output: "Promise<Record<string, { foo: bar; }>>",
  },

  // Multiple objects in one string - each handled independently
  {
    input: "'{ a: number; }' and '{ b: string; }'",
    output: "'{ a: number; }' and '{ b: string; }'",
  },
  {
    input: "'{ a: number; x: string; }' and '{ b: string; }'",
    output: "'{ a: number; ... }' and '{ b: string; }'",
  },

  // Edge cases - should NOT be truncated
  { input: "'Foo'", output: "'Foo'" },
  { input: "Promise<string>", output: "Promise<string>" },
  { input: "'{ foo: string }'", output: "'{ foo: string }'" }, // no semicolon
  { input: "string", output: "string" },
  { input: "number[]", output: "number[]" },
];
