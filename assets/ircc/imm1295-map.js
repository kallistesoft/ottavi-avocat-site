// Questionnaire answers (assets/formulaire/form-def.js, version 3, client outside Canada) -> IMM 1295 XFA data paths
// (under form1). Values are IRCC codes already (the questionnaire's lists come from IRCC's forms). A field the
// questionnaire hides is never written. `lawyer` = what Me Poughon types on the tool: { uci, lmia }.
// Paths and question numbers: IRCC's IMM 1295 template (tools/ircc/imm1295f.pdf); some of IRCC's own field names
// don't match their question (e.g. Occupation/Choice is question 5, GovPosition/Choice question 6): the comments
// below give the question.
window.IMM1295_MAP = function (a, lawyer) {
  lawyer = lawyer || {};
  const out = [];
  const v = (x) => (x == null ? '' : String(x).trim());
  const set = (path, value) => { if (v(value) !== '') out.push([path, v(value)]); };
  const Y = (x) => x === 'Y';
  const pad = (x) => (/^\d$/.test(v(x)) ? '0' + v(x) : v(x));
  const TEMP = ['03', '04', '05', '06']; // statuses that come with dates (IRCC erases a citizen/PR status given with dates)
  const parts = (iso) => /^(\d{4})-(\d{2})-(\d{2})$/.exec(v(iso));
  const date = (base, iso, ymd) => {
    set(base, iso);
    const m = parts(iso);
    if (m && ymd) { set(ymd[0], m[1]); set(ymd[1], m[2]); set(ymd[2], m[3]); }
  };
  const month = (yPath, mPath, ym) => {
    const m = /^(\d{4})-(\d{2})$/.exec(v(ym));
    if (m) { set(yPath, m[1]); set(mPath, m[2]); }
  };
  const phone = (base, format, type, country, number, ext) => {
    const digits = v(number).replace(/\D/g, '');
    if (!digits) return;
    if (type) set(base + '/Type', type);
    set(base + '/NumberExt', ext);
    set(base + '/ActualNumber', digits);
    if (format === 'other') {
      set(base + '/CanadaUS', '0');
      set(base + '/Other', '1');
      set(base + '/NumberCountry', v(country).replace(/\D/g, ''));
      set(base + '/IntlNumber/IntlNumber', digits);
    } else {
      const d = digits.length === 11 && digits[0] === '1' ? digits.slice(1) : digits;
      set(base + '/CanadaUS', '1');
      set(base + '/Other', '0');
      set(base + '/NANumber/AreaCode', d.slice(0, 3));
      set(base + '/NANumber/FirstThree', d.slice(3, 6));
      set(base + '/NANumber/LastFive', d.slice(6));
    }
  };
  const residence = (row, dates, country, status, other, from, to) => {
    set(row + 'Pays', country);
    set(row + 'Status', status);
    if (status === '06') set(row + 'Other', other);
    if (TEMP.includes(status)) {
      date(row + 'FromDate', from, [dates + 'FromYr', dates + 'FromMM', dates + 'FromDD']);
      date(row + 'ToDate', to, [dates + 'ToYr', dates + 'ToMM', dates + 'ToDD']);
    }
  };

  // Page 1: application, personal details (questions 1-9), marital status (10)
  const P = 'Page1/PersonalDetails/';
  set(P + 'ServiceIn/ServiceIn', a.serviceIn);
  set(P + 'UCIClientID', lawyer.uci);
  set(P + 'Name/FamilyName', a.familyName);
  set(P + 'Name/GivenName', a.givenNames);
  set(P + 'AliasName/AliasNameIndicator/AliasNameIndicator', a.aliasYN);
  if (Y(a.aliasYN)) {
    set(P + 'AliasName/AliasFamilyName', a.aliasFamily);
    set(P + 'AliasName/AliasGivenName', a.aliasGiven);
  }
  set(P + 'Sex/Sex', a.sex);
  set(P + 'DOBYear', a.dobYear);
  set(P + 'DOBMonth', pad(a.dobMonth));
  set(P + 'DOBDay', pad(a.dobDay));
  set(P + 'PlaceBirthCity', a.birthCity);
  set(P + 'PlaceBirthCountry', a.birthCountry);
  set(P + 'Citizenship/Citizenship', a.citizenship);
  residence(P + 'CurrentCOR/Row2/', P + 'CORDates/', a.corOutCountry, a.corOutStatus, a.corOutOther, a.corOutFrom, a.corOutTo);
  set(P + 'PCRIndicator', a.prevCorYN);
  if (Y(a.prevCorYN)) {
    (a.prevCor || []).slice(0, 2).forEach((r, i) =>
      residence(P + 'PreviousCOR/Row' + (i + 2) + '/', P + 'PCRDatesR' + (i + 1) + '/', r.country, r.status, r.other, r.from, r.to));
  }
  set(P + 'SameAsCORIndicator', a.sameCountryYN);
  if (a.sameCountryYN === 'N') {
    residence(P + 'CountryWhereApplying/Row2/', P + 'CWADates/', a.applyCountry, a.applyStatus, a.applyOther, a.applyFromDate, a.applyToDate);
  }
  const M = 'Page1/MaritalStatus/SectionA/';
  set(M + 'MaritalStatus', a.marital);
  if (a.marital === '01' || a.marital === '03') {
    date(M + 'DateOfMarriage', a.marriageDate, [M + 'MarriageDate/FromYr', M + 'MarriageDate/FromMM', M + 'MarriageDate/FromDD']);
    set(M + 'FamilyName', a.spouseFamily);
    set(M + 'GivenName', a.spouseGiven);
  }

  // Page 2: previous relationship (11), languages, passport, national ID, US card, contact
  const S = 'Page2/MaritalStatus/SectionA/';
  set(S + 'PrevMarriedIndicator', a.prevMarriedYN);
  if (Y(a.prevMarriedYN)) {
    set(S + 'PMFamilyName', a.prevFamily);
    set(S + 'GivenName/PMGivenName', a.prevGiven);
    set(S + 'TypeOfRelationship', a.prevType);
    date(S + 'FromDate', a.prevFrom, [S + 'PreviouslyMarriedDates/FromYr', S + 'PreviouslyMarriedDates/FromMM', S + 'PreviouslyMarriedDates/FromDD']);
    date(S + 'ToDate/ToDate', a.prevTo, [S + 'PreviouslyMarriedDates/ToYr', S + 'PreviouslyMarriedDates/ToMM', S + 'PreviouslyMarriedDates/ToDD']);
    const m = parts(a.prevDob);
    if (m) { set(S + 'PrevSpouseDOB/DOBYear', m[1]); set(S + 'PrevSpouseDOB/DOBMonth', m[2]); set(S + 'PrevSpouseDOB/DOBDay', m[3]); }
  }
  const LG = S + 'Languages/';
  set(LG + 'languages/nativeLang/nativeLang', a.nativeLang);
  set(LG + 'languages/ableToCommunicate/ableToCommunicate', a.communicateLang);
  if (a.communicateLang === 'Both') set(LG + 'languages/lov', a.freqLang);
  set(LG + 'LangTestIndicator', a.langTestYN);
  const PP = S + 'Passport/';
  set(PP + 'PassportNum/PassportNum', v(a.passportNum).replace(/\s+/g, '').toUpperCase());
  set(PP + 'CountryofIssue/CountryofIssue', a.passportCountry);
  date(PP + 'IssueDate/IssueDate', a.passportIssue, [PP + 'IssueYYYY', PP + 'IssueMM', PP + 'IssueDD']);
  date(PP + 'ExpiryDate', a.passportExpiry, [PP + 'expiryYYYY', PP + 'expiryMM', PP + 'expiryDD']);
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
  const C = 'Page2/ContactInformation/contact/';
  set(C + 'AddressRow1/POBox/POBox', a.mailPOBox);
  set(C + 'AddressRow1/Apt/AptUnit', a.mailApt);
  set(C + 'AddressRow1/StreetNum/StreetNum', a.mailStreetNum);
  set(C + 'AddressRow1/Streetname/Streetname', a.mailStreet);
  set(C + 'AddressRow2/CityTow/CityTown', a.mailCity);
  set(C + 'AddressRow2/Pays/Pays', a.mailCountry);
  if (a.mailCountry === '511') set(C + 'AddressRow2/ProvinceState/ProvinceState', a.mailProv);
  set(C + 'AddressRow2/PostalCode/PostalCode', a.mailPostal);
  set(C + 'SameAsMailingIndicator', a.sameAddrYN);
  if (a.sameAddrYN === 'N') {
    set(C + 'ResidentialAddressRow1/AptUnit/AptUnit', a.resApt);
    set(C + 'ResidentialAddressRow1/StreetNum/StreetNum', a.resStreetNum);
    set(C + 'ResidentialAddressRow1/StreetName/Streetname', a.resStreet);
    set(C + 'ResidentialAddressRow1/CityTown/CityTown', a.resCity);
    set(C + 'ResidentialAddressRow2/Pays/Pays', a.resCountry);
    if (a.resCountry === '511') set(C + 'ResidentialAddressRow2/ProvinceState/ProvinceState', a.resProv);
    set(C + 'ResidentialAddressRow2/PostalCode/PostalCode', a.resPostal);
  }
  phone(C + 'PhoneNumbers/Phone', a.phoneFormat, a.phoneType, a.phoneCountry, a.phoneNumber, a.phoneExt);
  phone(C + 'PhoneNumbers/AltPhone', a.altFormat, a.altType, a.altCountry, a.altNumber, a.altExt);
  set('Page3/FaxEmail/Email', a.email);

  // Page 3: intended work, education, employment
  set('Page3/DetailsOfIntendedWork/DetailsOfWork/TypeofWork/WorkPermitType', a.permitType);
  if (a.permitType !== 'OWP') {
    set('Page3/DetailsOfIntendedWork/DetailsOfWork/PurposeRow1/EmployerName/EmployerName', a.employerName);
    set('Page3/DetailsOfIntendedWork/DetailsOfWork/PurposeRow1/Address/Address', v(a.employerAddr).replace(/\s*\n\s*/g, ', '));
    const L = 'Page3/IntendedLocationInCanada/intendedLocation/';
    set(L + 'ProvinceState/ProvinceState', a.workProv);
    set(L + 'CityTown/CityTown', a.workCity);
    set(L + 'Address', a.workAddr);
    const D = 'Page3/DetailsOfWorkCont/details/';
    set(D + 'jobTitle', a.jobTitle);
    set(D + 'posDesc', a.jobDesc);
    set(D + 'HowLongStudy/FromDate', a.workFrom);
    set(D + 'HowLongStudy/ToDate', a.workTo);
    set(D + 'LMO/LMO', lawyer.lmia);
  }
  const ED = 'Page3/PageWrapper/Education/';
  set(ED + 'EducationIndicator', a.eduYN);
  if (Y(a.eduYN)) {
    month(ED + 'Edu_Row1/FromYear', ED + 'Edu_Row1/FromMonth', a.eduFrom);
    month(ED + 'Edu_Row1/ToYear', ED + 'Edu_Row1/ToMonth', a.eduTo);
    set(ED + 'Edu_Row1/FieldOfStudy', a.eduField);
    set(ED + 'Edu_Row1/School', a.eduSchool);
    set(ED + 'Edu_Row1/CityTown', a.eduCity);
    set(ED + 'Edu_Row1/Pays/Pays', a.eduCountry);
    if (a.eduCountry === '511') set(ED + 'Edu_Row1/ProvState', a.eduProv);
  }
  (a.jobs || []).slice(0, 3).forEach((j, i) => {
    const R = 'Page3/PageWrapper/Occupation/OccupationRow' + (i + 1) + '/';
    month(R + 'FromYear', R + 'FromMonth', j.from);
    month(R + 'ToYear', R + 'ToMonth', j.to);
    set(R + 'Occupation/Occupation', j.occupation);
    set(R + 'Employer', j.employer);
    set(R + 'CityTown/CityTown', j.city);
    set(R + 'Pays/Pays', j.country);
    if (j.country === '511') set(R + 'ProvState', j.prov);
  });

  // Page 4: background (questions 1-6) and future contact
  set('Page4/BackgroundInfo/Choice[0]', a.healthA); // 1 a) tuberculosis
  set('Page4/BackgroundInfo/Choice[1]', a.healthB); // 1 b) physical or mental disorder
  if (Y(a.healthA) || Y(a.healthB)) set('Page4/BackgroundInfo/Details/MedicalDetails', a.healthDetails);
  set('Page4/BackgroundInfo2/VisaChoice1', a.overstay); // 2 a)
  set('Page4/BackgroundInfo2/VisaChoice2', a.refused); // 2 b)
  set('Page4/BackgroundInfo2/VisaChoice3', a.appliedBefore); // 2 c)
  if (Y(a.overstay) || Y(a.refused) || Y(a.appliedBefore)) set('Page4/BackgroundInfo2/Details/refusedDetails', a.prevDetails);
  set('Page4/PageWrapper/BackgroundInfo3/Choice', a.criminal); // 3
  if (Y(a.criminal)) set('Page4/PageWrapper/BackgroundInfo3/militaryServiceDetails', a.criminalDetails);
  set('Page4/PageWrapper/Military/Choice', a.military); // 4
  if (Y(a.military)) set('Page4/PageWrapper/Military/militaryServiceDetails', a.militaryDetails);
  set('Page4/PageWrapper/Occupation/Choice', a.political); // 5
  set('Page4/PageWrapper/GovPosition/Choice', a.witness); // 6
  set('Page4/Consent0/Choice', a.futureComm); // may IRCC contact you in the future
  return out;
};
