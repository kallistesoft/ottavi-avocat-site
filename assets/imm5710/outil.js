// /outil/imm5710/: turns a client's questionnaire PDF (with reponses.json attached) into IRCC's IMM 5710, filled.
// Everything runs here: the page's CSP has connect-src 'none'. Same method as Acrobat when a form is filled:
// IRCC's bytes are kept and an incremental update is appended (new XFA datasets stream, AES-128 encrypted with
// the form's own key, plus a cross-reference stream), so IRCC's certification and Reader rights stay valid.
(function () {
  'use strict';
  const PACK = window.IMM5710;
  const MAP = window.IMM5710_MAP;
  const root = document.getElementById('imm-tool');
  if (!root) return;
  const FORM_ID = 'ottavi-intake';
  const FORM_VERSION = 2;

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
  function fillDatasets(values) {
    const xml = new DOMParser().parseFromString(PACK.datasets.trim(), 'application/xml');
    if (xml.getElementsByTagName('parsererror').length) throw new Error('xml');
    const data = Array.from(xml.documentElement.children).find((e) => e.localName === 'data');
    const form1 = Array.from(data.children).find((e) => e.localName === 'form1');
    const missing = [];
    for (const [path, value] of values) {
      let node = form1;
      for (const part of path.split('/')) {
        node = node && Array.from(node.children).find((e) => e.localName === part);
      }
      if (!node) { missing.push(path); continue; }
      node.textContent = value;
    }
    return { xml: '\n' + new XMLSerializer().serializeToString(xml.documentElement) + '\n', missing };
  }

  async function deflate(bytes) {
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  async function encrypt(bytes) {
    const key = await crypto.subtle.importKey('raw', hex(PACK.objKey), { name: 'AES-CBC' }, false, ['encrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, bytes));
    return concat([iv, ct]);
  }

  async function buildPdf(values) {
    const original = b64(PACK.pdf);
    const sum = toHex(await crypto.subtle.digest('SHA-256', original));
    if (sum !== PACK.sha256) throw new Error('sha');
    const { xml, missing } = fillDatasets(values);
    const body = await encrypt(await deflate(enc.encode(xml)));

    const parts = [original];
    let length = original.length;
    if (original[length - 1] !== 0x0a) { parts.push(enc.encode('\n')); length += 1; }
    const dsOffset = length;
    const obj = concat([enc.encode(`${PACK.num} ${PACK.gen} obj\n<</Filter/FlateDecode/Length ${body.length}>>stream\n`), body, enc.encode('\nendstream\nendobj\n')]);
    parts.push(obj);
    length += obj.length;
    const xrefNum = PACK.size;
    const xrefOffset = length;
    const rows = new Uint8Array(12);
    const dv = new DataView(rows.buffer);
    rows[0] = 1; dv.setUint32(1, dsOffset); rows[5] = PACK.gen;
    rows[6] = 1; dv.setUint32(7, xrefOffset); rows[11] = 0;
    const ids = PACK.ids.map((x) => `<${x}>`).join('');
    parts.push(enc.encode(`${xrefNum} 0 obj\n<</Type/XRef/Size ${xrefNum + 1}/Index[${PACK.num} 1 ${xrefNum} 1]/W[1 4 1]` +
      `/Root ${PACK.root}/Encrypt ${PACK.encrypt}/Info ${PACK.info}/ID[${ids}]/Prev ${PACK.prev}/Length ${rows.length}>>stream\n`));
    parts.push(rows, enc.encode(`\nendstream\nendobj\nstartxref\n${xrefOffset}\n%%EOF\n`));
    return { blob: new Blob([concat(parts)], { type: 'application/pdf' }), missing };
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
      message('bad', 'Ancienne version du questionnaire', `Ce client a rempli la version ${data.version} du questionnaire, qui ne correspond pas à l’IMM 5710. Envoyez-lui le lien du questionnaire actuel.`);
      return;
    }
    const a = data.answers;
    const name = [a.givenNames, a.familyName].filter(Boolean).join(' ');
    const fileName = `IMM5710-${slug(name) || 'client'}-${today()}.pdf`;
    const openPermit = a.permitType === 'OWP' || a.permitType === 'PGWP';

    // What the lawyer adds herself (never asked to the client), with IRCC's own format rules.
    const field = (id, label, hint) => {
      const input = h('input', { id, type: 'text', inputmode: 'numeric', autocomplete: 'off', 'aria-describedby': id + '-hint ' + id + '-err' });
      const err = h('p', { class: 'imm-err', id: id + '-err', hidden: true });
      return { input, err, box: h('div', { class: 'imm-field' }, [h('label', { for: id, text: label }), input, h('p', { class: 'imm-hint', id: id + '-hint', text: hint }), err]) };
    };
    const uci = field('imm-uci', 'IUC du client (facultatif)', 'Chiffres seulement. Il figure sur le permis d’études ou de travail du client.');
    const lmia = field('imm-lmia', 'No de l’EIMT ou de l’offre d’emploi (facultatif)', 'Chiffres seulement, de 6000000 à 99999999 : sans la lettre A du début.');
    const check = () => {
      let ok = true;
      const u = uci.input.value.replace(/[\s-]/g, '');
      uci.err.hidden = !u || /^[0-9]+$/.test(u);
      uci.err.textContent = 'Chiffres seulement.';
      ok = ok && uci.err.hidden;
      const l = lmia.input.value.replace(/\s/g, '').replace(/^[Aa]/, '');
      const lOk = !l || (/^[0-9]+$/.test(l) && +l >= 6000000 && +l <= 99999999);
      lmia.err.hidden = lOk;
      lmia.err.textContent = 'IRCC exige un nombre de 6000000 à 99999999 (chiffres seulement).';
      ok = ok && lOk;
      return ok && { uci: u, lmia: openPermit ? '' : l };
    };
    const go = h('button', { type: 'button', class: 'btn btn-primary' }, 'Créer l’IMM 5710');
    const done = h('div');
    go.addEventListener('click', async () => {
      const lawyer = check();
      if (!lawyer) return;
      go.disabled = true;
      go.textContent = 'Création…';
      const values = MAP(a, lawyer);
      let out;
      try {
        out = await buildPdf(values);
      } catch (e) {
        console.error(e);
        go.disabled = false;
        go.textContent = 'Créer l’IMM 5710';
        done.textContent = '';
        done.append(h('p', { class: 'imm-err', text: e.message === 'sha' ? 'Le formulaire IRCC enregistré sur le site est abîmé.' : 'Le PDF n’a pas pu être créé. Réessayez avec Chrome, Edge, Firefox ou Safari à jour.' }));
        return;
      }
      download(out.blob, fileName);
      go.disabled = false;
      go.textContent = 'Créer à nouveau';
      const list = h('table', { class: 'imm-table' }, [h('thead', {}, h('tr', {}, [h('th', { text: 'Champ IMM 5710' }), h('th', { text: 'Valeur' })]))]);
      const tbody = h('tbody');
      values.forEach(([p, val]) => tbody.append(h('tr', {}, [h('td', { text: p }), h('td', { text: val })])));
      list.append(tbody);
      done.textContent = '';
      done.append(...[
        h('p', { class: 'imm-ok', text: `${fileName} est dans vos Téléchargements · ${values.length} champs remplis · formulaire IRCC ${PACK.formVersion.replace(/^\./, '')}.` }),
        h('p', {}, h('button', { type: 'button', class: 'btn btn-outline btn-sm', onclick: () => download(out.blob, fileName) }, 'Télécharger à nouveau')),
        out.missing.length ? h('p', { class: 'warn', text: `Champs introuvables dans le formulaire (non remplis) : ${out.missing.join(', ')}` }) : null,
        h('ol', {}, [
          h('li', { text: 'Ouvrez le fichier dans Adobe Acrobat Reader (pas dans le navigateur ni dans Aperçu).' }),
          h('li', { text: 'Relisez chaque page et complétez ce qui manque.' }),
          h('li', { text: 'Cliquez sur « Valider » : la page des codes-barres se crée.' }),
          h('li', { text: 'Imprimez, faites signer et dater le client.' })
        ]),
        h('details', {}, [h('summary', { text: 'Voir les valeurs écrites dans le formulaire' }), list])
      ].filter(Boolean));
    });

    result.textContent = '';
    result.append(h('div', { class: 'imm-card ok' }, [
      h('h2', { text: `Client : ${name || 'sans nom'}` }),
      h('p', { text: 'Ajoutez ce que le client ne fournit pas, puis créez le formulaire.' }),
      uci.box,
      openPermit ? h('p', { class: 'imm-hint', text: 'Permis ouvert ou postdiplôme : pas de numéro d’EIMT.' }) : lmia.box,
      h('p', {}, go),
      done
    ]));
    uci.input.focus();
  }
})();
