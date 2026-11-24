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
| 2026-11-23 | IMM 5710: who fills it | the client answers the questionnaire; Me Poughon drops the PDF on private `/outil/imm5710/`, which fills IRCC's form in her browser (owner's choice) | validated by the owner |
| 2026-11-23 | IMM 5710: IUC and EIMT number | typed by Me Poughon on `/outil/imm5710/`, not asked to the client (owner) | validated by the owner |
| 2026-11-23 | IMM 5710: IRCC lists on the English questionnaire | French labels (owner declined downloading the English form); questions translated by Claude | validated by the owner |
| 2026-11-24 | Francophone Mobility: IMM 5707 with the IMM 5710 | one questionnaire (`/formulaire/mobilite-francophone/`, French only); `/outil/mobilite-francophone/` (was `/outil/imm5710/`) fills both forms from one dropped PDF (owner) | validated by the owner |
| 2026-11-24 | IMM 5707: blocks Acrobat shows or hides | the fill also writes Acrobat's form state (spouse hidden without spouse, « mariage en personne » when married, children hidden or extra rows) | to validate in Acrobat |
| 2026-11-24 | IMM 5707: deceased relative, signatures | « Décédé(e), ville, pays, date » in « Adresse actuelle » and « Non » for accompanying (IRCC's instructions); signatures and dates left for the client | to validate |
| 2026-11-24 | IMM 5710 = applicant already in Canada | question 7 asks only the status in Canada (IRCC locks the country to Canada and erases a citizen/PR status given with dates); the mailing address is in Canada (country locked too) | found in testing, owner confirmed the in-Canada rule |
| 2026-11-24 | Questionnaire: where the client is | first question « Où vous trouvez-vous actuellement? »: in Canada, country shown locked to Canada and a Canadian mailing address; outside, the client gives country, status and dates (owner). The tool then makes only the IMM 5707 (the IMM 5710 is for people in Canada) | validated by the owner (5707-only for abroad: to validate) |
| 2026-11-24 | Questionnaire wording | no IRCC form name or number shown to the client (owner) | validated by the owner |
| 2026-11-23 | IMM 5710: how the PDF is filled | incremental update (IRCC's bytes kept, XFA datasets re-encrypted with the form's key): certification and Reader rights stay valid | to validate |
