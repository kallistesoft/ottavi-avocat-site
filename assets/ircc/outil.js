// /outil/mobilite-francophone/: turns a client's questionnaire PDF (with reponses.json attached) into IRCC's work
// permit form, filled: IMM 5710 when the client is in Canada, IMM 1295 when outside (questionnaire's first answer).
// Everything runs here: the page's CSP has connect-src 'none'.
// Same method as Acrobat when a form is filled: IRCC's bytes are kept and an incremental update is appended (the
// XFA packets rewritten, AES-128 encrypted with the form's own keys, plus a cross-reference stream), so IRCC's
// certification and Reader rights stay valid.
(function () {
  'use strict';
  const root = document.getElementById('imm-tool');
  if (!root) return;
  const FORM_ID = 'ottavi-intake';
  const FORM_VERSION = 3;
  // One form per client, picked by the questionnaire's first answer (where the client is).
  const FORMS = {
    in: { id: 'imm5710', name: 'IMM 5710', title: 'permis de travail au Canada', map: (a, lawyer) => ({ values: window.IMM5710_MAP(a, lawyer) }) },
    out: { id: 'imm1295', name: 'IMM 1295', title: 'permis de travail présentée à l’extérieur du Canada', map: (a, lawyer) => ({ values: window.IMM1295_MAP(a, lawyer) }) }
  };

  const enc = new TextEncoder();
  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const hex = (s) => Uint8Array.from(s.match(/../g), (x) => parseInt(x, 16));
  const toHex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
  const concat = (parts) => {
    const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
    let o = 0;
    for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
  };
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
    for (const c of [].concat(kids || [])) if (c != null && c !== false) el.append(c);
    return el;
  }

  // ---------- read the client's answers ----------
  async function answersFrom(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (/\.json$/i.test(file.name) || bytes[0] === 0x7b) return JSON.parse(new TextDecoder().decode(bytes));
    const { PDFDocument, PDFName, PDFDict, PDFArray, PDFString, PDFHexString, decodePDFRawStream } = window.PDFLib;
    const doc = await PDFDocument.load(bytes, { updateMetadata: false });
    const names = doc.catalog.lookupMaybe(PDFName.of('Names'), PDFDict);
    const files = names && names.lookupMaybe(PDFName.of('EmbeddedFiles'), PDFDict);
    const arr = files && files.lookupMaybe(PDFName.of('Names'), PDFArray);
    if (!arr) throw new Error('nojson');
    for (let i = 0; i < arr.size(); i += 2) {
      const name = arr.lookup(i);
      const text = name instanceof PDFString || name instanceof PDFHexString ? name.decodeText() : '';
      if (text !== 'reponses.json') continue;
      const spec = arr.lookup(i + 1, PDFDict);
      const ef = spec.lookup(PDFName.of('EF'), PDFDict);
      const stream = ef.lookup(PDFName.of('F'));
      return JSON.parse(new TextDecoder().decode(decodePDFRawStream(stream).decode()));
    }
    throw new Error('nojson');
  }

  // ---------- fill ----------
  const kids = (node, name) => Array.from(node.children).filter((e) => e.localName === name);
  const step = (part) => {
    const m = /^(.+?)(?:\[(\d+)\])?$/.exec(part);
    return { name: m[1], i: m[2] ? +m[2] : 0 };
  };
  const parse = (text) => {
    const xml = new DOMParser().parseFromString(text.trim(), 'application/xml');
    if (xml.getElementsByTagName('parsererror').length) throw new Error('xml');
    return xml;
  };
  const clear = (node) => { for (const e of node.querySelectorAll('*')) if (!e.children.length) e.textContent = ''; return node; };

  // Data packet: `a/b[1]/c` = the 2nd <b> under <a>, then its <c>.
  function fillData(xml, plan, missing) {
    const data = kids(xml.documentElement, 'data')[0];
    const top = data.firstElementChild;
    const find = (path) => path.split('/').reduce((node, part) => {
      if (!node) return null;
      const { name, i } = step(part);
      return kids(node, name)[i] || null;
    }, top);
    for (const [path, n] of Object.entries(plan.instances || {})) {
      const parts = path.split('/');
      const parent = find(parts.slice(0, -1).join('/'));
      const name = parts[parts.length - 1];
      let rows = kids(parent, name);
      while (rows.length < n) {
        rows[rows.length - 1].after(clear(rows[rows.length - 1].cloneNode(true)));
        rows = kids(parent, name);
      }
    }
    for (const [path, value] of plan.values) {
      const node = find(path);
      if (!node) { missing.push(path); continue; }
      node.textContent = value;
    }
  }

  // Form packet (what Acrobat shows or hides): subforms by name, created when missing, each kind preceded by its
  // <instanceManager name="_Name"/> as Acrobat writes them.
  function fillForm(xml, plan) {
    const ns = xml.documentElement.namespaceURI;
    const subforms = (node, name) => Array.from(node.children).filter((e) => e.localName === 'subform' && e.getAttribute('name') === name);
    const add = (parent, name) => {
      const list = subforms(parent, name);
      const el = xml.createElementNS(ns, 'subform');
      el.setAttribute('name', name);
      if (list.length) { list[list.length - 1].after(el); return el; }
      const im = xml.createElementNS(ns, 'instanceManager');
      im.setAttribute('name', '_' + name);
      parent.append(im, el);
      return el;
    };
    const top = Array.from(xml.documentElement.children).find((e) => e.localName === 'subform');
    const get = (path) => path.split('/').reduce((node, part) => {
      const { name, i } = step(part);
      while (subforms(node, name).length <= i) add(node, name);
      return subforms(node, name)[i];
    }, top);
    for (const [path, n] of Object.entries(plan.instances || {})) {
      const parts = path.split('/');
      get(parts.slice(0, -1).join('/') + '/' + parts[parts.length - 1] + '[' + (n - 1) + ']');
    }
    for (const [path, presence] of plan.form || []) get(path).setAttribute('presence', presence);
  }

  async function deflate(bytes) {
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  async function encrypt(keyHex, bytes) {
    const key = await crypto.subtle.importKey('raw', hex(keyHex), { name: 'AES-CBC' }, false, ['encrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, bytes));
    return concat([iv, ct]);
  }

  async function buildPdf(pack, plan) {
    const original = b64(pack.pdf);
    const sum = toHex(await crypto.subtle.digest('SHA-256', original));
    if (sum !== pack.sha256) throw new Error('sha');
    const missing = [];
    const texts = {};
    const ds = parse(pack.packets.datasets.xml);
    fillData(ds, plan, missing);
    texts.datasets = '\n' + new XMLSerializer().serializeToString(ds.documentElement) + '\n';
    if (pack.packets.form) {
      const fm = parse(pack.packets.form.xml);
      fillForm(fm, plan);
      texts.form = new XMLSerializer().serializeToString(fm.documentElement);
    }

    const parts = [original];
    let length = original.length;
    if (original[length - 1] !== 0x0a) { parts.push(enc.encode('\n')); length += 1; }
    const objs = Object.keys(texts).map((k) => pack.packets[k]).sort((x, y) => x.num - y.num);
    const offsets = [];
    for (const p of objs) {
      const name = Object.keys(pack.packets).find((k) => pack.packets[k] === p);
      const body = await encrypt(p.key, await deflate(enc.encode(texts[name])));
      offsets.push([length, p.gen]);
      const obj = concat([enc.encode(`${p.num} ${p.gen} obj\n<</Filter/FlateDecode/Length ${body.length}>>stream\n`), body, enc.encode('\nendstream\nendobj\n')]);
      parts.push(obj);
      length += obj.length;
    }
    const xrefNum = pack.size;
    const xrefOffset = length;
    offsets.push([xrefOffset, 0]);
    const rows = new Uint8Array(6 * offsets.length);
    const dv = new DataView(rows.buffer);
    offsets.forEach(([off, gen], i) => { rows[i * 6] = 1; dv.setUint32(i * 6 + 1, off); rows[i * 6 + 5] = gen; });
    const ids = pack.ids.map((x) => `<${x}>`).join('');
    parts.push(enc.encode(`${xrefNum} 0 obj\n<</Type/XRef/Size ${xrefNum + 1}/Index[${objs[0].num} ${objs.length} ${xrefNum} 1]/W[1 4 1]` +
      `/Root ${pack.root}/Encrypt ${pack.encrypt}/Info ${pack.info}/ID[${ids}]/Prev ${pack.prev}/Length ${rows.length}>>stream\n`));
    parts.push(rows, enc.encode(`\nendstream\nendobj\nstartxref\n${xrefOffset}\n%%EOF\n`));
    return { blob: new Blob([concat(parts)], { type: 'application/pdf' }), missing };
  }

  // ---------- recap of the client's answers ----------
  // Same walk as the questionnaire's own PDF (assets/formulaire/form.js): questions in order, hidden ones skipped,
  // list codes shown as their labels.
  const fr = (x) => (x && typeof x === 'object' ? x.fr : x || '');
  function recap(a) {
    const DEF = window.OTTAVI_FORM;
    const LISTS = window.IRCC_LISTS || {};
    const valueIn = (key, scope) => (scope && Object.prototype.hasOwnProperty.call(scope, key) ? scope[key] : a[key]);
    const shown = (f, scope) => !f.showIf || [].concat(f.showIf).some((c) => {
      const v = valueIn(c.field, scope);
      return c.in ? c.in.indexOf(v) !== -1 : c.notIn.indexOf(v == null ? '' : v) === -1;
    });
    const fmtDate = (v, opts) => {
      const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(v);
      if (!m) return v;
      return new Intl.DateTimeFormat('fr-CA', { ...opts, timeZone: 'UTC' }).format(new Date(Date.UTC(+m[1], +m[2] - 1, +(m[3] || 1))));
    };
    const display = (f, value, scope) => {
      const v = String(value == null ? '' : value).trim();
      if (!v) return f.empty ? fr(f.empty) : '';
      if (f.type === 'checkbox') return 'Oui';
      if (f.options || f.list) {
        let list = f.options ? f.options.map((o) => [o.value, fr(o.label)]) : LISTS[f.list] || [];
        if (f.listBy && !f.options) list = list[valueIn(f.listBy, scope)] || [];
        const o = list.find((x) => x[0] === v);
        return o ? o[1] : v;
      }
      if (f.type === 'date') return fmtDate(v, { day: 'numeric', month: 'long', year: 'numeric' });
      if (f.type === 'month') return fmtDate(v, { month: 'long', year: 'numeric' });
      return v;
    };
    const box = h('div', { class: 'imm-recap' }, [h('h2', { text: 'Réponses du client' })]);
    DEF.sections.forEach((sec, i) => {
      const tbody = h('tbody');
      const sub = (label) => tbody.append(h('tr', { class: 'sub' }, h('th', { colspan: 2, text: label })));
      const walk = (fields, scope) => {
        for (const f of fields) {
          if (!shown(f, scope) || f.type === 'note') continue;
          if (f.type === 'group') { sub(fr(f.label)); walk(f.fields, scope); }
          else if (f.type === 'fixed') tbody.append(h('tr', {}, [h('td', { text: fr(f.label) }), h('td', { text: fr(f.text) })]));
          else if (f.type === 'repeat') {
            const list = Array.isArray(valueIn(f.id, scope)) ? valueIn(f.id, scope) : [];
            list.forEach((item, n) => { sub(`${fr(f.label)} ${n + 1}`); walk(f.fields, item); });
          } else {
            const val = display(f, valueIn(f.id, scope), scope);
            tbody.append(h('tr', { class: val ? null : 'empty' }, [h('td', { text: fr(f.label) }), h('td', { text: val || '—' })]));
          }
        }
      };
      walk(sec.fields, null);
      box.append(h('h3', { text: `${i + 1}. ${fr(sec.title)}` }), h('table', {}, tbody));
    });
    return box;
  }

  // ---------- page ----------
  const slug = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const today = () => new Date().toISOString().slice(0, 10);
  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: name, hidden: true });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  const input = h('input', { type: 'file', accept: '.pdf,.json,application/pdf,application/json', id: 'imm-file', class: 'sr-only' });
  const drop = h('label', { class: 'imm-drop', for: 'imm-file' }, [
    h('strong', { text: 'Déposez ici le PDF du client' }),
    h('span', { text: 'ou cliquez pour le choisir. Le fichier « reponses.json » seul fonctionne aussi.' })
  ]);
  const result = h('div', { class: 'imm-result', 'aria-live': 'polite' });
  root.append(drop, input, result);

  ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('over')));
  drop.addEventListener('drop', (e) => { e.preventDefault(); if (e.dataTransfer.files[0]) run(e.dataTransfer.files[0]); });
  input.addEventListener('change', () => { if (input.files[0]) run(input.files[0]); input.value = ''; });

  function message(kind, title, text) {
    result.textContent = '';
    result.append(h('div', { class: 'imm-card ' + kind }, [h('h2', { text: title }), text ? h('p', { text }) : null]));
  }

  async function run(file) {
    message('', 'Lecture du fichier…');
    let data;
    try {
      data = await answersFrom(file);
    } catch (e) {
      message('bad', 'Aucune réponse trouvée', 'Ce fichier ne contient pas « reponses.json ». Utilisez le PDF créé par le questionnaire du site, tel que le client l’a envoyé.');
      return;
    }
    if (!data || data.formId !== FORM_ID || !data.answers) {
      message('bad', 'Fichier inconnu', 'Ce fichier ne vient pas du questionnaire du site.');
      return;
    }
    if (data.version !== FORM_VERSION) {
      message('bad', 'Ancienne version du questionnaire', `Ce client a rempli la version ${data.version} du questionnaire, qui ne correspond pas aux formulaires actuels. Envoyez-lui le lien du questionnaire actuel.`);
      return;
    }
    const a = data.answers;
    const name = [a.givenNames, a.familyName].filter(Boolean).join(' ');
    const openPermit = a.permitType === 'OWP' || a.permitType === 'PGWP';

    // What the lawyer adds herself (never asked to the client), with IRCC's own format rules.
    const field = (id, label, hint) => {
      const input = h('input', { id, type: 'text', inputmode: 'numeric', autocomplete: 'off', 'aria-describedby': id + '-hint ' + id + '-err' });
      const err = h('p', { class: 'imm-err', id: id + '-err', hidden: true });
      return { input, err, box: h('div', { class: 'imm-field' }, [h('label', { for: id, text: label }), input, h('p', { class: 'imm-hint', id: id + '-hint', text: hint }), err]) };
    };
    const uci = field('imm-uci', 'IUC du client (facultatif)', 'Chiffres seulement. Il figure sur le permis d’études ou de travail du client.');
    // IRCC's rule (validateLMIAandExemptionCode, both forms): with an LMIA exemption (ELMO, e.g. Francophone
    // Mobility) it's the job offer number, a letter + 7 digits (A1234567); otherwise the LMIA number, 6000000-99999999.
    const exempt = a.permitType === 'ELMO';
    const lmia = exempt
      ? field('imm-lmia', 'Numéro de l’offre d’emploi (facultatif)', 'Une lettre et 7 chiffres, comme dans le Portail des employeurs : par exemple A1234567.')
      : field('imm-lmia', 'No de l’EIMT (facultatif)', 'Chiffres seulement, de 6000000 à 99999999.');
    if (exempt) { lmia.input.inputMode = 'text'; lmia.input.setAttribute('autocapitalize', 'characters'); }
    const check = () => {
      let ok = true;
      const u = uci.input.value.replace(/[\s-]/g, '');
      uci.err.hidden = !u || /^[0-9]+$/.test(u);
      uci.err.textContent = 'Chiffres seulement.';
      ok = ok && uci.err.hidden;
      const l = lmia.input.value.replace(/\s/g, '').toUpperCase();
      const lOk = !l || (exempt ? /^[A-Z]\d{7}$/.test(l) : /^[0-9]{7,8}$/.test(l) && +l >= 6000000 && +l <= 99999999);
      lmia.err.hidden = lOk;
      lmia.err.textContent = exempt ? 'IRCC exige une lettre suivie de 7 chiffres, par exemple A1234567.' : 'IRCC exige un nombre de 6000000 à 99999999 (chiffres seulement).';
      ok = ok && lOk;
      return ok && { uci: u, lmia: openPermit ? '' : l };
    };
    // In Canada = IMM 5710 (IRCC locks its country fields to Canada); outside = IMM 1295.
    const abroad = a.location === 'out';
    const form = FORMS[abroad ? 'out' : 'in'];
    const forms = [form];
    const LABEL = 'Créer l’' + form.name;
    const go = h('button', { type: 'button', class: 'btn btn-primary' }, LABEL);
    const done = h('div');
    go.addEventListener('click', async () => {
      const lawyer = check();
      if (!lawyer) return;
      go.disabled = true;
      go.textContent = 'Création…';
      const outs = [];
      try {
        for (const f of forms) {
          const pack = window.IRCC_FORMS[f.id];
          const plan = f.map(a, lawyer);
          const out = await buildPdf(pack, plan);
          outs.push({ f, pack, plan, out, fileName: `${f.name.replace(' ', '')}-${slug(name) || 'client'}-${today()}.pdf` });
        }
      } catch (e) {
        console.error(e);
        go.disabled = false;
        go.textContent = LABEL;
        done.textContent = '';
        done.append(h('p', { class: 'imm-err', text: e.message === 'sha' ? 'Un formulaire IRCC enregistré sur le site est abîmé.' : 'Les PDF n’ont pas pu être créés. Réessayez avec Chrome, Edge, Firefox ou Safari à jour.' }));
        return;
      }
      go.disabled = false;
      go.textContent = 'Créer à nouveau';
      done.textContent = '';
      // One button per file: browsers block a second download that no click started.
      for (const { f, pack, plan, out, fileName } of outs) {
        const list = h('table', { class: 'imm-table' }, [h('thead', {}, h('tr', {}, [h('th', { text: 'Champ ' + f.name }), h('th', { text: 'Valeur' })]))]);
        const tbody = h('tbody');
        plan.values.forEach(([p, val]) => tbody.append(h('tr', {}, [h('td', { text: p }), h('td', { text: val })])));
        list.append(tbody);
        done.append(h('div', { class: 'imm-file' }, [
          h('p', {}, h('button', { type: 'button', class: 'btn btn-primary', onclick: () => download(out.blob, fileName) }, 'Télécharger l’' + f.name)),
          h('p', { class: 'imm-hint', text: `${fileName} · ${plan.values.length} champs remplis · formulaire IRCC ${pack.formVersion.replace(/^\./, '')}` }),
          out.missing.length ? h('p', { class: 'warn', text: `Champs introuvables dans le formulaire (non remplis) : ${out.missing.join(', ')}` }) : null,
          h('details', {}, [h('summary', { text: 'Voir les valeurs écrites dans l’' + f.name }), list])
        ].filter(Boolean)));
      }
      done.append(h('ol', {}, [
        h('li', { text: 'Ouvrez le fichier dans Adobe Acrobat Reader (pas dans le navigateur ni dans Aperçu).' }),
        h('li', { text: 'Relisez chaque page et complétez ce qui manque.' }),
        h('li', { text: 'Cliquez sur « Valider » : la page des codes-barres se crée.' }),
        h('li', { text: 'Faites signer et dater le client.' })
      ]));
    });

    result.textContent = '';
    result.append(h('div', { class: 'imm-card ok' }, [
      h('h2', { text: `Client : ${name || 'sans nom'}` }),
      h('p', { class: 'imm-form' }, [h('strong', { text: form.name }), ` · demande de ${form.title} (client ${abroad ? 'à l’extérieur du Canada' : 'au Canada'})`]),
      h('p', { text: 'Ajoutez ce que le client ne fournit pas, puis créez le formulaire.' }),
      uci.box,
      openPermit ? h('p', { class: 'imm-hint', text: 'Permis ouvert ou postdiplôme : pas de numéro d’EIMT.' }) : lmia.box,
      h('p', {}, go),
      done
    ]), recap(a));
    uci.input.focus();
  }
})();
