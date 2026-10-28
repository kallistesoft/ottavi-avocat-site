# Follow-up

What's left before the new site replaces her current one on `www.vpavocat.com`.

Today: the new site is tested at https://new.vpavocat.com (GitHub Pages, `CNAME` + `robots.txt` block indexing).
`www.vpavocat.com` still serves her systeme.io site. Nothing switches until she approves the new site **and** her
systeme.io sales funnel is proven to work from it.

## 1. Connect the 3 sign-up forms to her systeme.io account

On her current site the forms are systeme.io opt-in blocks. Each one saves the visitor as a contact in her account,
shows a « Merci ! » page, and her account emails the document:

| Form | Fields | Thank-you page today |
| --- | --- | --- |
| Newsletter | Email (required) | `www.vpavocat.com/1a9862c6` |
| Guide « Immigrer au Canada » 2026 | Email, first name, last name (all required) | `www.vpavocat.com/fe0e99f8` |
| Canadian CV template | Email (required), first and last name (optional) | `www.vpavocat.com/e76a9f27` |

The forms and thank-you pages only exist on `www.vpavocat.com` (404 on `a5c6-contact.systeme.io`), so they stop
working when `www` switches. On the new site the forms only show a notice with her email (`assets/site.js`).

Plan (needs her systeme.io account signed in, in Chrome):

- [ ] Look at the 3 current opt-ins: tag, email and automation rule each one triggers
- [ ] Create 3 opt-in pages on `a5c6-contact.systeme.io` wired to the same automations, without changing the existing ones
- [ ] Check whether her plan lets us embed the systeme.io form on the new site; otherwise link the buttons to the pages
- [ ] Update `tools/content.py` / `tools/build.py`, rebuild, remove the « bientôt disponible » notice
- [ ] Test each form with a test email address: contact created, guide / CV / newsletter email received

Not an option: posting the forms to her systeme.io API, because the key would be public on a static site.

## 2. Content to confirm with her

- [ ] Address: the site shows Montréal (204, rue du Saint-Sacrement), but her bio says she lives in Alberta
- [ ] Photo: the portrait has a Gemini ✦ mark (looks AI-generated). A real photo is better for a lawyer's site
- [ ] Delivery time of the audit: « en moins d'une semaine » (her audit page) vs « 48 h » (her current home page)
- [ ] Review the English translations

## 3. Before switching `www`

- [ ] She approves https://new.vpavocat.com
- [ ] Real test purchase from the new site: audit (`auditpaiement` → payment → thank-you → confirmation email)
- [ ] Ebook purchase path checked (`guidealberta` → `guidealbertaachat` → `guidealbertamerci`)
- [ ] Find where she shares `www.vpavocat.com/audit_travailleur` or `/commande` (Instagram, emails, ads); add
      redirect pages to `a5c6-contact.systeme.io/auditpaiement` on the new site
- [ ] Update the old thank-you links if anything points to them (see section 1)

## 4. The switch (GoDaddy DNS: user types the SMS code to save)

- [ ] Repo: `CNAME` → `www.vpavocat.com`, delete `robots.txt`, rebuild, merge
- [ ] GitHub Pages custom domain → `www.vpavocat.com`
- [ ] GoDaddy: `www` CNAME → `kallistesoft.github.io` (today `d2m106fbjcka9h.cloudfront.net`)
- [ ] GoDaddy: bare domain → GitHub A records `185.199.108.153` to `185.199.111.153`. Today it redirects to microsoft.com
- [ ] Delete the `new` CNAME once `www` works
- [ ] Enforce HTTPS once the `www` certificate is issued
- [ ] Don't touch: MX, SPF, DMARC, Microsoft 365 records, systeme.io DKIM (`systemeio1/2._domainkey`), Amazon SES
- [ ] After: full purchase test again, and an email to `contact@vpavocat.com` still arrives

The full DNS list before any change is saved in the session notes (27 records, 2026-10-28).

## 5. Repo

- [ ] Commit author shows the user's personal Gmail and computer name. Set this repo's git email to the GitHub
      noreply address or `contact@kallistesoft.ca` (and decide whether to rewrite past history: force-push)
