# Follow-up

What's left before the new site replaces her current one on `www.vpavocat.com`.

Today: the new site is tested at https://new.vpavocat.com (GitHub Pages, `CNAME` + `robots.txt` block indexing).
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

## 3. Before switching `www`

- [ ] She approves https://new.vpavocat.com
- [ ] Real test purchase from the new site: worker audit (`commande` → `merci` → confirmation email)
- [ ] Student audit path checked (`d4acbe58` → `7d11da02`)
- [ ] Ebook purchase path checked (`guidealbertaachat` → `guidealbertamerci`)
- [ ] Find where she shares `www.vpavocat.com/audit_travailleur` or `/commande` (Instagram, emails, ads); add redirect
      pages on the new site to the `a5c6-contact.systeme.io` pages of the same name

## 4. The switch (GoDaddy DNS: user types the SMS code to save)

- [ ] Repo: `CNAME` → `www.vpavocat.com`, delete `robots.txt`, rebuild, merge
- [ ] GitHub Pages custom domain → `www.vpavocat.com`
- [ ] GoDaddy: `www` CNAME → `kallistesoft.github.io` (today `d2m106fbjcka9h.cloudfront.net`)
- [ ] GoDaddy: bare domain → GitHub A records `185.199.108.153` to `185.199.111.153`. Today it redirects to microsoft.com
- [ ] systeme.io forks (audit, CV, guideAlberta): header/footer links and favicon point to `new.vpavocat.com`; change them to `www`.
      The audit and guideAlberta heroes live in each page's footer code, and the prices there must be changed by hand
- [ ] Delete the `new` CNAME once `www` works
- [ ] Enforce HTTPS once the `www` certificate is issued
- [ ] Don't touch: MX, SPF, DMARC, Microsoft 365 records, systeme.io DKIM (`systemeio1/2._domainkey`), Amazon SES
- [ ] After: full purchase test again, and an email to `contact@vpavocat.com` still arrives

The full DNS list before any change is saved in the session notes (27 records, 2026-10-28).

## 5. Repo

- [ ] Commit author shows the user's personal Gmail and computer name. Set this repo's git email to the GitHub
      noreply address or `contact@kallistesoft.ca` (and decide whether to rewrite past history: force-push)
