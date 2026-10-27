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
them. Links are root-relative, so preview with a local server:

```sh
python3 -m http.server 8000
```

## Links

- Consultation: the Calendly link used by the province quiz
- Audit: `https://a5c6-contact.systeme.io/ec75652d`
- Alberta ebook: `https://a5c6-contact.systeme.io/guidealberta`

## Still to do

- Email `contact@ottavi.ca` is a placeholder
- Photo of the lawyer and the Systeme.io affiliate badge are labelled placeholders
- The newsletter, guide and CV forms have no backend yet: connect them to systeme.io
- Hosting and domain: not deployed yet
