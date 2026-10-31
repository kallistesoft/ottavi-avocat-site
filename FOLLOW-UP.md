# Follow-up

What's left on the new site, which has replaced her old one.

Today: the new site lives at https://www.ottavilawfirm.com, her new domain (GitHub Pages, `CNAME`).
`vpavocat.com` and `www.vpavocat.com` redirect to it.

## 1. Sign-up forms

Guide, CV and newsletter are done: their buttons open her systeme.io pages (`/guidegratuit`, `/cvcanadien-e5451c58-4a4b1be3`,
`/newsletter`), which collect the email. The home page section is shareable at `/#newsletter` and `/en/#newsletter`.

- [ ] Test the guide, CV and newsletter pages with a test email address: contact created, document received

Her old forms and thank-you pages only exist on `www.vpavocat.com`, so they stop working when `www` switches.

## 2. Content to confirm with her

- [ ] Address: the site shows Montréal (204, rue du Saint-Sacrement), but her bio says she lives in Alberta
- [ ] Photo: the portrait has a Gemini ✦ mark (looks AI-generated). A real photo is better for a lawyer's site
- [ ] Review the English translations

## Legal pages (draft)

`/cgv/` and `/confidentialite/` (and EN) come from `tools/legal.py` and are drafts.

- [ ] Me Poughon reviews both pages and settles every highlighted passage, then remove `DRAFT_NOTE` and the `todo()` calls
- [ ] Taxes: the products are set to 0 % in systeme.io while the site says "+ tx"
- [ ] After approval, change the payment pages' tick boxes to link the CGV (the guide's says "présentes conditions générales")

## 3. Before switching `www`

- [ ] She approves https://www.ottavilawfirm.com
- [ ] Real test purchase from the new site: worker audit (`commande-22ec70a7`, funnel AUDIT TRAVAILLEUR PAYMENT → confirmation email)
- [ ] Real test purchase: student audit (`d4acbe58-5b116c48`, funnel AUDIT ETUDES PAYMENT): product, emails, automation rules
- [ ] Real test purchase: ebook (`guidealbertaachat-ee964b16`, funnel EBOOK ALBERTA PAYMENT): file delivered, emails, automation rules
- [ ] Find where she shares `www.vpavocat.com/audit_travailleur` or `/commande` (Instagram, emails, ads); add redirect
      pages on the new site to the `a5c6-contact.systeme.io` pages of the same name

## 4. The switch (GoDaddy DNS: user types the SMS code to save)

`ottavilawfirm.com` is at GoDaddy, in her account. Its DNS only needs the GitHub records:

- [x] GoDaddy: `www` CNAME → `kallistesoft.github.io`
- [x] GoDaddy: replace the parked `@` A record with `185.199.108.153` to `185.199.111.153`
- [x] GitHub Pages custom domain → `www.ottavilawfirm.com`, then enforce HTTPS once the certificate is issued
- [x] systeme.io pages: header/footer links and favicon now point to `www.ottavilawfirm.com` (the 3 PAYMENT order pages, CV, `/commande`)
- [x] Delete `robots.txt` (done before her approval, user's decision)
- [x] `vpavocat.com` and `www.vpavocat.com`: GoDaddy forwarding (301) to `https://www.ottavilawfirm.com`, done before her approval (user's decision).
      Paths aren't kept. To restore her old home page, set `www` back to CNAME `d2m106fbjcka9h.cloudfront.net`
- [ ] Delete the `new` CNAME on `vpavocat.com` once the new domain works
- [ ] On `vpavocat.com`, don't touch: MX, SPF, DMARC, Microsoft 365 records, systeme.io DKIM (`systemeio1/2._domainkey`), Amazon SES
- [ ] After: full purchase test again, and an email to `contact@vpavocat.com` still arrives

The full DNS list before any change is saved in the session notes (27 records, 2026-10-28).

## 5. Repo

- [ ] Commit author shows the user's personal Gmail and computer name. Set this repo's git email to the GitHub
      noreply address or `contact@kallistesoft.ca` (and decide whether to rewrite past history: force-push)
