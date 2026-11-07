# Publishing

## Prerequisites

1. Set the repository default branch to `v2`. The `master` branch is the frozen
   Vanta 0.5 archive, not the active codebase.
2. Create the npm organization `@vantajs2` (or replace the scope everywhere with
   your own scope before publishing).
3. `npm login` locally, or add an `NPM_TOKEN` repository secret for CI.
4. For GitHub Pages, enable **Settings → Pages → Source: GitHub Actions**.
5. For provenance in CI, the repository must be public and the workflow needs
   `id-token: write`.

## Versioning

VantaJS2 uses [changesets](https://github.com/changesets/changesets).

```bash
pnpm changeset          # describe the change for one or more packages
pnpm version:packages   # apply versions and changelogs
pnpm check              # lint, types, unit, build, size, publint
pnpm test:visual
```

Commit the version bump, then tag and push:

```bash
git add .
git commit -m "release: v0.1.0"
git tag v0.1.0
git push origin v2 --tags
```

The `Release` workflow builds, tests, and runs `changeset publish` with npm
provenance. You can also publish manually:

```bash
pnpm release
```

## Packages

Published:

- `@vantajs2/core`
- `@vantajs2/three`
- `@vantajs2/effects`
- `@vantajs2/react`
- `@vantajs2/vue`
- `@vantajs2/svelte`

Private:

- `@vantajs2/docs`
- `@vantajs2/demo`

## Dry run

```bash
pnpm build
pnpm publish:dry
```

`pnpm publish:dry` runs `pnpm -r publish --dry-run` and skips private packages.

## Static demo

There are two static outputs:

1. **No-build HTML upload** — `apps/demo/static/`:
   `index.html`, `style.css`, `main.js`, `vanta2.js`. Upload as-is to any HTML
   host. Rebuild with `pnpm build:static`.
2. **Vite demo** — `apps/demo/dist`:

```bash
pnpm --filter @vantajs2/demo build
```

The `Pages` workflow deploys `apps/demo/dist` to GitHub Pages. For a project
site it uses `BASE_PATH=/<repository-name>/`; for a custom domain set
`BASE_PATH=/` in the workflow environment.

## Scope rename checklist

If `@vantajs2` is not available:

- change `name` in every `packages/*/package.json`;
- update workspace dependencies;
- update imports in `README.md`, `MIGRATION.md`, docs, demo, and wrappers;
- update `repository`/`homepage` if the repository moves;
- rerun `pnpm install`, `pnpm check`, `pnpm test:visual`.
