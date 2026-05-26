# Decisions Log

## 2026-05-26 — Memory synchronization applies to instruction-only turns

### Decision
Treat operational/instruction-only user turns as completed work chunks and update memory artifacts (`tasks.md`, `progress.md`, and `lessons.md`) immediately after those turns.

### Reason
This prevents memory drift and enforces the mandatory sync rule even when no feature code is changed.
