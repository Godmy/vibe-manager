# Rule Registry

`Vibe Manager` uses a structural audit model where each reported violation should be traceable to one stable rule definition.

## Current state

The extension currently keeps three related structures:

- `src/audit/const/object/error`
- `src/audit/const/object/error-message`
- `src/audit/const/object/error-recommendation`

This already gives a stricter contract than free-form strings inside check functions, but it still spreads one rule across multiple objects.

## Recommended target shape

The preferred end state is a single registry object:

```ts
export const RULE = {
  INVALID_CLUSTER: {
    severity: "error",
    message: "Cluster is not allowed in this path.",
    recommendation:
      "Move the entity to an allowed cluster or extend the cluster list in config.",
    adr: ["folder/cluster/001"]
  }
} as const;
```

## Why this shape is better

- One source of truth for each rule.
- No manual synchronization between `error`, `message`, and `recommendation`.
- Easy traceability back to ADR cards.
- Easier report enrichment for documentation, JSON schema, and UI rendering.
- Easier coverage review when new checks are added.

## Registry requirements

Each rule entry should eventually contain:

- `error`: stable internal identifier, for example `INVALID_CLUSTER`
- `severity`: `error` or `warning`
- `message`: short report text
- `recommendation`: short remediation text
- `adr`: one or more ADR references
- optional `tags`: for example `path`, `typescript`, `svelte`, `legacy`

## Migration path

1. Keep the current `ERROR` object as the stable internal id source.
2. Introduce `RULE` beside it.
3. Move `severity`, `message`, and `recommendation` into `RULE`.
4. Change `createAuditViolation` to resolve data from `RULE`.
5. Remove `error-message` and `error-recommendation` after full migration.

## Practical rule taxonomy

The current audit surface already suggests these groups:

- path rules
- file-name rules
- TypeScript export policy rules
- Svelte file content rules
- legacy migration rules
- joint-specific semantic rules

Keeping those groups visible in the registry will make future maintenance easier.
