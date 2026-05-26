# Lessons Learned (Mistakes & Fixes)

## Memory Synchronization Discipline
- **Mistake**: Memory synchronization can be forgotten when the task appears to be "instruction-only".
- **Lesson**: Treat instruction/coordination turns as real work chunks and still update `tasks.md`, `progress.md`, and `lessons.md` immediately.

## WebSocket Centralization
- **Mistake**: Initially added WebSocket script only to `dashboard.html`.
- **Lesson**: Trading bots need real-time data on multiple pages (Ledger, Portfolio). Always centralize WebSocket logic in `base.html` and use `data-instrument` attributes for generic updates.

## Historical Data Consistency
- **Mistake**: Added new fields to `Trade` model but didn't populate them for existing trades.
- **Lesson**: When adding metadata fields (like strike price), always run a "healing" script to update existing records if possible, so the UI stays consistent.

## Upstox IP Restrictions
- **Mistake**: Interpreting 403 Forbidden as just an Auth error.
- **Lesson**: Upstox error `UDAPI1154` specifically means Static IP restriction. Always provide clear UI instructions for the user to fix this in the developer portal.

## Autofill in Iframes
- **Context**: The extension was not filling data on some job portals.
- **Mistake**: Many job application forms are hosted within iframes. By default, content scripts only run in the top-level frame.
- **Correction**: Added `"all_frames": true` to the `content_scripts` configuration in `manifest.json`.

## Bypassing Framework Restraints
- **Context**: Modern web frameworks (like React or Angular) often intercept standard `input` value changes.
- **Mistake**: Setting `element.value = newValue` directly doesn't always trigger the framework's internal state update. Also, using the wrong prototype (e.g., `HTMLInputElement` for a `textarea`) causes an "Illegal invocation" error.
- **Correction**: Used the correct prototype (`HTMLInputElement` or `HTMLTextAreaElement`) to access the native `value` setter and dispatched `input`, `change`, and `blur` events. Also added support for `contenteditable` elements via `innerText`.

## Comprehensive Memory Sync
- **Mistake**: Responding to an instruction-only turn by only updating `tasks.md` and `progress.md`.
- **Lesson**: The mandatory memory-first workflow explicitly requires updating `tasks.md`, `progress.md`, AND `lessons.md`. Even meta-tasks or acknowledgments should be fully documented to maintain the integrity of the memory system.

## Chrome Extension Module Imports
- **Context**: Importing modules in an options page or popup.
- **Mistake**: Using relative paths like `../parsers/resume-parser.js` can sometimes fail depending on how the extension is loaded or the directory structure.
- **Lesson**: Use absolute paths (e.g., `/parsers/resume-parser.js`) for more reliable module imports in Chrome Extensions.

## Environmental Robustness
- **Context**: Using `crypto.randomUUID()`.
- **Mistake**: Assuming `crypto.randomUUID()` is always available. It requires a secure context (HTTPS or extension schemes), but some environments or older browsers might not support it.
- **Lesson**: Always provide a fallback (like `Math.random()`) for modern browser APIs when working in varied environments.
