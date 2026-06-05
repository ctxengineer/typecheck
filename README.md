# @ctxlyr/typecheck

Token-efficient TypeScript error reporter for AI agents.

Wraps `tsc` and compresses verbose error output into symbolic shorthand. Groups identical errors with counts. Designed to minimize tokens when feeding diagnostics to AI coding agents.

## Usage

```bash
npx @ctxlyr/typecheck
```

```bash
npx @ctxlyr/typecheck --tsgo
```

## Output

**Passing:**

```

<typecheck:passing />

```

**Errors:**

```xml
<typecheck:summary>
  - TS2339:'foo'@'Bar' (x2)
  - TS2339:'baz'@'Qux'
</typecheck:summary>
```

## Before/After

**Raw tsc output:**

```
src/foo.ts(15,22): error TS2339: Property 'foo' does not exist on type 'Bar'.
src/foo.ts(16,28): error TS2339: Property 'foo' does not exist on type 'Bar'.
src/baz.ts(8,15): error TS2339: Property 'baz' does not exist on type 'Qux'.
```

**Compressed output:**

```xml
<typecheck:summary>
  - TS2339:'foo'@'Bar' (x2)
  - TS2339:'baz'@'Qux'
</typecheck:summary>
```
