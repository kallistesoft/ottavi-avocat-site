# Decisions

Non-blocking choices Claude made with its default; owner validates later. When a choice isn't blocking, write it
here with the default taken and keep working; ask only when it blocks.

| Date | Decision | Default taken | Status |
|---|---|---|---|
| 2026-11-21 | What `tools/check.sh` checks | a rebuild with `tools/build.py` that must change no file (stale committed pages fail the push) | to validate |
| 2026-11-23 | Intake form: address the clients email the PDF to | `contact@vpavocat.com` (the site's `EMAIL`), shown on the end screen and in the mailto | validated by the owner 2026-11-23 |
| 2026-11-23 | Intake form: fonts in the PDF | Noto Sans (covers Latin, Greek, Cyrillic); other scripts (Arabic, Chinese…) print as `?` | to validate |
| 2026-11-23 | Intake form: answers as data in the PDF | `reponses.json` attached + a paperclip and a printed line on page 1 (icon shows in Acrobat, not in Preview or Chrome) | to validate |
| 2026-11-23 | Intake form: privacy | page-only CSP `connect-src 'none'; form-action 'none'`, noindex, `robots.txt` Disallow, no analytics on the page | to validate |
