export const compressorFixtures: Array<{ input: string; output: string }> = [
  { input: "TS2304: Cannot find name 'foo'.", output: "TS2304:'foo'" },
  { input: "TS2307: Cannot find module './foo'.", output: "TS2307:'./foo'" },
  {
    input: "TS2339: Property 'foo' does not exist on type 'Bar'.",
    output: "TS2339:'foo'@'Bar'",
  },
  {
    input: "TS2322: Type 'Foo' is not assignable to type 'Bar'.",
    output: "TS2322:'Foo'~'Bar'",
  },
  {
    input:
      "TS2345: Argument of type 'Foo' is not assignable to parameter of type 'Bar'.",
    output: "TS2345:'Foo'~'Bar'",
  },
  {
    input:
      "TS2418: Type of computed property's value is 'Foo', which is not assignable to type 'Bar'.",
    output: "TS2418:'Foo'~'Bar'",
  },
  {
    input: "TS1227: Parameter '{0}' is not in the same position as parameter '{1}'.",
    output: "TS1227:Parameter '{0}' is not in the same position as parameter '{1}'.",
  },
  {
    input:
      "TS2551: Property 'fo' does not exist on type 'Bar'. Did you mean 'foo'?",
    output: "TS2551:'fo'@'Bar'?'foo'",
  },
  {
    input:
      "TS1340: Module '{0}' does not refer to a type, but is used as a type here. Did you mean 'typeof import('{0}')'?",
    output:
      "TS1340:Module '{0}' does not refer to a type, but is used as a type here. Did you mean 'typeof import('{0}')'?",
  },
  { input: "TS2554: Expected 2 arguments, but got 3.", output: "TS2554:2!=3" },
  { input: "TS2554: Expected 1 argument, but got 0.", output: "TS2554:1!=0" },
  {
    input: "TS2559: Type 'Foo' has no properties in common with type 'Bar'.",
    output: "TS2559:'Foo'~'Bar'",
  },
  {
    input:
      "TS2560: Value of type 'Foo' has no properties in common with type 'Bar'. Did you mean to call it?",
    output: "TS2560:'Foo'~'Bar'",
  },
  {
    input: "TS7006: Parameter 'foo' implicitly has an 'any' type.",
    output: "TS7006:'foo'",
  },
  {
    input: "TS7031: Binding element 'foo' implicitly has an 'any' type.",
    output: "TS7031:'foo'",
  },
  { input: "TS18048: 'foo' is possibly 'undefined'.", output: "TS18048:'foo'" },
  {
    input: "TS2532: Object is possibly 'undefined'.",
    output: "TS2532:Object is possibly 'undefined'.",
  },
  { input: "TS2565: Property 'foo' is used before being assigned.", output: "TS2565:'foo'" },
  {
    input: "TS1356: Did you mean to mark this function as 'async'?",
    output: "TS1356:Did you mean to mark this function as 'async'?",
  },
  {
    input: "TS18003: No inputs were found in config file.",
    output: "TS18003:No inputs were found in config file.",
  },
  {
    input: "TS9999: Some 'unknown' error 'message' here.",
    output: "TS9999:Some 'unknown' error 'message' here.",
  },
  {
    input:
      `TS18003: No inputs were found in config file '/tmp/tsconfig.json'. Specified 'include' paths were '["**/*"]' and 'exclude' paths were '[]'.`,
    output:
      `TS18003:No inputs were found in config file '/tmp/tsconfig.json'. Specified 'include' paths were '["**/*"]' and 'exclude' paths were '[]'.`,
  },
  { input: "Some random message", output: "Some random message" },
];
