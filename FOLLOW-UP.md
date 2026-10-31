# Follow-up

What's left before the new site officially replaces her current one on `www.vpavocat.com`.

Today: the new site lives at https://www.ottavilawfirm.com, her new domain (GitHub Pages, `CNAME` + `robots.txt` block indexing).
`www.vpavocat.com` still serves her systeme.io site. Nothing switches until she approves the new site **and** her
systeme.io sales funnel is proven to work from it.

## 1. Sign-up forms

Guide and CV are done: their buttons open her systeme.io pages (`/guidegratuit`, `/cvcanadien-e5451c58-4a4b1be3`), which collect
the email.

- [ ] Newsletter: she needs a systeme.io newsletter page. Send the link, then replace the home page form with a button
      and remove the « bientôt disponible » notice (`assets/site.js`, `form_note` in `tools/build.py`)
- [ ] Test the guide and CV pages with a test email address: contact created, document received

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
- [ ] Payment page footer links point to `new.vpavocat.com`; change them to `www.ottavilawfirm.com`

## 3. Before switching `www`

- [ ] She approves https://www.ottavilawfirm.com
- [ ] Real test purchase from the new site: worker audit (`commande-22ec70a7`, funnel AUDIT TRAVAILLEUR PAYMENT → confirmation email)
- [ ] Real test purchase: student audit (`d4acbe58-5b116c48`, funnel AUDIT ETUDES PAYMENT): product, emails, automation rules
- [ ] Real test purchase: ebook (`guidealbertaachat-ee964b16`, funnel EBOOK ALBERTA PAYMENT): file delivered, emails, automation rules
- [ ] Find where she shares `www.vpavocat.com/audit_travailleur` or `/commande` (Instagram, emails, ads); add redirect
      pages on the new site to the `a5c6-contact.systeme.io` pages of the same name

## 4. The switch (GoDaddy DNS: user types the SMS code to save)

`ottavilawfirm.com` is at GoDaddy, in her account. Its DNS only needs the GitHub records:

- [ ] GoDaddy: `www` CNAME → `kallistesoft.github.io` (today `ottavilawfirm.com.`)
- [ ] GoDaddy: replace the parked `@` A record with `185.199.108.153` to `185.199.111.153`
- [ ] GitHub Pages custom domain → `www.ottavilawfirm.com`, then enforce HTTPS once the certificate is issued
- [ ] systeme.io forks (PAYMENT funnels, CV): header/footer links and favicon point to `new.vpavocat.com`; change them to
      `www.ottavilawfirm.com`. The audit and guideAlberta heroes live in each page's footer code, and the prices there must be
      changed by hand
- [ ] Once she approves: delete `robots.txt`
- [ ] Decide what `www.vpavocat.com` does. It stays on systeme.io for now, and redirecting it would break `/audit_travailleur`
      and `/commande` there
- [ ] Delete the `new` CNAME on `vpavocat.com` once the new domain works
- [ ] On `vpavocat.com`, don't touch: MX, SPF, DMARC, Microsoft 365 records, systeme.io DKIM (`systemeio1/2._domainkey`), Amazon SES
- [ ] After: full purchase test again, and an email to `contact@vpavocat.com` still arrives

The full DNS list before any change is saved in the session notes (27 records, 2026-10-28).

## 5. Repo

- [ ] Commit author shows the user's personal Gmail and computer name. Set this repo's git email to the GitHub
      noreply address or `contact@kallistesoft.ca` (and decide whether to rewrite past history: force-push)
