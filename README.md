# @ctxlyr/typecheck

Token-efficient TypeScript error reporter for AI agents.

Wraps `tsgo` (native TypeScript compiler) and compresses verbose error output into symbolic shorthand. Groups identical errors with counts. Designed to minimize tokens when feeding diagnostics to AI coding agents.

## Usage

```bash
bunx @ctxlyr/typecheck
```

## Output

**Passing:**

```

```

**Errors:**

```
src/foo.ts(15,22):TS2339:'foo'@'Bar'
src/foo.ts(16,28):TS2339:'foo'@'Bar'
src/baz.ts(8,15):TS2339:'baz'@'Qux'
```

## Before/After

**Raw tsc output:**

```
src/foo.ts(15,22): error TS2339: Property 'foo' does not exist on type 'Bar'.
src/foo.ts(16,28): error TS2339: Property 'foo' does not exist on type 'Bar'.
src/baz.ts(8,15): error TS2339: Property 'baz' does not exist on type 'Qux'.
```

**Compressed output:**

```
src/foo.ts(15,22):TS2339:'foo'@'Bar'
src/foo.ts(16,28):TS2339:'foo'@'Bar'
src/baz.ts(8,15):TS2339:'baz'@'Qux'
```

## License

MIT
