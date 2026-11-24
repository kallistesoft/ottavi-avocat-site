// Intake form engine: answers stay on the client's device.
// - autosave in this browser (localStorage), restored on the next visit;
// - a progress file the client saves and reopens (other device or browser);
// - the PDF is built here (pdf-lib, loaded only then) and the client emails it.
// The page's CSP has connect-src 'none' and form-action 'none': nothing can be sent anywhere.
(function () {
  'use strict';
  const DEF = window.OTTAVI_FORM;
  const root = document.getElementById('intake');
  if (!DEF || !root) return;

  const LANG = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const LOCALE = LANG === 'fr' ? 'fr-CA' : 'en-CA';
  const EMAIL = root.dataset.email || '';
  const ASSETS = root.dataset.assets || '/assets/formulaire/';
  const KEY = DEF.id + '-v' + DEF.version;
  const N = DEF.sections.length;

  const UI = {
    fr: {
      resumeTitle: 'Vous reprenez votre questionnaire',
      resumeText: (date, done) => ` commencé le ${date}. ${done} section${done > 1 ? 's' : ''} sur ${N} terminée${done > 1 ? 's' : ''}.`,
      noStorage: "Ce navigateur n'enregistre pas vos réponses (navigation privée ?). Utilisez « Enregistrer mon avancement » avant de partir pour ne rien perdre.",
      statusIdle: 'Vos réponses s’enregistrent automatiquement sur cet appareil.',
      statusNow: 'Enregistré automatiquement · à l’instant',
      statusAgo: (txt) => `Enregistré automatiquement · il y a ${txt}`,
      statusOff: 'Non enregistré dans ce navigateur',
      sec: (n) => `${n} s`, min: (n) => `${n} min`, hr: (n) => `${n} h`,
      step: (n) => `Section ${n} sur ${N}`,
      prev: 'Précédent', next: 'Suivant', makePdf: 'Créer mon PDF',
      saveFile: 'Enregistrer mon avancement (fichier)', loadFile: 'Reprendre depuis un fichier', clear: 'Effacer mes réponses',
      fileSaved: (name) => `Avancement enregistré dans « ${name} ».`,
      fileDownloaded: (name) => `Avancement enregistré dans vos Téléchargements (« ${name} »).`,
      fileLoaded: 'Vos réponses ont été reprises depuis le fichier.',
      badFile: "Ce fichier n'est pas un avancement de ce questionnaire.",
      otherVersion: "Ce fichier vient d'une autre version du questionnaire et ne peut pas être repris.",
      choose: 'Choisir…',
      required: 'Cette réponse est obligatoire.', email: 'Indiquez une adresse courriel valide, par exemple nom@exemple.com.',
      date: 'Indiquez une date complète.', notFuture: 'Cette date ne peut pas être après aujourd’hui.', future: 'Cette date doit être après aujourd’hui.', notPast: 'Cette date doit être aujourd’hui ou plus tard.', after: 'Cette date doit être après la date de début.', notBefore: 'Cette date ne peut pas être avant la date de début.', month: 'Indiquez le mois et l’année.', format: 'Vérifiez le format de cette réponse.', checked: 'Oui', number: (min, max) => `Indiquez un nombre entre ${min} et ${max}.`,
      remove: 'Retirer', item: (label, n) => `${label} ${n}`,
      jump: 'Aller à une section', finished: 'PDF', sectionsDone: (n, all) => `${n} section${n > 1 ? 's' : ''} sur ${all} terminée${n > 1 ? 's' : ''}`,
      missingTitle: 'Il manque quelques réponses avant de créer le PDF :',
      working: 'Création du PDF…',
      pdfError: "Le PDF n'a pas pu être créé. Réessayez ; si cela continue, enregistrez votre avancement et écrivez-nous.",
      doneTitle: 'Votre PDF est prêt', doneLead: "Il a été créé sur votre appareil. Rien n'a été envoyé sur Internet.",
      doneWhere: (pages) => `Dans vos Téléchargements · ${pages} page${pages > 1 ? 's' : ''}`,
      sendTitle: 'Dernière étape : envoyez-le à Me Poughon',
      sendSteps: ['Cliquez sur « Écrire le courriel » ci-dessous.', 'Joignez le PDF depuis vos Téléchargements.', 'Envoyez.'],
      writeMail: 'Écrire le courriel', again: 'Télécharger à nouveau', edit: 'Modifier mes réponses', clearDevice: 'Effacer mes réponses de cet appareil',
      doneNote: (email) => `Adresse : ${email}. Vos réponses restent enregistrées sur cet appareil jusqu'à ce que vous les effaciez.`,
      mailSubject: (name) => `Questionnaire – ${name}`,
      mailBody: (name) => `Bonjour Me Poughon,\n\nVous trouverez en pièce jointe mon questionnaire rempli.\n\n${name}`,
      clearTitle: 'Effacer toutes vos réponses ?',
      clearText: 'Elles seront supprimées de cet appareil. Un fichier d’avancement déjà enregistré n’est pas touché.',
      clearYes: 'Effacer', cancel: 'Annuler', cleared: 'Vos réponses ont été effacées de cet appareil.',
      conflictTitle: 'Quelles réponses garder ?',
      conflictText: (a, b) => `Ce navigateur contient déjà des réponses (modifiées le ${a}). Le fichier date du ${b}.`,
      useFile: 'Utiliser le fichier', keepCurrent: 'Garder celles du navigateur',
      pdfFirm: 'Ottavi Law Firm Inc.', pdfFilled: (name, date) => `${name} · rempli le ${date}`, pdfFoot: 'Ottavi Law Firm Inc. · Confidentiel',
      pdfAttach: 'Réponses du questionnaire (données, pour import)', pdfClip: (f) => `Données jointes : ${f}`, pdfName: 'Questionnaire', progressName: 'questionnaire-ottavi',
      noName: 'Sans nom', empty: '—'
    },
    en: {
      resumeTitle: 'Welcome back to your questionnaire',
      resumeText: (date, done) => `, started on ${date}. ${done} of ${N} section${done === 1 ? '' : 's'} done.`,
      noStorage: "This browser doesn't save your answers (private browsing?). Use “Save my progress” before you leave so nothing is lost.",
      statusIdle: 'Your answers save automatically on this device.',
      statusNow: 'Saved automatically · just now',
      statusAgo: (txt) => `Saved automatically · ${txt} ago`,
      statusOff: 'Not saved in this browser',
      sec: (n) => `${n} s`, min: (n) => `${n} min`, hr: (n) => `${n} h`,
      step: (n) => `Section ${n} of ${N}`,
      prev: 'Back', next: 'Next', makePdf: 'Create my PDF',
      saveFile: 'Save my progress (file)', loadFile: 'Resume from a file', clear: 'Clear my answers',
      fileSaved: (name) => `Progress saved in “${name}”.`,
      fileDownloaded: (name) => `Progress saved in your Downloads (“${name}”).`,
      fileLoaded: 'Your answers were restored from the file.',
      badFile: "This file isn't a progress file for this questionnaire.",
      otherVersion: 'This file comes from another version of the questionnaire and cannot be restored.',
      choose: 'Choose…',
      required: 'This answer is required.', email: 'Enter a valid email address, for example name@example.com.',
      date: 'Enter a full date.', notFuture: 'This date cannot be after today.', future: 'This date must be after today.', notPast: 'This date must be today or later.', after: 'This date must be after the start date.', notBefore: 'This date cannot be before the start date.', month: 'Enter the month and year.', format: 'Check the format of this answer.', checked: 'Yes', number: (min, max) => `Enter a number between ${min} and ${max}.`,
      remove: 'Remove', item: (label, n) => `${label} ${n}`,
      jump: 'Go to a section', finished: 'PDF', sectionsDone: (n, all) => `${n} of ${all} section${all > 1 ? 's' : ''} done`,
      missingTitle: 'A few answers are missing before the PDF can be created:',
      working: 'Creating the PDF…',
      pdfError: "The PDF couldn't be created. Try again; if it keeps failing, save your progress and write to us.",
      doneTitle: 'Your PDF is ready', doneLead: 'It was created on your device. Nothing was sent over the Internet.',
      doneWhere: (pages) => `In your Downloads · ${pages} page${pages > 1 ? 's' : ''}`,
      sendTitle: 'Last step: send it to Ms. Poughon',
      sendSteps: ['Click “Write the email” below.', 'Attach the PDF from your Downloads.', 'Send.'],
      writeMail: 'Write the email', again: 'Download again', edit: 'Edit my answers', clearDevice: 'Clear my answers from this device',
      doneNote: (email) => `Address: ${email}. Your answers stay saved on this device until you clear them.`,
      mailSubject: (name) => `Questionnaire – ${name}`,
      mailBody: (name) => `Hello Ms. Poughon,\n\nPlease find my completed questionnaire attached.\n\n${name}`,
      clearTitle: 'Clear all your answers?',
      clearText: 'They will be deleted from this device. A progress file you already saved is not affected.',
      clearYes: 'Clear', cancel: 'Cancel', cleared: 'Your answers were cleared from this device.',
      conflictTitle: 'Which answers should we keep?',
      conflictText: (a, b) => `This browser already holds answers (changed on ${a}). The file is from ${b}.`,
      useFile: 'Use the file', keepCurrent: "Keep this browser's answers",
      pdfFirm: 'Ottavi Law Firm Inc.', pdfFilled: (name, date) => `${name} · completed on ${date}`, pdfFoot: 'Ottavi Law Firm Inc. · Confidential',
      pdfAttach: 'Questionnaire answers (data, for import)', pdfClip: (f) => `Attached data: ${f}`, pdfName: 'Questionnaire', progressName: 'ottavi-questionnaire',
      noName: 'No name', empty: '—'
    }
  }[LANG];

  const L = (o) => (typeof o === 'string' ? o : o ? o[LANG] || o.fr : '');
  const LISTS = window.IRCC_LISTS || {};
  // Fields whose value picks another field's list (province -> cities): changing them redraws the section.
  const LIST_KEYS = new Set();
  (function collect(fields) {
    for (const f of fields) {
      if (f.listBy) LIST_KEYS.add(f.listBy);
      if (f.fields) collect(f.fields);
    }
  })(DEF.sections.flatMap((s) => s.fields));

  // ---------- state and storage ----------
  const storageOk = (() => {
    try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; } catch (e) { return false; }
  })();

  function fresh() {
    return { formId: DEF.id, version: DEF.version, startedAt: new Date().toISOString(), updatedAt: null, section: 0, touched: {}, answers: {} };
  }
  function readable(s) {
    return s && s.formId === DEF.id && s.answers && typeof s.answers === 'object' && !Array.isArray(s.answers);
  }
  function loadStored() {
    if (!storageOk) return null;
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null');
      return readable(s) && s.version === DEF.version ? s : null;
    } catch (e) { return null; }
  }

  const stored = loadStored();
  let state = stored || fresh();
  state.touched = state.touched || {};
  state.section = Math.min(Math.max(state.section | 0, 0), N - 1);
  let lastSaved = stored && stored.updatedAt ? Date.parse(stored.updatedAt) : 0;
  let saveTimer = null;
  let fileHandle = null;
  let lastPdf = null;

  function persist() {
    clearTimeout(saveTimer);
    saveTimer = null;
    if (!storageOk) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      lastSaved = Date.now();
    } catch (e) { /* quota or blocked: the progress file still works */ }
    renderStatus();
  }
  function changed() {
    state.updatedAt = new Date().toISOString();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 400);
  }
  const flush = () => { if (saveTimer) persist(); };
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });

  function hasAnswers(answers) {
    return Object.keys(answers).some((k) => {
      const v = answers[k];
      if (Array.isArray(v)) return v.some((item) => item && Object.keys(item).some((f) => String(item[f] || '').trim()));
      return String(v == null ? '' : v).trim() !== '';
    });
  }

  // ---------- answers by path ("fullName", "jobs.0.title") ----------
  function getAt(path) {
    const parts = path.split('.');
    let v = state.answers;
    for (const p of parts) { if (v == null) return ''; v = v[p]; }
    return v == null ? '' : v;
  }
  function rawAt(path) {
    let v = state.answers;
    for (const p of path.split('.')) { if (v == null) return undefined; v = v[p]; }
    return v;
  }
  function setAt(path, value) {
    const parts = path.split('.');
    let o = state.answers;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (o[p] == null) o[p] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      o = o[p];
    }
    o[parts[parts.length - 1]] = value;
  }
  function items(field) {
    let list = state.answers[field.id];
    if (!Array.isArray(list)) list = state.answers[field.id] = [];
    while (list.length < (field.min || 0)) list.push({});
    return list;
  }

  // ---------- rules ----------
  function valueIn(key, scope) {
    return scope && Object.prototype.hasOwnProperty.call(scope, key) ? scope[key] : state.answers[key];
  }
  // showIf: one condition or a list (shown if any matches). { field, in: [...] } or { field, notIn: [...] }.
  function shown(field, scope) {
    if (!field.showIf) return true;
    return [].concat(field.showIf).some((c) => {
      const v = valueIn(c.field, scope);
      return c.in ? c.in.indexOf(v) !== -1 : c.notIn.indexOf(v == null ? '' : v) === -1;
    });
  }
  function optionsOf(field, scope) {
    if (field.options) return field.options;
    let list = LISTS[field.list] || [];
    if (field.listBy) list = list[valueIn(field.listBy, scope)] || [];
    return list.map(([value, label]) => ({ value, label }));
  }
  // Visible answerable fields of a section, flattened: [{ field, path, scope, owner }]
  function leaves(section) {
    const out = [];
    // where: labels of the group or repeat item a field sits in, for the "missing answers" list.
    const walk = (fields, prefix, scope, where) => {
      for (const f of fields) {
        if (!shown(f, scope)) continue;
        if (f.type === 'note' || f.type === 'fixed') continue;
        if (f.type === 'group') walk(f.fields, prefix, scope, where.concat(L(f.label)));
        else if (f.type === 'repeat') items(f).forEach((item, i) => walk(f.fields, `${prefix}${f.id}.${i}.`, item, where.concat(UI.item(L(f.label), i + 1))));
        else out.push({ field: f, path: prefix + f.id, scope, where });
      }
    };
    walk(section.fields, '', null, []);
    return out;
  }
  function errorFor(field, value, scope) {
    const v = String(value == null ? '' : value).trim();
    // requiredUnless: 'id' = required when that other answer is empty (e.g. street number unless a P.O. box).
    if (!v && field.requiredUnless && !String(valueIn(field.requiredUnless, scope) || '').trim()) return UI.required;
    if (!v) return field.required ? (field.type === 'date' ? UI.date : field.type === 'month' ? UI.month : UI.required) : '';
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return UI.email;
    if (field.type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(v)) return UI.date;
    // IRCC's own date rules (from the forms' validation scripts):
    // notFuture = today or before; future = after today; notPast = today or later;
    // after: 'id' = after that date; notBefore: 'id' = that date or later (same item, or top level).
    if (field.type === 'date') {
      const now = today();
      if (field.notFuture && v > now) return UI.notFuture;
      if (field.future && v <= now) return field.futureMsg ? L(field.futureMsg) : UI.future;
      if (field.notPast && v < now) return UI.notPast;
      const other = (id) => String(valueIn(id, scope) || '').trim();
      if (field.after && other(field.after) && v <= other(field.after)) return UI.after;
      if (field.notBefore && other(field.notBefore) && v < other(field.notBefore)) return UI.notBefore;
      if (field.notAfter && other(field.notAfter) && v > other(field.notAfter)) return field.notAfterMsg ? L(field.notAfterMsg) : UI.format;
    }
    if (field.type === 'month' && !/^\d{4}-\d{2}$/.test(v)) return UI.month;
    if (field.pattern && !new RegExp(field.pattern).test(v)) return field.patternMsg ? L(field.patternMsg) : UI.format;
    if (field.type === 'number') {
      const n = Number(v);
      const min = field.min != null ? field.min : -Infinity;
      const max = field.max != null ? field.max : Infinity;
      if (!Number.isFinite(n) || n < min || n > max) return UI.number(field.min, field.max);
    }
    return '';
  }
  function problems(section) {
    return leaves(section)
      .map((l) => ({ ...l, msg: errorFor(l.field, getAt(l.path), l.scope) }))
      .filter((l) => l.msg);
  }
  const isDone = (section) => problems(section).length === 0;
  const doneCount = () => DEF.sections.filter(isDone).length;

  // ---------- formatting ----------
  function fmtDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    if (!m) return iso || '';
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
  }
  const fmtStamp = (iso) => fmtDate(new Date(iso || Date.now()).toISOString().slice(0, 10));
  function fmtMonth(v) {
    const m = /^(\d{4})-(\d{2})$/.exec(v || '');
    if (!m) return v || '';
    return new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(+m[1], +m[2] - 1, 1)));
  }
  function display(field, value, scope) {
    const v = String(value == null ? '' : value).trim();
    if (!v) return field.empty ? L(field.empty) : UI.empty;
    if (field.type === 'checkbox') return UI.checked;
    if (field.options || field.list) {
      const o = optionsOf(field, scope).find((x) => x.value === v);
      return o ? L(o.label) : v;
    }
    if (field.type === 'date') return fmtDate(v);
    if (field.type === 'month') return fmtMonth(v);
    return v;
  }
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const clientName = () => {
    const a = state.answers;
    return [a.givenNames, a.familyName].filter(Boolean).join(' ').trim() || String(a.fullName || '').trim();
  };
  const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const domId = (path) => 'ik-' + path.replace(/\./g, '-');

  // ---------- DOM helpers ----------
  function h(tag, attrs, kids) {
    const el = document.createElement(tag);
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of [].concat(kids || [])) {
      if (c == null || c === false) continue;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return el;
  }
  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: name, hidden: true });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  // ---------- layout ----------
  root.textContent = '';
  const banners = h('div', { class: 'ik-banners' });
  // Progress: "6/11", a menu of the sections (✓ = done) to jump to any of them, and one bar of sections done.
  // (11 sections: a row of step labels didn't fit, even on a computer.)
  const mJump = h('select', { class: 'ik-msteps-select', 'aria-label': UI.jump, onchange: (e) => { const i = +e.target.value; if (i >= 0) goTo(i); } });
  const mCount = h('span', { class: 'ik-msteps-count', 'aria-hidden': 'true' });
  const mFill = h('span', { class: 'ik-mbar-fill' });
  const mBar = h('div', { class: 'ik-mbar', role: 'img' }, mFill);
  const msteps = h('div', { class: 'ik-msteps' }, [h('div', { class: 'ik-msteps-row' }, [mCount, mJump]), mBar]);
  const status = h('p', { class: 'ik-status', 'aria-live': 'off' });
  const main = h('div', { class: 'ik-main' });
  const live = h('p', { class: 'ik-toast', role: 'status', 'aria-live': 'polite' });
  const fileInput = h('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: onFilePicked });
  const tools = h('div', { class: 'ik-tools' }, [
    h('button', { type: 'button', class: 'ik-link', onclick: saveFile }, [icon('down'), UI.saveFile]),
    h('button', { type: 'button', class: 'ik-link', onclick: () => fileInput.click() }, [icon('up'), UI.loadFile]),
    h('button', { type: 'button', class: 'ik-link muted', onclick: clearAll }, UI.clear),
    fileInput
  ]);
  root.append(banners, msteps, status, main, live, tools);

  function icon(kind) {
    const paths = {
      down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
      up: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
      check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
      doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
      redo: '<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5"/>'
    };
    const span = document.createElement('span');
    span.className = 'ik-ico';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[kind]}</svg>`;
    return span;
  }

  function toast(msg) {
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 30);
    clearTimeout(toast.t);
    toast.t = setTimeout(() => { live.textContent = ''; }, 7000);
  }

  function renderBanners(resumed) {
    banners.textContent = '';
    if (!storageOk) banners.append(h('p', { class: 'ik-banner warn' }, UI.noStorage));
    if (resumed) {
      banners.append(h('p', { class: 'ik-banner' }, [icon('redo'), h('span', {}, [h('strong', { text: UI.resumeTitle }), UI.resumeText(fmtStamp(state.startedAt), doneCount())])]));
    }
  }

  function renderStatus() {
    if (!storageOk) { status.textContent = UI.statusOff; status.className = 'ik-status off'; return; }
    status.className = 'ik-status' + (lastSaved ? ' ok' : '');
    if (!lastSaved) { status.textContent = UI.statusIdle; return; }
    const s = Math.round((Date.now() - lastSaved) / 1000);
    status.textContent = s < 10 ? UI.statusNow
      : UI.statusAgo(s < 60 ? UI.sec(s) : s < 3600 ? UI.min(Math.floor(s / 60)) : UI.hr(Math.floor(s / 3600)));
  }
  setInterval(renderStatus, 15000);

  function renderSteps(view) {
    const doneN = doneCount();
    mJump.textContent = '';
    DEF.sections.forEach((sec, i) => mJump.append(h('option', { value: String(i), text: `${i + 1}. ${L(sec.title)}${isDone(sec) ? '  ✓' : ''}` })));
    if (view !== 'form') mJump.append(h('option', { value: '-1', text: UI.finished }));
    mJump.value = view === 'form' ? String(state.section) : '-1';
    mCount.textContent = view === 'form' ? `${state.section + 1}/${N}` : '✓';
    mFill.style.width = `${Math.round((doneN / N) * 100)}%`;
    mBar.setAttribute('aria-label', UI.sectionsDone(doneN, N));
  }

  // ---------- form view ----------
  function goTo(i, focusPath) {
    flush();
    renderBanners(false);
    state.section = i;
    changed();
    renderForm();
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const target = focusPath ? document.getElementById(domId(focusPath)) : main.querySelector('h2');
    if (target) target.focus({ preventScroll: !focusPath });
  }

  function renderForm() {
    const sec = DEF.sections[state.section];
    renderSteps('form');
    renderStatus();
    main.textContent = '';
    const form = h('form', { class: 'ik-card', novalidate: true, onsubmit: (e) => e.preventDefault() }, [
      h('p', { class: 'ik-eyebrow', text: UI.step(state.section + 1) }),
      h('h2', { tabindex: '-1', text: `${state.section + 1}. ${L(sec.title)}` }),
      sec.lead ? h('p', { class: 'ik-lead', text: L(sec.lead) }) : null
    ]);
    renderFields(form, sec.fields, '', null);
    form.addEventListener('input', onInput);
    form.addEventListener('change', onInput);
    form.addEventListener('focusout', (e) => { if (e.target.dataset && e.target.dataset.path) showError(e.target.dataset.path, true); });
    const last = state.section === N - 1;
    const nav = h('div', { class: 'ik-nav' }, [
      state.section > 0 ? h('button', { type: 'button', class: 'btn btn-outline', onclick: () => { touch(); goTo(state.section - 1); } }, '← ' + UI.prev) : h('span'),
      last ? h('button', { type: 'button', class: 'btn btn-primary', onclick: finish }, [icon('doc'), UI.makePdf])
        : h('button', { type: 'button', class: 'btn btn-primary', onclick: () => { touch(); goTo(state.section + 1); } }, UI.next + ' →')
    ]);
    main.append(form, h('div', { class: 'ik-missing', hidden: true }), nav);
    refreshVisibility();
    if (state.touched[sec.id]) problems(sec).forEach((p) => showError(p.path, false));
  }

  function touch() {
    state.touched[DEF.sections[state.section].id] = true;
    changed();
  }

  function renderFields(parent, fields, prefix, scope) {
    for (const f of fields) {
      if (f.type === 'note') {
        parent.append(h('p', { class: 'ik-info', 'data-showif': f.showIf ? JSON.stringify(f.showIf) : null, 'data-scope': prefix, text: L(f.text) }));
      } else if (f.type === 'fixed') {
        // A value set by the questionnaire itself (e.g. Canada), shown locked: nothing to answer.
        const id = domId(prefix + f.id);
        parent.append(h('div', { class: 'ik-f', 'data-showif': f.showIf ? JSON.stringify(f.showIf) : null, 'data-scope': prefix }, [
          h('label', { class: 'ik-label', for: id, text: L(f.label) }),
          h('input', { id, type: 'text', value: L(f.text), readonly: true, 'aria-readonly': 'true', class: 'ik-fixed', tabindex: '-1' })
        ]));
      } else if (f.type === 'group') {
        const box = h('div', { class: 'ik-group', 'data-showif': f.showIf ? JSON.stringify(f.showIf) : null, 'data-scope': prefix }, [
          h('p', { class: 'ik-group-label', text: L(f.label) })
        ]);
        const grid = h('div', { class: 'ik-grid' + (f.cols === 3 ? ' cols-3' : '') });
        box.append(grid);
        renderFields(grid, f.fields, prefix, scope);
        parent.append(box);
      } else if (f.type === 'repeat') {
        const list = items(f);
        const wrap = h('div', { class: 'ik-repeat', 'data-showif': f.showIf ? JSON.stringify(f.showIf) : null, 'data-scope': prefix });
        list.forEach((item, i) => {
          const p = `${prefix}${f.id}.${i}.`;
          const fs = h('fieldset', { class: 'ik-item' }, [
            h('legend', { text: UI.item(L(f.label), i + 1) }),
            list.length > (f.min || 0) ? h('button', { type: 'button', class: 'ik-remove', onclick: () => { list.splice(i, 1); changed(); renderForm(); } }, `${UI.remove} · ${UI.item(L(f.label), i + 1)}`) : null
          ]);
          const grid = h('div', { class: 'ik-grid' });
          fs.append(grid);
          renderFields(grid, f.fields, p, item);
          wrap.append(fs);
        });
        if (!f.max || list.length < f.max) wrap.append(h('button', {
          type: 'button', class: 'btn btn-outline btn-sm ik-add',
          onclick: () => { list.push({}); changed(); renderForm(); const n = list.length - 1; const el = document.getElementById(domId(`${prefix}${f.id}.${n}.${f.fields[0].id}`)); if (el) el.focus(); }
        }, '+ ' + L(f.add)));
        parent.append(wrap);
      } else {
        parent.append(fieldEl(f, prefix + f.id, prefix, scope));
      }
    }
  }

  function fieldEl(f, path, prefix, scope) {
    const id = domId(path);
    if (f.default != null && rawAt(path) === undefined) setAt(path, f.default);
    const value = getAt(path);
    const err = h('p', { class: 'ik-err', id: id + '-err', hidden: true });
    const hint = f.hint ? h('p', { class: 'ik-hint', id: id + '-hint', text: L(f.hint) }) : null;
    const describedby = [hint ? id + '-hint' : '', id + '-err'].filter(Boolean).join(' ');
    const wide = f.type === 'textarea' || f.type === 'radio';
    let control;
    if (f.type === 'radio') {
      control = h('fieldset', { class: 'ik-radios', id, tabindex: '-1', 'aria-describedby': describedby }, [h('legend', { class: 'ik-label', text: L(f.label) })]);
      const chips = h('div', { class: 'ik-chips' });
      f.options.forEach((o) => {
        chips.append(h('label', { class: 'ik-chip' }, [
          h('input', { type: 'radio', name: path, value: o.value, 'data-path': path, checked: value === o.value }),
          h('span', { text: L(o.label) })
        ]));
      });
      control.append(chips);
      return h('div', { class: 'ik-f wide', 'data-field': path, 'data-showif': f.showIf ? JSON.stringify(f.showIf) : null, 'data-scope': prefix }, [control, hint, err]);
    }
    if (f.type === 'checkbox') {
      return h('div', { class: 'ik-f wide', 'data-field': path, 'data-showif': f.showIf ? JSON.stringify(f.showIf) : null, 'data-scope': prefix }, [
        h('label', { class: 'ik-check' }, [
          h('input', { type: 'checkbox', id, 'data-path': path, value: 'Y', checked: value === 'Y', 'aria-describedby': describedby }),
          h('span', { text: L(f.label) })
        ]), hint, err
      ]);
    }
    const common = { id, name: path, 'data-path': path, 'aria-describedby': describedby, required: f.required, autocomplete: f.autocomplete || 'off' };
    if (f.type === 'select') {
      control = h('select', common, [h('option', { value: '', text: UI.choose })].concat(optionsOf(f, scope).map((o) => h('option', { value: o.value, text: L(o.label) }))));
      control.value = value;
    } else if (f.type === 'textarea') {
      control = h('textarea', { ...common, rows: '4' });
      control.value = value;
    } else {
      control = h('input', {
        ...common, type: f.type === 'number' ? 'text' : f.type, inputmode: f.type === 'number' ? 'numeric' : null,
        placeholder: f.type === 'month' ? (LANG === 'fr' ? 'AAAA-MM' : 'YYYY-MM') : f.placeholder || null,
        min: f.notPast || f.future ? today() : f.min, max: f.notFuture ? today() : f.max
      });
      control.value = value;
    }
    return h('div', { class: 'ik-f' + (wide ? ' wide' : ''), 'data-field': path, 'data-showif': f.showIf ? JSON.stringify(f.showIf) : null, 'data-scope': prefix }, [
      h('label', { class: 'ik-label', for: id, text: L(f.label) }), control, hint, err
    ]);
  }

  function onInput(e) {
    const el = e.target;
    const path = el.dataset && el.dataset.path;
    if (!path) return;
    if (el.type === 'radio' && !el.checked) return;
    setAt(path, el.type === 'checkbox' ? (el.checked ? 'Y' : '') : el.value);
    changed();
    if (e.type === 'change' && LIST_KEYS.has(path.split('.').pop())) {
      renderForm();
      const again = document.getElementById(domId(path));
      if (again) again.focus();
      return;
    }
    refreshVisibility();
    renderSteps('form');
    const box = document.querySelector(`[data-field="${CSS.escape(path)}"] .ik-err`);
    if (box && !box.hidden) showError(path, false);
  }

  function refreshVisibility() {
    main.querySelectorAll('[data-showif]').forEach((el) => {
      const rule = JSON.parse(el.dataset.showif);
      const scopePath = el.dataset.scope ? el.dataset.scope.replace(/\.$/, '') : '';
      const scope = scopePath ? getAt(scopePath) : null;
      el.hidden = !shown({ showIf: rule }, scope || null);
    });
  }

  function leafAt(path) {
    const sec = DEF.sections[state.section];
    return leaves(sec).find((x) => x.path === path);
  }

  // onlyIfFilled: on leaving a field, flag a wrong format but not an empty required answer (that waits for "Next").
  function showError(path, onlyIfFilled) {
    const l = leafAt(path);
    const f = l && l.field;
    const wrap = document.querySelector(`[data-field="${CSS.escape(path)}"]`);
    if (!wrap) return;
    const box = wrap.querySelector('.ik-err');
    const value = getAt(path);
    let msg = f ? errorFor(f, value, l.scope) : '';
    if (onlyIfFilled && !String(value).trim()) msg = box.hidden ? '' : msg;
    box.textContent = msg;
    box.hidden = !msg;
    const control = wrap.querySelector('input:not([type=radio]):not([type=checkbox]), select, textarea, fieldset');
    if (control) control.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  // ---------- finish: check, build the PDF, done view ----------
  async function finish() {
    touch();
    const missing = [];
    DEF.sections.forEach((sec, i) => problems(sec).forEach((p) => missing.push({ ...p, section: i })));
    const box = main.querySelector('.ik-missing');
    if (missing.length) {
      DEF.sections.forEach((s) => { state.touched[s.id] = true; });
      changed();
      problems(DEF.sections[state.section]).forEach((p) => showError(p.path, false));
      box.textContent = '';
      const list = h('ul');
      missing.forEach((m) => {
        const sec = DEF.sections[m.section];
        list.append(h('li', {}, h('button', { type: 'button', class: 'ik-link', onclick: () => goTo(m.section, m.path) },
          `${L(sec.title)} · ${labelOf(m)}`)));
      });
      box.append(h('p', { class: 'ik-missing-title', text: UI.missingTitle }), list);
      box.hidden = false;
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const btn = main.querySelector('.ik-nav .btn-primary');
    btn.disabled = true;
    btn.textContent = UI.working;
    try {
      lastPdf = await buildPdf();
      download(lastPdf.blob, lastPdf.name);
      persist();
      renderDone();
    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.textContent = UI.makePdf;
      toast(UI.pdfError);
    }
  }

  const labelOf = (p) => p.where.concat(L(p.field.label)).join(' · ');

  function renderDone() {
    renderBanners(false);
    renderSteps('done');
    const name = clientName();
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(UI.mailSubject(name))}&body=${encodeURIComponent(UI.mailBody(name))}`;
    main.textContent = '';
    main.append(h('div', { class: 'ik-card ik-done' }, [
      h('div', { class: 'ik-big-ok', 'aria-hidden': 'true' }, icon('check')),
      h('h2', { tabindex: '-1', text: UI.doneTitle }),
      h('p', { class: 'ik-lead', text: UI.doneLead }),
      h('div', { class: 'ik-file' }, [icon('doc'), h('span', {}, [h('strong', { text: lastPdf.name }), h('small', { text: UI.doneWhere(lastPdf.pages) })])]),
      h('p', { class: 'ik-send-title', text: UI.sendTitle }),
      h('ol', { class: 'ik-how' }, UI.sendSteps.map((s) => h('li', { text: s }))),
      h('div', { class: 'btn-row' }, [
        h('a', { class: 'btn btn-primary', href: mailto }, [icon('mail'), UI.writeMail]),
        h('button', { type: 'button', class: 'btn btn-outline', onclick: () => download(lastPdf.blob, lastPdf.name) }, [icon('down'), UI.again])
      ]),
      h('p', { class: 'ik-note', text: UI.doneNote(EMAIL) }),
      h('div', { class: 'ik-done-links' }, [
        h('button', { type: 'button', class: 'ik-link', onclick: () => goTo(0) }, '← ' + UI.edit),
        h('button', { type: 'button', class: 'ik-link muted', onclick: clearAll }, UI.clearDevice)
      ])
    ]));
    main.querySelector('h2').focus();
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- PDF ----------
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = h('script', { src });
      s.onload = resolve;
      s.onerror = () => reject(new Error('load ' + src));
      document.head.append(s);
    });
  }
  async function libs() {
    const fonts = window.OTTAVI_FONTS || {};
    await Promise.all([
      window.PDFLib ? null : loadScript(ASSETS + 'vendor/pdf-lib.min.js'),
      window.fontkit ? null : loadScript(ASSETS + 'vendor/fontkit.umd.min.js'),
      fonts.regular ? null : loadScript(ASSETS + 'vendor/noto-sans-regular.js'),
      fonts.semibold ? null : loadScript(ASSETS + 'vendor/noto-sans-semibold.js')
    ]);
  }
  const ATTACH = 'reponses.json';
  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  function exportData() {
    return { formId: DEF.id, version: DEF.version, lang: LANG, startedAt: state.startedAt, updatedAt: state.updatedAt || new Date().toISOString(), answers: state.answers };
  }

  async function buildPdf() {
    await libs();
    const { PDFDocument, rgb } = window.PDFLib;
    const doc = await PDFDocument.create();
    doc.registerFontkit(window.fontkit);
    const regBytes = b64(window.OTTAVI_FONTS.regular);
    const reg = await doc.embedFont(regBytes, { subset: true });
    const semi = await doc.embedFont(b64(window.OTTAVI_FONTS.semibold), { subset: true });
    const cover = window.fontkit.create(regBytes);
    // Characters the font can't draw (e.g. Arabic or Chinese script) become "?" instead of failing.
    const clean = (s) => Array.from(String(s).replace(/\r\n?/g, '\n').replace(/\t/g, ' '))
      .map((c) => (c === '\n' || cover.hasGlyphForCodePoint(c.codePointAt(0)) ? c : '?')).join('');

    const PLUM = rgb(155 / 255, 63 / 255, 120 / 255), INK = rgb(31 / 255, 26 / 255, 28 / 255), GREY = rgb(110 / 255, 101 / 255, 105 / 255), LINE = rgb(230 / 255, 222 / 255, 211 / 255);
    const W = 595.28, H = 841.89, M = 56, LABEL_W = 180, GAP = 14, ANS_W = W - 2 * M - LABEL_W - GAP, FOOT = 40;
    let page, y;
    const newPage = () => { page = doc.addPage([W, H]); y = H - M; };
    const room = (need) => { if (y - need < M + FOOT - 20) newPage(); };
    function wrap(text, font, size, width) {
      const out = [];
      for (const para of clean(text).split('\n')) {
        let line = '';
        for (const word of para.split(/ +/)) {
          const tryLine = line ? line + ' ' + word : word;
          if (font.widthOfTextAtSize(tryLine, size) <= width) { line = tryLine; continue; }
          if (line) out.push(line);
          line = '';
          let w = word;
          while (font.widthOfTextAtSize(w, size) > width) {
            let k = w.length;
            while (k > 1 && font.widthOfTextAtSize(w.slice(0, k), size) > width) k--;
            out.push(w.slice(0, k));
            w = w.slice(k);
          }
          line = w;
        }
        out.push(line);
      }
      return out;
    }
    function text(s, x, size, font, color) { page.drawText(clean(s), { x, y, size, font, color }); }

    newPage();
    const name = clientName() || UI.noName;
    text(UI.pdfFirm.toUpperCase(), M, 9, semi, PLUM); y -= 26;
    for (const l of wrap(L(DEF.title), semi, 20, W - 2 * M)) { text(l, M, 20, semi, INK); y -= 26; }
    text(UI.pdfFilled(name, fmtDate(today())), M, 10, reg, GREY); y -= 30;

    const row = (label, answer) => {
      const ls = wrap(label, reg, 9.5, LABEL_W);
      const as = wrap(answer, reg, 10.5, ANS_W);
      const lh = 14;
      room(Math.min(Math.max(ls.length, as.length), 3) * lh + 8);
      for (let k = 0; k < Math.max(ls.length, as.length); k++) {
        room(lh);
        if (ls[k]) text(ls[k], M, 9.5, reg, GREY);
        if (as[k]) text(as[k], M + LABEL_W + GAP, 10.5, reg, INK);
        y -= lh;
      }
      y -= 3;
      page.drawLine({ start: { x: M, y: y + 6 }, end: { x: W - M, y: y + 6 }, thickness: 0.5, color: LINE });
      y -= 5;
    };
    const subhead = (label) => {
      room(40);
      y -= 4;
      text(label, M, 10.5, semi, INK);
      y -= 18;
    };
    const fieldsOut = (fields, prefix, scope) => {
      for (const f of fields) {
        if (!shown(f, scope) || f.type === 'note') continue;
        if (f.type === 'group') {
          subhead(L(f.label));
          fieldsOut(f.fields, prefix, scope);
        } else if (f.type === 'fixed') {
          row(L(f.label), L(f.text));
        } else if (f.type === 'repeat') {
          items(f).forEach((item, i) => {
            subhead(UI.item(L(f.label), i + 1));
            fieldsOut(f.fields, `${prefix}${f.id}.${i}.`, item);
          });
        } else row(L(f.label), display(f, getAt(prefix + f.id), scope));
      }
    };
    DEF.sections.forEach((sec, i) => {
      room(60);
      y -= 6;
      text(`${i + 1}. ${L(sec.title)}`, M, 13, semi, PLUM);
      y -= 8;
      page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.8, color: PLUM });
      y -= 18;
      fieldsOut(sec.fields, '', null);
      y -= 10;
    });

    const pages = doc.getPages();
    pages.forEach((p, i) => {
      p.drawText(clean(UI.pdfFoot), { x: M, y: 30, size: 8, font: reg, color: GREY });
      const n = `${i + 1} / ${pages.length}`;
      p.drawText(n, { x: W - M - reg.widthOfTextAtSize(n, 8), y: 30, size: 8, font: reg, color: GREY });
    });

    // The answers as data (reponses.json), for a later import without retyping. Twice: in the attachments list
    // (Acrobat's paperclip panel) and as a paperclip icon on page 1, so it is visible. Chrome's viewer and Mac
    // Preview don't show attachments at all.
    const now = new Date();
    const json = new TextEncoder().encode(JSON.stringify(exportData(), null, 2));
    await doc.attach(json, ATTACH, { mimeType: 'application/json', description: UI.pdfAttach, creationDate: now, modificationDate: now });
    const { PDFString, PDFHexString } = window.PDFLib;
    const ctx = doc.context;
    const fileRef = ctx.register(ctx.flateStream(json, { Type: 'EmbeddedFile', Subtype: 'application/json', Params: { Size: json.length } }));
    const specRef = ctx.register(ctx.obj({
      Type: 'Filespec', F: PDFString.of(ATTACH), UF: PDFHexString.fromText(ATTACH), EF: { F: fileRef, UF: fileRef },
      Desc: PDFHexString.fromText(UI.pdfAttach), AFRelationship: 'Data'
    }));
    const first = pages[0];
    const clipX = W - M - 14, clipY = H - M - 6;
    first.node.addAnnot(ctx.register(ctx.obj({
      Type: 'Annot', Subtype: 'FileAttachment', Name: 'Paperclip', F: 4, FS: specRef,
      Rect: [clipX, clipY - 16, clipX + 12, clipY + 4], C: [155 / 255, 63 / 255, 120 / 255],
      Contents: PDFHexString.fromText(UI.pdfAttach), T: PDFHexString.fromText(UI.pdfFirm)
    })));
    const clipText = UI.pdfClip(ATTACH);
    first.drawText(clean(clipText), { x: clipX - 6 - reg.widthOfTextAtSize(clipText, 8), y: clipY - 9, size: 8, font: reg, color: GREY });
    doc.setTitle(`${L(DEF.title)} – ${name}`);
    doc.setAuthor(name);
    doc.setSubject(L(DEF.title));
    doc.setCreator('www.ottavilawfirm.com');
    doc.setLanguage(LOCALE);
    doc.setCreationDate(now);
    doc.setModificationDate(now);
    const bytes = await doc.save();
    const fileName = `${UI.pdfName}-${slug(clientName()) || 'client'}-${today()}.pdf`;
    return { blob: new Blob([bytes], { type: 'application/pdf' }), name: fileName, pages: pages.length };
  }

  // ---------- progress file ----------
  async function saveFile() {
    flush();
    const data = JSON.stringify(exportData(), null, 2);
    const name = `${UI.progressName}-${today()}.json`;
    if (window.showSaveFilePicker) {
      try {
        if (!fileHandle) {
          fileHandle = await window.showSaveFilePicker({ suggestedName: name, types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }] });
        }
        const w = await fileHandle.createWritable();
        await w.write(data);
        await w.close();
        toast(UI.fileSaved(fileHandle.name));
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
        fileHandle = null; // fall back to a download
      }
    }
    download(new Blob([data], { type: 'application/json' }), name);
    toast(UI.fileDownloaded(name));
  }

  function onFilePicked() {
    const file = fileInput.files && fileInput.files[0];
    fileInput.value = '';
    if (!file) return;
    file.text().then(async (txt) => {
      let data;
      try { data = JSON.parse(txt); } catch (e) { data = null; }
      if (!readable(data)) { toast(UI.badFile); return; }
      if (data.version !== DEF.version) { toast(UI.otherVersion); return; }
      if (hasAnswers(state.answers) && JSON.stringify(state.answers) !== JSON.stringify(data.answers)) {
        const pick = await ask(UI.conflictTitle, UI.conflictText(fmtStamp(state.updatedAt), fmtStamp(data.updatedAt)),
          [{ value: 'file', label: UI.useFile, primary: true }, { value: 'keep', label: UI.keepCurrent }]);
        if (pick !== 'file') return;
      }
      state = { ...fresh(), startedAt: data.startedAt || new Date().toISOString(), updatedAt: data.updatedAt || null, answers: data.answers };
      const first = DEF.sections.findIndex((s) => !isDone(s));
      state.section = first === -1 ? N - 1 : first;
      persist();
      renderBanners(false);
      renderForm();
      toast(UI.fileLoaded);
    });
  }

  async function clearAll() {
    const ok = await ask(UI.clearTitle, UI.clearText, [{ value: 'yes', label: UI.clearYes, primary: true }, { value: 'no', label: UI.cancel }]);
    if (ok !== 'yes') return;
    clearTimeout(saveTimer);
    saveTimer = null;
    try { localStorage.removeItem(KEY); } catch (e) { /* nothing stored */ }
    state = fresh();
    lastSaved = 0;
    fileHandle = null;
    lastPdf = null;
    renderBanners(false);
    renderForm();
    toast(UI.cleared);
  }

  // In-page dialog (never the browser's confirm()).
  function ask(title, body, buttons) {
    return new Promise((resolve) => {
      const back = document.activeElement;
      const close = (v) => { overlay.remove(); document.removeEventListener('keydown', onKey); if (back && back.focus) back.focus(); resolve(v); };
      const onKey = (e) => { if (e.key === 'Escape') close(null); };
      const box = h('div', { class: 'ik-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ik-dlg-t' }, [
        h('h2', { id: 'ik-dlg-t', text: title }),
        h('p', { text: body }),
        h('div', { class: 'btn-row' }, buttons.map((b) => h('button', { type: 'button', class: 'btn ' + (b.primary ? 'btn-primary' : 'btn-outline'), onclick: () => close(b.value) }, b.label)))
      ]);
      const overlay = h('div', { class: 'ik-overlay', onclick: (e) => { if (e.target === overlay) close(null); } }, box);
      document.body.append(overlay);
      document.addEventListener('keydown', onKey);
      box.querySelector('button').focus();
    });
  }

  // ---------- start ----------
  renderBanners(!!stored && hasAnswers(state.answers));
  renderForm();
})();
