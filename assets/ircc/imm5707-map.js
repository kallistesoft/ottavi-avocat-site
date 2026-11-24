// Questionnaire answers (assets/formulaire/form-def.js, version 3) -> IMM 5707 (family information) fill plan.
// Returns { values, form, instances }:
// - values: [xfaPath, value] under xfa:data/IMM_5707 (`Name[i]` picks the i-th node of that name);
// - form: [path, presence] for Acrobat's form state: the IMM 5707 shows or hides its spouse, "married in person"
//   and children blocks only when someone clicks, so a pre-filled file must carry those states itself;
// - instances: how many `Child` rows the form needs (IRCC's file has 4).
// The IMM 5707 wants plain text where the IMM 5710 wants codes: countries are written as IRCC's French labels.
// A field the questionnaire hides is never written. Signatures and dates stay empty: the client signs.
window.IMM5707_MAP = function (a) {
  const L = window.IRCC_LISTS || {};
  const values = [];
  const form = [];
  const v = (x) => (x == null ? '' : String(x).trim());
  const set = (path, value) => { if (v(value) !== '') values.push([path, v(value)]); };
  const label = (list, code) => ((L[list] || []).find((o) => o[0] === code) || [])[1] || '';
  const YN = (x) => (x === 'Y' ? '1' : x === 'N' ? '2' : '');
  // IMM 5710 marital codes (questionnaire) -> IMM 5707 codes.
  const MARITAL = { '03': '1', '02': '2', '04': '3', '09': '4', '01': '5', '05': '6', '06': '7', '00': '8' };
  const pad = (x) => (/^\d$/.test(v(x)) ? '0' + v(x) : v(x));
  const dob = [v(a.dobYear), pad(a.dobMonth), pad(a.dobDay)];
  const myDob = dob.every((x) => /^\d+$/.test(x)) ? dob.join('-') : '';

  // The client's own address, written out, for relatives who live with them.
  const place = (country, prov, state) => [country === '511' ? label('ProvinceAbbrev', prov) : country === '461' ? label('StateAbbrev', state) : '', label('Country', country)];
  const mine = a.sameAddrYN === 'N'
    ? [[a.resApt, a.resStreetNum, a.resStreet].map(v).filter(Boolean).join(' '), a.resCity, ...place(a.resCountry, a.resProv, a.resState), a.resPostal]
    : [[a.mailApt, a.mailStreetNum, a.mailStreet].map(v).filter(Boolean).join(' '), a.mailCity, ...place(a.mailCountry, a.mailProv, a.mailState), a.mailPostal];
  const myAddress = mine.map(v).filter(Boolean).join(', ');
  // « Adresse actuelle » as IRCC asks: the address, or « Décédé(e) » then city, country and date of death.
  const address = (where, other, city, country, date) =>
    where === 'same' ? myAddress : where === 'other' ? v(other).replace(/\s*\n\s*/g, ', ')
      : where === 'dead' ? ['Décédé(e)', v(city), label('Country', country), v(date)].filter(Boolean).join(', ') : '';
  const accompanying = (where, yn) => (where === 'dead' ? '2' : YN(yn));

  const A = 'page1/SectionA/';
  // Applicant
  set(A + 'Applicant/PaddedEntry/PersonalData[0]/FamilyName', a.familyName);
  set(A + 'Applicant/PaddedEntry/PersonalData[0]/GivenNames', a.givenNames);
  set(A + 'Applicant/PaddedEntry/PersonalData[0]/NativeName', a.nativeName);
  set(A + 'Applicant/PaddedEntry/PersonalData[1]/DOB', myDob);
  set(A + 'Applicant/PaddedEntry/PersonalData[1]/COB', label('CountryOfBirth', a.birthCountry));
  set(A + 'Applicant/PaddedEntry/PersonalData[1]/MaritalStatus', MARITAL[a.marital]);
  set(A + 'Applicant/PaddedEntry/PersonalData[1]/Occupation', a.occupation);
  const married = a.marital === '01';
  const partner = married || a.marital === '03';
  if (married) set(A + 'Applicant/PaddedEntry/MarriageInPerson/MarriageInPerson/yesno', YN(a.marriedInPerson));
  form.push([A + 'Applicant/PaddedEntry/MarriageInPerson', married ? 'visible' : 'hidden']);

  // Spouse or common-law partner
  form.push([A + 'Spouse', partner ? 'visible' : 'hidden']);
  if (partner) {
    const S = A + 'Spouse/PaddedEntry/';
    set(S + 'Accompanying/yesno', YN(a.spouseAccompany));
    set(S + 'PersonalData[0]/FamilyName', a.spouseFamily);
    set(S + 'PersonalData[0]/GivenNames', a.spouseGiven);
    set(S + 'PersonalData[0]/NativeName', a.spouseNative);
    set(S + 'PersonalData[1]/DOB', a.spouseDob);
    set(S + 'PersonalData[1]/COB', label('CountryOfBirth', a.spouseBirthCountry));
    set(S + 'PersonalData[1]/Address', address(a.spouseWhere, a.spouseAddress));
    set(S + 'PersonalData[1]/MaritalStatus', MARITAL[a.marital]);
    set(S + 'PersonalData[1]/Occupation', a.spouseOccupation);
    if (married) set(S + 'MarriageInPerson/MarriageInPerson/yesno', YN(a.spouseInPerson));
    form.push([S + 'MarriageInPerson', married ? 'visible' : 'hidden']);
  }

  // Parents
  [1, 2].forEach((n) => {
    const p = (k) => a['parent' + n + k];
    const P = A + 'Parent' + n + '/PaddedEntry/';
    set(P + 'Accompanying/yesno', accompanying(p('Where'), p('Accompany')));
    set(P + 'PersonalData[0]/FamilyName', p('Family'));
    set(P + 'PersonalData[0]/GivenNames', p('Given'));
    set(P + 'PersonalData[0]/DOB', p('Dob'));
    set(P + 'PersonalData[1]/COB', label('CountryOfBirth', p('BirthCountry')));
    set(P + 'PersonalData[1]/Address', address(p('Where'), p('Address'), p('DeathCity'), p('DeathCountry'), p('DeathDate')));
    set(P + 'PersonalData[1]/MaritalStatus', p('Marital'));
    set(P + 'PersonalData[1]/Occupation', p('Occupation'));
  });

  // Children
  const B = 'page1/SectionB/';
  const kids = a.childrenYN === 'Y' ? (a.children || []) : [];
  const rows = Math.max(4, kids.length);
  if (!kids.length && a.childrenYN === 'N') {
    set(B + 'hideChildren', '1');
    for (let i = 0; i < 4; i++) form.push([B + 'Child[' + i + ']', 'hidden']);
    form.push([B + 'shim', 'visible']);
  }
  kids.forEach((c, i) => {
    const C = B + 'Child[' + i + ']/PaddedEntry/';
    set(C + 'Accompanying/yesno', accompanying(c.where, c.accompany));
    set(C + 'PersonalData[0]/Relationship', c.relationship);
    set(C + 'PersonalData[0]/FamilyName', c.family);
    set(C + 'PersonalData[0]/GivenNames', c.given);
    set(C + 'PersonalData[0]/DOB', c.dob);
    set(C + 'PersonalData[1]/COB', label('CountryOfBirth', c.birthCountry));
    set(C + 'PersonalData[1]/Address', address(c.where, c.address, c.deathCity, c.deathCountry, c.deathDate));
    set(C + 'PersonalData[1]/MaritalStatus', c.marital);
    set(C + 'PersonalData[1]/Occupation', c.occupation);
  });
  if (rows > 4) {
    // The "+ / -" buttons sit on the last row only, as when rows are added in Acrobat.
    form.push([B + 'Child[3]/PaddedEntry/buttons', 'hidden']);
    form.push([B + 'Child[' + (rows - 1) + ']/PaddedEntry/buttons', 'visible']);
  }
  return { values, form, instances: { [B + 'Child']: rows } };
};
