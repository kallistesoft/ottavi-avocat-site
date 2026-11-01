# Follow-up

What's left on the new site, which has replaced her old one.

Today: the new site lives at https://www.ottavilawfirm.com, on her GoDaddy cPanel.
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

- [x] CGV: her answers applied (2026-11-01), except taxes
- [x] Privacy page: her answers applied (2026-11-01), host corrected to GoDaddy
- [ ] Me Poughon rereads the new wording: CGV 14-day EU withdrawal and "quelques jours ouvrables"; privacy retention
- [ ] Privacy impact assessment for providers outside Québec: she confirmed the provider list, not that an assessment was done
- [ ] Then remove `DRAFT_NOTE` and the `todo()` calls (only the CGV tax sentence is left)
- [ ] Taxes: the 3 products are at 0 % (Exclue) in systeme.io while the site says "+ tx". Each product has one rate field
      (Ressources > Produits physiques), with no rate per province or country, and the assistant account can open it.
      She must give the rate(s) and her GST/QST registration; the CGV sentence stays highlighted until then
- [ ] After approval, change the payment pages' tick boxes to link the CGV (the guide's says "présentes conditions générales")
      and to add the EU waiver: she asks for immediate delivery and gives up the 14-day withdrawal. Without it the CGV's early end doesn't hold

## 3. Before switching `www`

- [ ] She approves https://www.ottavilawfirm.com
- [ ] Real test purchase from the new site: worker audit (`commande-22ec70a7`, funnel AUDIT TRAVAILLEUR PAYMENT → confirmation email)
- [ ] Real test purchase: student audit (`d4acbe58-5b116c48`, funnel AUDIT ETUDES PAYMENT): product, emails, automation rules
- [ ] Real test purchase: ebook (`guidealbertaachat-ee964b16`, funnel EBOOK ALBERTA PAYMENT): file delivered, emails, automation rules
- [ ] Find where she shares `www.vpavocat.com/audit_travailleur` or `/commande` (Instagram, emails, ads); add redirect
      pages on the new site to the `a5c6-contact.systeme.io` pages of the same name

## 4. The switch (GoDaddy DNS: user types the SMS code to save)

- [x] `ottavilawfirm.com` moved to her cPanel: GoDaddy set the DNS when the domain was added, and AutoSSL issued the certificate
- [x] GitHub Pages disabled and `CNAME` removed
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
