# AI Job Auto Filler (Chrome Extension - Manifest V3)

## 1) Architecture overview
- Privacy-first, local-first architecture using `chrome.storage.local` only.
- Manual trigger autofill (popup button / keyboard shortcut) with **no auto-submit**.
- Multi-profile resume system with parser + editable structured profile.
- Adapter-based site support to extend behavior per job portal.
- SPA/dynamic-form compatible via passive DOM monitoring.

## 2) Folder structure
```text
chrome-jobapply/
├── manifest.json
├── background/service-worker.js
├── content/content-script.js
├── parsers/resume-parser.js
├── adapters/*.js
├── options/*
├── popup/*
├── storage/storage.js
├── utils/field-matcher.js
├── utils/logger.js
└── assets/*
```

## 3) Full codebase coverage
- `manifest.json`: MV3 config, permissions, commands, popup/options wiring.
- `options/*`: profile manager, CV upload, parser run, editor, logs, import/export, theme.
- `popup/*`: quick trigger, active profile selector, autofill preview list.
- `content/*`: field discovery, smart mapping, confidence scoring, safe fill events.
- `parsers/*`: TXT/PDF/DOCX local extraction fallback and structured profile inference.
- `adapters/*`: LinkedIn/Indeed/Naukri/Wellfound/Greenhouse/Lever modular hooks.
- `background/*`: startup defaults + command/message handling.

## 4) Setup instructions
1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Open extension options and upload CV (`.pdf`, `.docx`, `.txt`).
5. Review parsed profile fields and save.

## 5) Testing instructions
1. Verify extension loads without manifest errors.
2. Upload TXT, PDF, DOCX samples and inspect parsed output.
3. Open test forms (native + React) and run autofill.
4. Confirm field preview appears and user can review values.
5. Confirm no submit action is ever triggered.

## 6) Security/compliance guardrails
- Never bypass CAPTCHA.
- Never bypass login/auth systems.
- Never auto-submit applications.
- Never transmit CV/profile data externally without explicit user action.

## 7) Important parser fallback note
- PDF/DOCX parsing here uses binary-text fallback extraction for local/offline compliance with minimal dependencies.
- For production-grade extraction accuracy, integrate a dedicated local parser library and add deterministic field-validation rules.

## 8) Future roadmap
- Add robust PDF/DOCX parsing library integration.
- Add per-field confidence explanation in the UI.
- Add stronger encryption with WebCrypto + user passphrase.
- Add job-description match score and optional local AI cover-letter generation.
- Add portal-specific advanced adapters and custom question templates.
