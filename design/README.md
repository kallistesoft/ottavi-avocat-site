# Ottavi Law Firm Inc. — site mockup

Redesign of [vpavocat.com](https://www.vpavocat.com) under the Ottavi Law Firm Inc. brand, keeping only the content of
the current site.

The mockup is a claude.ai Design canvas: https://claude.ai/artifact/YZNTQhVjJHUVwpqpKucDFa

`mockup/` holds a copy of the canvas files. The canvas is the source of truth: edit it there, then copy the changed
files here.

## Files

| File | Screen |
| --- | --- |
| `canvas.json` | Canvas index: frame positions and sizes |
| `Main.dc.html` | Accueil (FR) |
| `Services.dc.html` | Services: audit, consultation, Alberta ebook |
| `Ressources.dc.html` | Free guide and CV template, with their forms |
| `Cabinet.dc.html` | Le cabinet: the lawyer, bar membership, address |
| `Contact.dc.html` | Email and Calendly booking |
| `Home-EN.dc.html` | Home (EN), reached from the FR / EN switch |
| `Header.dc.html`, `Footer.dc.html` | Shared header and footer, imported by every page |
| `Mobile-*.dc.html` | 390 px frames that import each FR page |

## Brand

Taken from the Ottavi logo.

- Colors:
  - Charcoal `#2E2E2E`, with `#232323` (deeper) and `#3A3A3A` (lighter) for surfaces
  - Gold `#D9CC8C` for the wordmark, headings and primary buttons
  - Plum `#9B3F78` for the double rule and accents. Use it as text only on light backgrounds: it's too dark to read on charcoal.
  - Cream `#F7F5EE` for the light sections
- Fonts: Cinzel for headings and the wordmark, Lato for body text (both from Google Fonts)
- Motif: the logo's double vertical plum lines frame the hero and the section titles

## Still to replace

- Email: `contact@ottavi.ca` is a placeholder
- The Calendly and systeme.io links (they point to those sites' home pages)
- Photos and the Systeme.io affiliate badge (labelled placeholders)
