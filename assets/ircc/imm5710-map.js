// Questionnaire answers (assets/formulaire/form-def.js, version 3) -> IMM 5710 XFA data paths (under form1).
// Values are IRCC codes already (the questionnaire's lists come from the form). A field the questionnaire hides
// is never written, so stale answers (e.g. a spouse before choosing "Célibataire") don't reach the form.
// `lawyer` holds what Me Poughon types on /outil/mobilite-francophone/ (not asked to the client): { uci, lmia }.
window.IMM5710_MAP = function (a, lawyer) {
  lawyer = lawyer || {};
  const out = [];
  const v = (x) => (x == null ? '' : String(x).trim());
  const set = (path, value) => { if (v(value) !== '') out.push([path, v(value)]); };
  const Y = (x) => x === 'Y';
  const pad = (x) => (/^\d$/.test(v(x)) ? '0' + v(x) : v(x));
  const date = (base, iso, parts) => {
    // A date field plus, when the form has them, its year/month/day helper fields.
    set(base, iso);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v(iso));
    if (m && parts) { set(parts[0], m[1]); set(parts[1], m[2]); set(parts[2], m[3]); }
  };
  const month = (yPath, mPath, ym) => {
    const m = /^(\d{4})-(\d{2})$/.exec(v(ym));
    if (m) { set(yPath, m[1]); set(mPath, m[2]); }
  };
  const phone = (base, format, type, country, number, ext) => {
    const digits = v(number).replace(/\D/g, '');
    if (!digits) return;
    set(base + '/Type', type);
    set(base + '/NumberExt', ext);
    set(base + '/ActualNumber', digits);
    if (format === 'other') {
      set(base + '/CanOtherInd/CanadaUS', '0');
      set(base + '/CanOtherInd/Other', '1');
      set(base + '/NumberCountry', v(country).replace(/\D/g, ''));
      set(base + '/IntlNumber/IntlNumber', digits);
    } else {
      const d = digits.length === 11 && digits[0] === '1' ? digits.slice(1) : digits;
      set(base + '/CanOtherInd/CanadaUS', '1');
      set(base + '/CanOtherInd/Other', '0');
      set(base + '/NANumber/AreaCode', d.slice(0, 3));
      set(base + '/NANumber/FirstThree', d.slice(3, 6));
      set(base + '/NANumber/LastFive', d.slice(6));
    }
  };
  const provOrState = (country, prov, state) => (country === '511' ? prov : country === '461' ? state : '');

  // Page 1: application, identity, residence, marital status
  const P = 'Page1/PersonalDetails/';
  set(P + 'ServiceIn/ServiceIn', a.serviceIn);
  set(P + 'ServiceIn/UCIClientID', lawyer.uci);
  set(P + 'ApplyingFor/RestoreStat', Y(a.applyRestore) ? '1' : '0');
  set(P + 'ApplyingFor/Extend', Y(a.applyExtend) ? '1' : '0');
  set(P + 'ApplyingFor/NewEmployer', Y(a.applyNew) ? '1' : '0');
  set(P + 'ApplyingFor/TRP', Y(a.applyTrp) ? '1' : '0');
  set(P + 'Name/FamilyName', a.familyName);
  set(P + 'Name/GivenName', a.givenNames);
  set(P + 'AliasName/AliasNameIndicator/AliasNameIndicator', a.aliasYN);
  if (Y(a.aliasYN)) {
    set(P + 'AliasName/AliasFamilyName', a.aliasFamily);
    set(P + 'AliasName/AliasGivenName', a.aliasGiven);
  }
  set(P + 'q3-4-5/sex/Sex', a.sex);
  set(P + 'q3-4-5/dob/DOBDay', pad(a.dobDay));
  set(P + 'q3-4-5/dob/DOBMonth', pad(a.dobMonth));
  set(P + 'q3-4-5/dob/DOBYear', a.dobYear);
  set(P + 'q3-4-5/pob/PlaceBirthCity', a.birthCity);
  set(P + 'q3-4-5/pob/PlaceBirthCountry', a.birthCountry);
  set(P + 'Citizenship/Citizenship', a.citizenship);
  const C = P + 'CurrentCOR/';
  // Question 7: always Canada (IRCC's field is locked). Dates only with a temporary status: IRCC's form erases a
  // citizen/PR/protected/claimant status that comes with dates.
  set(C + 'CurrentCOR/Row2/Country', '511');
  if (Y(a.applyRestore)) {
    // IMM 5710 instructions, restoring status: « Autre », « Perte de statut, rétablissement », dates left empty.
    set(C + 'CurrentCOR/Row2/Status', '06');
    set(C + 'CurrentCOR/Row2/Other', 'Perte de statut, rétablissement');
  } else {
    set(C + 'CurrentCOR/Row2/Status', a.corStatus);
    if (a.corStatus === '06') set(C + 'CurrentCOR/Row2/Other', a.corOther);
  }
  if (!Y(a.applyRestore) && ['03', '04', '05', '06'].includes(a.corStatus)) {
    date(C + 'CurrentCOR/Row2/FromDate', a.corFrom, [C + 'CORDates/FromYr', C + 'CORDates/FromMM', C + 'CORDates/FromDD']);
    date(C + 'CurrentCOR/Row2/ToDate', a.corTo, [C + 'CORDates/ToYr', C + 'CORDates/ToMM', C + 'CORDates/ToDD']);
  }
  set(P + 'PrevCOR/PCRIndicator', a.prevCorYN);
  if (Y(a.prevCorYN)) {
    (a.prevCor || []).slice(0, 2).forEach((r, i) => {
      const row = P + 'PrevCOR/PreviousCOR/Row' + (i + 2) + '/';
      const dates = P + 'PrevCOR/PCRDatesR' + (i + 1) + '/';
      set(row + 'Country', r.country);
      set(row + 'Status', r.status);
      if (r.status === '06') set(row + 'Other', r.other);
      date(row + 'FromDate', r.from, [dates + 'FromYr', dates + 'FromMM', dates + 'FromDD']);
      date(row + 'ToDate', r.to, [dates + 'ToYr', dates + 'ToMM', dates + 'ToDD']);
    });
  }
  const M = 'Page1/MaritalStatus/';
  set(M + 'Current/MaritalStatus', a.marital);
  if (a.marital === '01' || a.marital === '03') {
    date(M + 'Current/b/DateOfMarriage', a.marriageDate, [M + 'Current/b/MarriageDate/FromYr', M + 'Current/b/MarriageDate/FromMM', M + 'Current/b/MarriageDate/FromDD']);
    set(M + 'Current/c/FamilyName', a.spouseFamily);
    set(M + 'Current/c/GivenName', a.spouseGiven);
    set(M + 'd/SpouseStatus', a.spouseCdn);
  }

  // Page 2: previous relationship, languages, documents, contact
  const PM = 'Page2/MaritalStatus/PrevMarriage/';
  set(PM + 'PrevMarriedIndicator', a.prevMarriedYN);
  if (Y(a.prevMarriedYN)) {
    set(PM + 'PMFamilyName', a.prevFamily);
    set(PM + 'PMGivenName', a.prevGiven);
    set(PM + 'TypeOfRelationship', a.prevType);
    date(PM + 'From/FromDate', a.prevFrom, [PM + 'PreviouslyMarriedDates/FromYr', PM + 'PreviouslyMarriedDates/FromMM', PM + 'PreviouslyMarriedDates/FromDD']);
    date(PM + 'To/ToDate', a.prevTo, [PM + 'PreviouslyMarriedDates/ToYr', PM + 'PreviouslyMarriedDates/ToMM', PM + 'PreviouslyMarriedDates/ToDD']);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v(a.prevDob));
    if (m) { set(PM + 'dob/DOBYear', m[1]); set(PM + 'dob/DOBMonth', m[2]); set(PM + 'dob/DOBDay', m[3]); }
  }
  const LG = 'Page2/Languages/';
  set(LG + 'nativeLang', a.nativeLang);
  set(LG + 'communicateLang', a.communicateLang);
  if (a.communicateLang === 'Both') set(LG + 'FreqLang', a.freqLang);
  set(LG + 'LangTestIndicator', a.langTestYN);
  const PP = 'Page2/Passport/';
  set(PP + 'PassportNum', v(a.passportNum).replace(/\s+/g, '').toUpperCase());
  set(PP + 'CountryofIssue', a.passportCountry);
  date(PP + 'IssueDate', a.passportIssue, [PP + 'Issue/YYYY', PP + 'Issue/MM', PP + 'Issue/DD']);
  date(PP + 'ExpiryDate', a.passportExpiry, [PP + 'Expiry/YYYY', PP + 'Expiry/MM', PP + 'Expiry/DD']);
  if (a.passportCountry === '203') set(PP + 'TaiwanPIN', a.taiwanYN);
  if (a.passportCountry === '206') set(PP + 'IsraelPassportIndicator', a.israelYN);
  set('Page2/natID/q1/natIDIndicator', a.natIdYN);
  if (Y(a.natIdYN)) {
    set('Page2/natID/natIDdocs/DocNum/DocNum', a.natIdNum);
    set('Page2/natID/natIDdocs/CountryofIssue/CountryofIssue', a.natIdCountry);
    set('Page2/natID/natIDdocs/IssueDate/IssueDate', a.natIdIssue);
    set('Page2/natID/natIDdocs/ExpiryDate', a.natIdExpiry);
  }
  set('Page2/USCard/q1/usCardIndicator', a.usCardYN);
  if (Y(a.usCardYN)) {
    set('Page2/USCard/usCarddocs/DocNum/DocNum', a.usCardNum);
    set('Page2/USCard/usCarddocs/ExpiryDate', a.usCardExpiry);
  }
  const CI = 'Page2/ContactInformation/';
  set(CI + 'Mailing/AddrLine1/POBox', a.mailPOBox);
  set(CI + 'Mailing/AddrLine1/AptUnit', a.mailApt);
  set(CI + 'Mailing/AddrLine1/StreetNum', a.mailStreetNum);
  set(CI + 'Mailing/AddrLine1/Streetname', a.mailStreet);
  set(CI + 'Mailing/AddrLine2/City', a.mailCity);
  set(CI + 'Mailing/AddrLine2/Country', '511'); // locked to Canada in IRCC's form
  set(CI + 'Mailing/AddrLine2/Prov', a.mailProv);
  set(CI + 'Mailing/AddrLine2/PostalCode', v(a.mailPostal).toUpperCase().replace(/^([A-Z]\d[A-Z])\s*(\d[A-Z]\d)$/, '$1 $2'));
  set(CI + 'Resi/SameAsAddr/SameAsMailingInd', a.sameAddrYN);
  if (a.sameAddrYN === 'N') {
    set(CI + 'Resi/AddrLine1/AptUnit', a.resApt);
    set(CI + 'Resi/AddrLine1/StreetNum', a.resStreetNum);
    set(CI + 'Resi/AddrLine1/Streetname', a.resStreet);
    set(CI + 'Resi/AddrLine2/City', a.resCity);
    set(CI + 'Resi/AddrLine2/Country', a.resCountry);
    set(CI + 'Resi/AddrLine2/Prov', provOrState(a.resCountry, a.resProv, a.resState));
    set(CI + 'Resi/AddrLine2/PostalCode', a.resPostal);
  }
  phone(CI + 'q3-4/Phone', a.phoneFormat, a.phoneType, a.phoneCountry, a.phoneNumber, a.phoneExt);
  phone(CI + 'q3-4/AltPhone', a.altFormat, a.altType, a.altCountry, a.altNumber, a.altExt);
  set(CI + 'q5-6/Email/Email', a.email);

  // Page 3: entry, intended work, education, current job
  const E = 'Page3/ComingIntoCda/';
  set(E + 'OrigEntry/DateLastEntry', a.firstEntryDate);
  set(E + 'OrigEntry/Place', a.firstEntryPlace);
  set(E + 'PurposeOfVisit/PurposeOfVisit', a.visitPurpose);
  if (a.visitPurpose === '03') set(E + 'PurposeOfVisit/Other', a.visitOther);
  set(E + 'RecentEntry/DateLastEntry', a.lastEntryDate);
  set(E + 'RecentEntry/Place', a.lastEntryPlace);
  set(E + 'PrevDocNum/docNum', v(a.prevDocNum).toUpperCase());
  const W = 'Page3/DetailsOfWork/';
  set(W + 'Purpose/Type', a.permitType);
  if (a.permitType === 'Other') set(W + 'Purpose/Other', a.permitOther);
  if (a.permitType !== 'OWP' && a.permitType !== 'PGWP') {
    set(W + 'Employer/Name', a.employerName);
    set(W + 'Employer/Addr', a.employerAddr);
    set(W + 'Location/Prov', a.workProv);
    set(W + 'Location/City', a.workCity);
    set(W + 'Location/Addr', a.workAddr);
    set(W + 'Occupation/Job', a.jobTitle);
    set(W + 'Occupation/Desc', a.jobDesc);
    set(W + 'Duration/FromDate', a.workFrom);
    set(W + 'Duration/ToDate', a.workTo);
    set(W + 'Duration/LMO', lawyer.lmia);
    if (a.workProv === '05') {
      set(W + 'CAQ/CertNum', a.caqNum);
      set(W + 'CAQ/CertExpiry', a.caqExpiry);
    }
    set(W + 'ProvNominee/ProvNominee', a.pnpYN);
  }
  const ED = 'Page3/Education/';
  set(ED + 'EducationIndicator', a.eduYN);
  if (Y(a.eduYN)) {
    month(ED + 'EduLine1/From/YYYY', ED + 'EduLine1/From/MM', a.eduFrom);
    month(ED + 'EduLine2/To/YYYY', ED + 'EduLine2/To/MM', a.eduTo);
    set(ED + 'EduLine1/FieldOfStudy', a.eduField);
    set(ED + 'EduLine1/School', a.eduSchool);
    set(ED + 'EduLine2/City', a.eduCity);
    set(ED + 'EduLine2/Country', a.eduCountry);
    if (a.eduCountry === '511') set(ED + 'EduLine2/Prov', a.eduProv);
  }
  // Co-op and post-graduation permits: the employment section is not required (IMM 5710 instructions).
  const jobs = a.permitType === 'COWP' || a.permitType === 'PGWP' ? [] : a.jobs || [];
  ['Page3/Employment/EmpRec1/', 'Page4/EmpRec2/', 'Page4/EmpRec3/'].forEach((base, i) => {
    const j = jobs[i];
    if (!j) return;
    month(base + 'Line1/From/YYYY', base + 'Line1/From/MM', j.from);
    month(base + 'Line2/To/YYYY', base + 'Line2/To/MM', j.to);
    set(base + 'Line1/Occupation', j.occupation);
    set(base + 'Line1/Employer', j.employer);
    set(base + 'Line2/City', j.city);
    set(base + 'Line2/Country', j.country);
    if (j.country === '511') set(base + 'Line2/ProvState', j.prov);
  });

  // Page 4: background
  const B = 'Page4/BackgroundInfo/';
  set(B + 'HealthQ/qANY', a.healthA);
  set(B + 'HealthQ/qBNY', a.healthB);
  if (Y(a.healthA) || Y(a.healthB)) set(B + 'HealthQ/MedicalDetails', a.healthDetails);
  set(B + 'PrevApplied/qANY', a.overstay);
  set(B + 'PrevApplied/qBNY', a.refused);
  set(B + 'PrevApplied/qCNY', a.appliedBefore);
  if (Y(a.overstay) || Y(a.refused) || Y(a.appliedBefore)) set(B + 'PrevApplied/refusedDetails', a.prevDetails);
  set(B + 'Criminal/qANY', a.criminal);
  if (Y(a.criminal)) set(B + 'Criminal/refusedDetails', a.criminalDetails);
  set(B + 'Military/qANY', a.military);
  if (Y(a.military)) set(B + 'Military/militaryServiceDetails', a.militaryDetails);
  set(B + 'GovPosition/qGovtNY', a.political);
  set(B + 'Illtreatment/qWitnessNY', a.witness);
  set('Page4/Signature/FutureComm', a.futureComm);
  return out;
};
