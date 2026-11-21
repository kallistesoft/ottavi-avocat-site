# Decisions

Non-blocking choices Claude made with its default; owner validates later. When a choice isn't blocking, write it
here with the default taken and keep working; ask only when it blocks.

| Date | Decision | Default taken | Status |
|---|---|---|---|
| 2026-11-21 | What `tools/check.sh` checks | a rebuild with `tools/build.py` that must change no file (stale committed pages fail the push) | to validate |
