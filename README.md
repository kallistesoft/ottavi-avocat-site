# Ottavi Law Firm Inc. — website

Static site built from the mockup in [`design/`](design/README.md). Plain HTML, no build step.

## Structure

| FR | EN | Page |
| --- | --- | --- |
| `/` | `/en/` | Home |
| `/services/` | `/en/services/` | Audit, consultation, Alberta ebook |
| `/ressources/` | `/en/resources/` | Free guide and CV template |
| `/cabinet/` | `/en/firm/` | The firm and the lawyer |
| `/contact/` | `/en/contact/` | Email and Calendly booking |

All styles are in `assets/site.css`. The header and footer are repeated in every page: change all ten when you edit
them. Links are relative, so the site works at a domain root or in a subfolder. Preview with a local server:

```sh
python3 -m http.server 8000
```

## Links

- Consultation: the Calendly link used by the province quiz
- Audit payment: `https://a5c6-contact.systeme.io/auditpaiement` (content taken from her audit page `/ec75652d`)
- Alberta ebook: `https://a5c6-contact.systeme.io/guidealberta`

## Still to do

- The newsletter, guide and CV forms have no backend yet: connect them to systeme.io

## Hosting

The code lives here; the site is hosted by the client. Every push to `main` runs the **Package site** workflow, which
builds an `ottavi-site` zip (the site without `design/`, `.github` and this README). Download it from the workflow
run's Artifacts and upload its contents to the client's web root.
