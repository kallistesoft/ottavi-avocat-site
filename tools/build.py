"""Builds the Ottavi Law Firm Inc. site: writes the 10 pages (FR at the root, EN under /en/) from tools/content.py.

Usage: python3 tools/build.py

Templates use root-absolute links ("/services/"); they are rewritten to relative links on output so the site
works at a domain root or in a subfolder.
"""
import hashlib
import os
import posixpath
import re

from content import (AUDIT, AUDIT_STUDENT, CALENDLY, CALENDLY_FLASH, CV_FREE, EBOOK, EMAIL, GUIDE_FREE, INSTA, PAGES,
                     PHONE, TEL, T, URL)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def asset_version(rel_path):
    """Short hash of an asset, added as ?v= so browsers fetch the new file after each change."""
    with open(os.path.join(ROOT, rel_path), 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()[:8]

ICONS = {
    'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    'insta': '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8"/>',
    'pin': '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    'phone': '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    'cal': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    'shield': '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
    'arrow': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'check': '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    'menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
    'close': '<path d="M6 6l12 12M18 6L6 18"/>',
    'doc': '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
}


def ico(kind, size=20, cls='ico'):
    return (f'<svg class="{cls}" aria-hidden="true" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" '
            f'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">{ICONS[kind]}</svg>')


def li(items, cls=''):
    return ''.join(f'<li>{ico("check", 18) if cls == "checks" else ""}<span>{i}</span></li>' for i in items)


BRAND = ('<span class="brand-rule" aria-hidden="true"></span>'
         '<span class="brand-text"><span class="brand-name">Ottavi</span><span class="brand-sub">Law Firm Inc.</span></span>')


def header(lang, page):
    t, u = T[lang], URL[lang]
    nav = '\n'.join(
        f'        <a href="{u[k]}"' + (' aria-current="page"' if k == page else '') + f'>{t["nav"][k]}</a>'
        for k in PAGES[1:])

    def lang_item(code):
        if code == lang:
            return f'<span lang="{code}" aria-current="true">{code.upper()}</span>'
        return f'<a href="{URL[code][page]}" lang="{code}" hreflang="{code}">{code.upper()}</a>'

    return f'''<a class="skip" href="#main">{t["skip"]}</a>
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="{u["home"]}" aria-label="{t["homeLabel"]}">{BRAND}</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" data-open="{t["menu"]}" data-close="{t["close"]}">
      {ico("menu", 22, "ico ico-open")}{ico("close", 22, "ico ico-close")}<span class="menu-label">{t["menu"]}</span>
    </button>
    <div class="header-panel" id="site-nav">
      <nav class="nav" aria-label="{t["navLabel"]}">
{nav}
      </nav>
      <div class="header-actions">
        <div class="lang" role="group" aria-label="{t["langLabel"]}">{lang_item("fr")}<span class="sep" aria-hidden="true"></span>{lang_item("en")}</div>
        <a class="btn btn-primary btn-sm" href="{CALENDLY}" rel="noopener">{t["cta"]}</a>
      </div>
    </div>
  </div>
</header>'''


def footer(lang):
    t, u = T[lang], URL[lang]
    links = '\n'.join(f'        <a href="{u[k]}">{t["nav"][k]}</a>' for k in PAGES)
    return f'''<footer class="site-footer">
  <div class="wrap">
    <div class="footer-cols">
      <div class="footer-brand">
        <a class="brand brand-light" href="{u["home"]}" aria-label="{t["homeLabel"]}">{BRAND}</a>
        <p>{t["tagline"]}</p>
      </div>
      <nav class="footer-nav" aria-label="{t["footNav"]}">
        <h2 class="footer-title">{t["footNavTitle"]}</h2>
{links}
      </nav>
      <div class="footer-contact">
        <h2 class="footer-title">{t["footContact"]}</h2>
        <a href="{TEL}">{ico("phone", 18)}{PHONE}</a>
        <a href="mailto:{EMAIL}">{ico("mail", 18)}{EMAIL}</a>
        <a href="{INSTA}">{ico("insta", 18)}@poughon_immigration</a>
        <address>{t["address"]}</address>
      </div>
    </div>
    <div class="footer-bottom">
      <span>{t["legal"]}</span>
      <span>© 2026 Ottavi Law Firm Inc.</span>
    </div>
  </div>
</footer>
<div class="mobile-bar">
  <a class="btn btn-ghost" href="{AUDIT}" rel="noopener">{t["mobileAudit"]}</a>
  <a class="btn btn-primary" href="{CALENDLY}" rel="noopener">{t["mobileBook"]}</a>
</div>'''


def page_head(eyebrow, title, lead=''):
    lead_html = f'<p class="lead">{lead}</p>' if lead else ''
    return f'''<section class="page-head">
  <div class="wrap">
    <span class="eyebrow">{eyebrow}</span>
    <h1>{title}</h1>
    {lead_html}
  </div>
</section>'''


def section_head(eyebrow, title, lead='', center=False):
    lead_html = f'<p class="lead">{lead}</p>' if lead else ''
    return f'''<div class="section-head{' center' if center else ''}">
      <span class="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {lead_html}
    </div>'''


def price(amount, unit='', note=''):
    unit_html = f'<span class="price-unit">{unit}</span>' if unit else ''
    note_html = f'<span class="price-note">{note}</span>' if note else ''
    return f'<div class="price"><span class="price-amount">{amount}</span>{unit_html}{note_html}</div>'


def offers(lang):
    """The ways to work with her, from the lightest to the most complete."""
    t, u = T[lang], URL[lang]
    return [
        dict(key='audit', need=t['needs']['audit'], title=t['audit'], blurb=t['auditBlurb'],
             price=price(t['auditPrice'], t['auditUnit'], t['auditEuro']),
             href=AUDIT, cta=t['auditCardCta']),
        dict(key='student', need=t['needs']['student'], title=t['student'], blurb=t['studentBlurb'],
             price=price(t['auditPrice'], t['auditUnit']),
             href=AUDIT_STUDENT, cta=t['studentCardCta']),
        dict(key='flash', need=t['needs']['flash'], title=t['flash'], blurb=t['flashBlurb'],
             price=price(t['flashPrice'], t['taxes']), href=CALENDLY_FLASH, cta=t['consultCta']),
        dict(key='consult', need=t['needs']['consult'], title=t['consult'], blurb=t['consultBlurb'],
             price=price(t['consultPrice'], t['taxes']), href=CALENDLY, cta=t['consultCta'], featured=True),
        dict(key='mandate', need=t['needs']['mandate'], title=t['mandate'], blurb=t['mandateBlurb'],
             price=price(t['mandatePrice']), href=u['contact'], cta=t['mandateCta']),
    ]


def form_note(lang):
    t = T[lang]
    return f'<p class="form-msg" role="status" hidden>{t["formPending"]} <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>'


def resource_cards(lang, heading='h3'):
    t = T[lang]
    return f'''<div class="res-grid">
      <article class="res-card">
        <div class="res-thumb guide" aria-hidden="true"><span>Immigrer au Canada</span><small>Édition 2026</small></div>
        <div class="res-body">
          <span class="tag">{t["free"]}</span>
          <{heading}>{t["guide"]}</{heading}>
          <ul class="checks">{li(t["guidePoints"], "checks")}</ul>
          <a class="link-arrow" href="{GUIDE_FREE}" rel="noopener">{t["guideCta"]}{ico("arrow", 18)}</a>
        </div>
      </article>
      <article class="res-card">
        <div class="res-thumb cv" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="res-body">
          <span class="tag">{t["free"]}</span>
          <{heading}>{t["cv"]}</{heading}>
          <a class="link-arrow" href="{CV_FREE}" rel="noopener">{t["cvCta"]}{ico("arrow", 18)}</a>
        </div>
      </article>
    </div>'''


def home(lang):
    t, u = T[lang], URL[lang]
    trust_icons = ['shield', 'clock', 'globe']
    trust = ''.join(f'<li>{ico(i, 22)}<span>{s}</span></li>' for i, s in zip(trust_icons, t['trust']))
    rows = ''
    for o in offers(lang):
        external = '' if o['href'].startswith('/') else ' rel="noopener"'
        rows += f'''
      <article class="choose-row{' featured' if o.get('featured') else ''}">
        <p class="choose-need">{o["need"]}</p>
        <div class="choose-offer">
          <h3>{o["title"]}</h3>
          {o["price"]}
        </div>
        <a class="btn {'btn-primary' if o.get('featured') else 'btn-outline'}" href="{o["href"]}"{external}>{o["cta"]}</a>
      </article>'''
    return f'''<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-text">
      <span class="eyebrow">{t["eyebrow"]}</span>
      <h1>{t["heroTitle"]}</h1>
      <p class="lead">{t["tagline"]}</p>
      <div class="btn-row">
        <a class="btn btn-primary btn-lg" href="{u["services"]}#consultations">{t["heroPrimary"]}</a>
        <a class="btn btn-outline btn-lg" href="{AUDIT}" rel="noopener">{t["heroSecondary"]}</a>
      </div>
    </div>
    <figure class="hero-photo">
      <img src="/assets/vanessa-poughon.jpg" alt="{t["photoLabel"]}" width="800" height="800" fetchpriority="high">
    </figure>
  </div>
  <div class="wrap">
    <ul class="trust">{trust}</ul>
  </div>
</section>

<section class="section">
  <div class="wrap">
    {section_head(t["chooseEyebrow"], t["chooseTitle"], t["chooseLead"])}
    <div class="choose">{rows}
    </div>
    <a class="link-arrow" href="{u["services"]}">{t["seeAll"]}{ico("arrow", 18)}</a>
  </div>
</section>

<section class="section dark">
  <div class="wrap about">
    <div class="about-text">
      <span class="eyebrow">{t["aboutEyebrow"]}</span>
      <h2>{"Me " if lang == "fr" else ""}Vanessa Poughon</h2>
      <p>{t["bio"][0]}</p>
      <p>{t["bio"][1]}</p>
      <a class="link-arrow" href="{u["cabinet"]}">{t["aboutCta"]}{ico("arrow", 18)}</a>
    </div>
    <blockquote class="about-quote">{t["bio"][-1]}<cite>{"Me " if lang == "fr" else ""}Vanessa Poughon</cite></blockquote>
  </div>
</section>

<section class="section">
  <div class="wrap ebook-promo">
    <img class="ebook-cover" src="/assets/ebook-alberta.jpg" alt="{t["ebookCover"]}" width="600" height="848" loading="lazy">
    <div>
      <span class="eyebrow">{t["ebookEyebrow"]} · {t["ebookSub"]}</span>
      <h2>{t["ebook"]}</h2>
      <p class="lead">{t["ebookBlurb"]}</p>
      {price(t["ebookPrice"], "CAD")}
      <div class="btn-row">
        <a class="btn btn-primary" href="{EBOOK}" rel="noopener">{t["ebookCta"]}</a>
        <a class="btn btn-text" href="{u["services"]}#alberta">{t["ebookMore"]}{ico("arrow", 18)}</a>
      </div>
      <p class="fine">{t["notAlberta"]}</p>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    {section_head(t["resEyebrow"], t["resTitle"], t["resLead"])}
    {resource_cards(lang)}
  </div>
</section>

<section class="section">
  <div class="wrap newsletter">
    <div>
      <span class="eyebrow">Newsletter</span>
      <h2>{t["nlBlurb"]}</h2>
    </div>
    <form class="inline-form" data-pending>
      <label class="sr-only" for="nl-email">{t["email"]}</label>
      <input id="nl-email" type="email" name="email" required autocomplete="email" placeholder="{t["email"]}">
      <button class="btn btn-primary" type="submit">{t["subscribe"]}</button>
      {form_note(lang)}
    </form>
  </div>
</section>

{final_cta(lang)}'''


def final_cta(lang):
    t, u = T[lang], URL[lang]
    return f'''<section class="final-cta">
  <div class="wrap final-inner">
    <div>
      <h2>{t["finalTitle"]}</h2>
      <p>{t["finalLead"]}</p>
    </div>
    <div class="btn-row">
      <a class="btn btn-light btn-lg" href="{u["services"]}#consultations">{t["heroPrimary"]}</a>
      <a class="btn btn-ghost-light btn-lg" href="mailto:{EMAIL}">{t["mailMe"]}</a>
    </div>
  </div>
</section>'''


def services(lang):
    t, u = T[lang], URL[lang]
    steps = ''.join(f'<li><span class="n">{i}</span><span>{s}</span></li>' for i, s in enumerate(t["auditSteps"], 1))
    chips = [('audit', t['audit']), ('audit-etudiant', t['student']), ('consultations', t['consult']), ('flash', t['flash']), ('mandat', t['mandate']),
             ('alberta', 'Ebook')]
    chip_html = ''.join(f'<a href="#{a}">{label}</a>' for a, label in chips)

    def offer_block(anchor, title, body, price_html, btn_href, btn_label, extra='', side_extra='', tint=False, dark=False):
        external = '' if btn_href.startswith('/') else ' rel="noopener"'
        return f'''<section id="{anchor}" class="section offer{' tint' if tint else ''}{' dark' if dark else ''}">
  <div class="wrap offer-grid">
    <div class="offer-main">
      <h2>{title}</h2>
      {body}
      {extra}
    </div>
    <aside class="price-card">
      {price_html}
      {side_extra}
      <a class="btn btn-primary" href="{btn_href}"{external}>{btn_label}</a>
    </aside>
  </div>
</section>'''

    audit = offer_block(
        'audit', t['audit'], f'<p class="lead">{t["auditPitch"]}</p>',
        price(t['auditPrice'], t['auditUnit'], t['auditEuro']), AUDIT, t['auditCta'],
        extra=f'''<h3 class="mini-title">{t["howTitle"]}</h3>
      <ol class="steps">{steps}</ol>
      <p class="fine">{t["auditDisclaimer"]}</p>''',
        side_extra=f'<p class="callout">{t["auditBonus"]}</p>')
    student = offer_block(
        'audit-etudiant', t['student'], f'<p class="lead">{t["studentPitch"]}</p>',
        price(t['auditPrice'], t['auditUnit']), AUDIT_STUDENT, t['studentCta'], tint=True,
        extra=f'''<h3 class="mini-title">{t["studentListTitle"]}</h3>
      <ul class="checks">{li(t["studentPoints"], "checks")}</ul>''',
        side_extra=f'<p class="callout">{t["studentBonus"]}</p>')
    consult = offer_block('consultations', t['consult'], f'<p class="lead">{t["consultBlurb"]}</p>',
                          price(t['consultPrice'], t['taxes']), CALENDLY, t['consultCta'], dark=True)
    flash = offer_block('flash', t['flash'], f'<p class="lead">{t["flashBlurb"]}</p>',
                        price(t['flashPrice'], t['taxes']), CALENDLY_FLASH, t['consultCta'])
    mandate = offer_block('mandat', t['mandate'], f'<p class="lead">{t["mandateBlurb"]}</p>',
                          price(t['mandatePrice']), u['contact'], t['mandateCta'], tint=True,
                          side_extra=f'<p class="fine">{t["mandateMore"]}</p>')
    return f'''{page_head(t["nav"]["services"], t["chooseTitle"], t["servicesLead"])}

<nav class="chips-bar" aria-label="{t["jump"]}">
  <div class="wrap chips">{chip_html}</div>
</nav>

{audit}

{student}

{consult}

{flash}

{mandate}

<section id="alberta" class="section">
  <div class="wrap ebook-detail">
    <img class="ebook-cover" src="/assets/ebook-alberta.jpg" alt="{t["ebookCover"]}" width="600" height="848" loading="lazy">
    <div class="offer-main">
      <span class="eyebrow">{t["ebookEyebrow"]} · {t["ebookSub"]}</span>
      <h2>{t["ebook"]}</h2>
      <p class="lead">{t["ebookPitch"]}</p>
      <h3 class="mini-title">{t["ebookListTitle"]}</h3>
      <ul class="checks">{li(t["ebookPoints"], "checks")}</ul>
      <p class="callout">{t["ebookBonus"]}</p>
      <div class="buy-row">
        <div class="price"><span class="price-was">{t["ebookValue"]}</span><span class="price-amount">{t["ebookPrice"]}</span><span class="price-unit">CAD</span></div>
        <a class="btn btn-primary" href="{EBOOK}" rel="noopener">{t["ebookCta"]}</a>
      </div>
      <p class="fine">{t["notAlberta"]}</p>
    </div>
  </div>
</section>

{final_cta(lang)}'''


def ressources(lang):
    t = T[lang]
    return f'''{page_head(t["resEyebrow"], t["nav"]["ressources"], t["resourcesLead"])}

<section id="guide" class="section">
  <div class="wrap res-info">
    <div class="res-thumb guide lg" aria-hidden="true"><span>Immigrer au Canada</span><small>Édition 2026</small></div>
    <div>
      <span class="tag">{t["free"]}</span>
      <h2>{t["guide"]}</h2>
      <ul class="checks">{li(t["guidePoints"], "checks")}</ul>
      <a class="btn btn-primary" href="{GUIDE_FREE}" rel="noopener">{t["guideCta"]}</a>
      <p class="fine">{t["resNote"]}</p>
    </div>
  </div>
</section>

<section id="cv" class="section tint">
  <div class="wrap res-info">
    <div class="res-thumb cv lg" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
    <div>
      <span class="tag">{t["free"]}</span>
      <h2>{t["cv"]}</h2>
      <a class="btn btn-primary" href="{CV_FREE}" rel="noopener">{t["cvCta"]}</a>
      <p class="fine">{t["resNote"]}</p>
    </div>
  </div>
</section>

{final_cta(lang)}'''


def cabinet(lang):
    t = T[lang]
    bio = ''.join(f'<p>{b}</p>' for b in t['bio'][:-1])
    areas = ''.join(f'<li>{a}</li>' for a in t['areas'])
    return f'''{page_head(t["nav"]["cabinet"], "Ottavi Law Firm Inc.", t["cabinetLead"])}

<section class="section">
  <div class="wrap lawyer">
    <figure class="lawyer-photo">
      <img src="/assets/vanessa-poughon.jpg" alt="{t["photoLabel"]}" width="800" height="800">
    </figure>
    <div class="lawyer-text">
      <span class="eyebrow">{t["specialty"]}</span>
      <h2>{"Me " if lang == "fr" else ""}Vanessa Poughon</h2>
      {bio}
      <blockquote>{t["bio"][-1]}</blockquote>
      <h3 class="mini-title">{t["areasTitle"]}</h3>
      <ul class="pills">{areas}</ul>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <dl class="facts">
      <div><dt>{t["barLabel"]}</dt><dd>{t["bar"]}<br><span class="muted">{t["notAlberta"]}</span></dd></div>
      <div><dt>{t["addrLabel"]}</dt><dd><address>{t["address"]}</address></dd></div>
      <div><dt>{t["phoneLabel"]}</dt><dd><a href="{TEL}">{PHONE}</a></dd></div>
      <div><dt>{t["mailLabel"]}</dt><dd><a href="mailto:{EMAIL}">{EMAIL}</a></dd></div>
    </dl>
  </div>
</section>

{final_cta(lang)}'''


def contact(lang):
    t, u = T[lang], URL[lang]
    return f'''{page_head(t["nav"]["contact"], t["nav"]["contact"], t["contactLead"])}

<section class="section">
  <div class="wrap contact-grid">
    <div class="contact-book">
      <span class="eyebrow">{t["bookTitle"]}</span>
      <h2>{t["withV"]}</h2>
      <p class="muted">{t["remote"]}</p>
      <div class="book-list">
        <a class="book-item" href="{CALENDLY}" rel="noopener">
          <span><strong>{t["consult"]}</strong>{price(t["consultPrice"], t["taxes"])}</span>{ico("arrow", 20)}
        </a>
        <a class="book-item" href="{CALENDLY_FLASH}" rel="noopener">
          <span><strong>{t["flash"]}</strong>{price(t["flashPrice"], t["taxes"])}</span>{ico("arrow", 20)}
        </a>
        <a class="book-item" href="{AUDIT}" rel="noopener">
          <span><strong>{t["audit"]}</strong>{price(t["auditPrice"], t["auditUnit"])}</span>{ico("arrow", 20)}
        </a>
        <a class="book-item" href="{AUDIT_STUDENT}" rel="noopener">
          <span><strong>{t["student"]}</strong>{price(t["auditPrice"], t["auditUnit"])}</span>{ico("arrow", 20)}
        </a>
      </div>
    </div>
    <div class="contact-ways">
      <a class="way" href="mailto:{EMAIL}">{ico("mail", 24)}<span><strong>{t["writeTitle"]}</strong>{EMAIL}</span></a>
      <a class="way" href="{TEL}">{ico("phone", 24)}<span><strong>{t["callTitle"]}</strong>{PHONE}</span></a>
      <a class="way" href="{INSTA}" rel="noopener">{ico("insta", 24)}<span><strong>Instagram</strong>@poughon_immigration</span></a>
      <div class="way">{ico("pin", 24)}<span><strong>{t["findTitle"]}</strong><address>{t["address"]}</address></span></div>
    </div>
  </div>
</section>'''


BODY = {'home': home, 'services': services, 'ressources': ressources, 'cabinet': cabinet, 'contact': contact}


def render(lang, page):
    t = T[lang]
    title = t['titles'][page] if page == 'home' else f'{t["titles"][page]} — Ottavi Law Firm Inc.'
    alts = '\n'.join(f'<link rel="alternate" hreflang="{code}" href="{URL[code][page]}">' for code in ('fr', 'en'))
    return f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{t["desc"]}">
<meta name="theme-color" content="#FAF7F2">
{alts}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/site.css?v={asset_version("assets/site.css")}">
<script src="/assets/site.js?v={asset_version("assets/site.js")}" defer></script>
</head>
<body class="page-{page}">
{header(lang, page)}
<main id="main">
{BODY[page](lang)}
</main>
{footer(lang)}
</body>
</html>
'''


def relative_links(html, here):
    """Rewrites href/src="/..." to paths relative to the page at URL `here`."""
    def rel(m):
        target = m.group(2)
        path, _, frag = target.partition('#')
        r = posixpath.relpath(path, here)
        if path.endswith('/'):
            r = '' if r == '.' else r + '/'
        if not r and not frag:
            r = './'
        return f'{m.group(1)}="{r}{"#" + frag if frag else ""}"'
    return re.sub(r'(href|src)="(/[^"]*)"', rel, html)


def main():
    for lang in ('fr', 'en'):
        for page in PAGES:
            here = URL[lang][page]
            path = os.path.join(ROOT, here.strip('/'), 'index.html')
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'w') as f:
                f.write(relative_links(render(lang, page), here))
            print(os.path.relpath(path, ROOT))


if __name__ == '__main__':
    main()
