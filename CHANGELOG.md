# Changelog

## 0.0.3

- Updated the extension documentation to describe the current structural audit feature set instead of a generic coming-soon placeholder.
- Added a rule registry design document for the plugin codebase.
- Documented the current ADR coverage matrix and the missing audit areas for future implementation.
- Kept the extension configuration model explicit and documented all current customization lists.

## 0.0.1

- Initial public release of `Vibe Manager`.
- Added VS Code command to show a basic workspace summary.
- Added TypeScript-based extension scaffold with unit and integration test setup.
- Added Marketplace icon and repository metadata.

## 0.0.2

- Updated Marketplace copy to mark the extension as an early preview.
- Added a minimal structural audit engine for `cluster`, `joint`, and file naming checks.
- Switched the default config to `../stylist-svelte/src/lib`.
- Reworked the main command to let users choose which folders to inspect.
- Added save-target selection for generated JSON reports.
- Added `vibe-manager.config.json` support for persistent folder selection and output path.
- Added recursive folder report generation service and tests.
