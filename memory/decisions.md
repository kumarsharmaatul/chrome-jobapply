# Decisions Log

## 2026-05-26 — Memory synchronization applies to instruction-only turns

### Decision
Treat operational/instruction-only user turns as completed work chunks and update memory artifacts (`tasks.md`, `progress.md`, and `lessons.md`) immediately after those turns.

### Reason
This prevents memory drift and enforces the mandatory sync rule even when no feature code is changed.

## 2026-05-27 — Avoid External LLM APIs (Privacy First)

### Decision
Reject integration of external LLM APIs (like Google Gemini) for automated form filling.

### Reason
The project core value is "privacy-first" and "local-only". Sending sensitive profile data (CVs, personal details) to external LLM providers via API keys stored in the browser poses a security and privacy risk that contradicts the project's architecture. We will continue to improve local, heuristic-based matching and explore local browser-native AI (e.g., Gemini Nano via `window.ai`) if/when it becomes widely stable and privacy-safe.
