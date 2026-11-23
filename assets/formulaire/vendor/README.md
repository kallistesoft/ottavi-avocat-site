# Vendored files for the intake form

Self-hosted so the form page loads nothing from a CDN. Loaded only when the client makes the PDF.

| File | Source | Licence |
|---|---|---|
| `pdf-lib.min.js` | pdf-lib 1.17.1, cdnjs `ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js` | MIT |
| `fontkit.umd.min.js` | @pdf-lib/fontkit 1.1.1, unpkg `dist/fontkit.umd.min.js` | MIT |
| `noto-sans-regular.js`, `noto-sans-semibold.js` | Noto Sans hinted TTF (notofonts), as base64 in a script | SIL OFL 1.1 (`NotoSans-OFL.txt`) |

The fonts are scripts, not `.ttf` files, because the page's CSP has `connect-src 'none'`: `fetch` is blocked, even
for the site's own files, which is what proves no answer can be sent anywhere.
