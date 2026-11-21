# Ottavi Law Firm site (`kallistesoft/ottavi-avocat-site`)

Client site for Ottavi Law Firm Inc. (Me Vanessa Poughon, immigration lawyer). Live at https://www.ottavilawfirm.com,
hosted on HER GoDaddy cPanel (not the Kallistesoft hosting); vpavocat.com and www 301 to it.

## Build, check, deploy
- Pages are generated: edit `tools/content.py` (texts, links, SEO `titles`/`descs`) or the templates in
  `tools/build.py`, run `python3 tools/build.py`, commit the regenerated HTML and `sitemap.xml`.
- Check: `tools/check.sh` (a rebuild must change no file, so committed pages are never stale). The global pre-push hook runs it.
- Preview: `python3 -m http.server 8000`.
- Deploy: every push to `main` uploads over FTPS with the `OTTAVI_FTP_*` org secrets. Never use or overwrite the
  `FTP_*` secrets (the other sites). Branches don't deploy.

## Rules (owner)
- Theme "Ivoire"; plum `#9B3F78` is the one thing that must stay. Fraunces + Inter.
- Booking and buy links stay exactly her systeme.io (a5c6-contact.systeme.io) and Calendly links (list in README).
- Never target "avocat Alberta" keywords: she isn't a Law Society of Alberta member.
- Her DNS is in her GoDaddy (delegate access, the owner types the SMS code). Never delete the Search Console TXT record.
- systeme.io work happens in Chrome, one subagent at a time.

## Branches and PRs
- Feature branch → push → PR against `main` (never stacked). The owner merges; never `gh pr merge`, never `--admin`.

## Autonomy, to-dos, decisions
- One subagent per update when the owner asks for several. Ask before copy or legal wording changes.
- To-dos: `FOLLOW-UP.md` (forms, content to confirm, off-site SEO). Non-blocking choices: `DECISIONS.md`, with the default taken.
