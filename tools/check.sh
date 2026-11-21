#!/bin/sh
# Pre-push check (run by the global pre-push hook, or by hand). The pages are generated and committed:
# tools/build.py must not change any file, otherwise the committed HTML is stale.
set -e
cd "$(dirname "$0")/.."
state() { git status --porcelain; git diff HEAD | shasum; }
before="$(state)"
python3 tools/build.py >/dev/null
after="$(state)"
if [ "$before" != "$after" ]; then
  echo "FAIL generated pages were stale: tools/build.py changed files; review and commit them:"
  git status --short
  exit 1
fi
echo "check: all passed"
