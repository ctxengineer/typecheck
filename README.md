# @ctxlyr/typecheck

Token-efficient TypeScript error reporter for AI agents.

Runs the `tsc` already available to the current project and compresses verbose error output into symbolic shorthand. Designed to minimize tokens when feeding diagnostics to AI coding agents.

## Usage

```bash
bunx @ctxlyr/typecheck
```

All arguments are passed directly to `tsc`; the wrapper appends `--noEmit --pretty false`.

```bash
bunx @ctxlyr/typecheck -p tsconfig.json
bunx @ctxlyr/typecheck src/index.ts
```

By default, the command exits with the same status as `tsc`. Use `--exit-zero` when you want compressed diagnostics without failing the shell step.

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
