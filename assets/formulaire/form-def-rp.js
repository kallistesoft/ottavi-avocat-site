// Questionnaire for permanent residence (Express Entry profile, then the permanent residence application).
// Merges Me Poughon's « Création de profil Entrée express » questionnaire with a detailed background
// questionnaire (personal details, 10-year addresses and activities, family, public offices, organizations,
// military service, background questions). Each question is asked once.
// Same engine and field types as form-def.js (see the comment at its top). No IRCC tool reads these answers
// (the Express Entry profile and the permanent residence application are filled online), so ids are free.
// Owner rule: the client never sees IRCC form names or numbers.
(function () {
  const t = (fr, en) => ({ fr, en });
  const YN = [{ value: 'Y', label: t('Oui', 'Yes') }, { value: 'N', label: t('Non', 'No') }];
  const yes = (field) => ({ field, in: ['Y'] });
  const opts = (rows) => rows.map(([value, fr, en]) => ({ value, label: t(fr, en || fr) }));
  const NAME = { pattern: "^[A-Za-zéàèùâêîôûëïöüæçœÉÀÈÙÂÊÎÔÛËÏÖÜÆÇŒ][A-Za-zéàèùâêîôûëïöüæçœÉÀÈÙÂÊÎÔÛËÏÖÜÆÇŒ' -]*$",
    patternMsg: t('Lettres, espaces, traits d’union et apostrophes seulement, comme sur le passeport.', 'Letters, spaces, hyphens and apostrophes only, as in the passport.') };
  const yn = (id, fr, en, more) => ({ id, type: 'radio', required: true, options: YN, label: t(fr, en), ...more });
  const txt = (id, fr, en, more) => ({ id, type: 'text', required: true, label: t(fr, en), ...more });
  const area = (id, fr, en, more) => ({ id, type: 'textarea', required: true, label: t(fr, en), ...more });
  const date = (id, fr, en, more) => ({ id, type: 'date', required: true, label: t(fr, en), ...more });
  const country = (id, fr, en, more) => ({ id, type: 'select', list: 'Country', required: true, label: t(fr || 'Pays', en || 'Country'), ...more });
  const from = (more) => ({ id: 'from', type: 'month', required: true, label: t('Du (année et mois)', 'From (year and month)'), ...more });
  const to = (more) => ({ id: 'to', type: 'month', required: true, notBefore: 'from', label: t('Au (année et mois)', 'To (year and month)'), ...more });

  // Spouse or common-law partner: married or common-law.
  const SPOUSE = { field: 'marital', in: ['01', '03'] };
  const WITH_SPOUSE = { field: 'spouseComes', in: ['Y'] };

  const TESTS = opts([['TEF', 'TEF Canada'], ['TCF', 'TCF Canada'], ['IELTS', 'IELTS General Training'], ['CELPIP', 'CELPIP-General'], ['PTE', 'PTE Core']]);
  const tests = (id, who, showIf) => ({
    id, type: 'repeat', max: 2, showIf,
    label: t(`Test de langue${who}`, `Language test${who ? ' (spouse)' : ''}`), add: t('Ajouter un test', 'Add a test'),
    fields: [
      { id: 'lang', type: 'radio', required: true, label: t('Langue', 'Language'), options: opts([['fr', 'Français', 'French'], ['en', 'Anglais', 'English']]) },
      { id: 'test', type: 'select', required: true, label: t('Test', 'Test'), options: TESTS },
      txt('cert', 'Numéro d’attestation ou de certificat', 'Certificate or result number'),
      date('date', 'Date du test', 'Test date', { notFuture: true, hint: t('Le test doit dater de moins de 2 ans à la date de la demande.', 'The test must be less than 2 years old on the application date.') }),
      {
        id: 'scores', type: 'group', label: t('Résultats détaillés', 'Detailed scores'),
        fields: [
          txt('listening', 'Compréhension orale', 'Listening'),
          txt('reading', 'Compréhension écrite', 'Reading'),
          txt('speaking', 'Expression orale', 'Speaking'),
          txt('writing', 'Expression écrite', 'Writing')
        ]
      }
    ]
  });

  const CANADA = { field: 'country', in: ['511'] };
  const diplomas = (id, who, showIf) => ({
    id, type: 'repeat', min: who ? 0 : 1, max: 6, showIf,
    label: t(`Diplôme${who}`, `Diploma${who ? ' (spouse)' : ''}`), add: t('Ajouter un diplôme', 'Add a diploma'),
    fields: [
      { id: 'diplomaNote', type: 'note', text: t('Le plus élevé ou le plus récent en premier. Incluez les études secondaires, collégiales, universitaires et professionnelles.', 'Highest or most recent first. Include secondary, college, university and trade studies.') },
      from(), to(),
      txt('type', 'Type de diplôme ou de certificat obtenu', 'Type of diploma or certificate obtained', { hint: t('Par exemple : brevet professionnel, baccalauréat, maîtrise, doctorat. « Aucun » si les études n’ont pas mené à un diplôme.', 'For example: trade certificate, bachelor’s, master’s, doctorate. “None” if the studies led to no diploma.') }),
      txt('field', 'Domaine d’études ou spécialité', 'Field of study or specialty'),
      txt('school', 'Nom de l’établissement', 'Name of the institution'),
      txt('city', 'Ville de l’établissement', 'City of the institution'),
      country('country', 'Pays de l’établissement', 'Country of the institution'),
      { id: 'years', type: 'number', required: true, min: 0, max: 15, label: t('Nombre d’années d’études complètes réussies (selon le dernier relevé de notes)', 'Number of full years of study completed (as on the last transcript)') },
      { id: 'completion', type: 'select', required: true, label: t('Résultat', 'Outcome'),
        options: opts([['done', 'Réussi, avec diplôme ou certificat', 'Completed, with a diploma or certificate'], ['noDiploma', 'Réussi, sans diplôme ni certificat', 'Completed, without a diploma or certificate'], ['unfinished', 'Non terminé', 'Not completed'], ['ongoing', 'En cours', 'Ongoing']]) },
      { id: 'mode', type: 'radio', required: true, label: t('Modalités', 'Study mode'), options: opts([['full', 'Temps plein', 'Full time'], ['part', 'Temps partiel', 'Part time']]) },
      {
        id: 'canadaBox', type: 'group', label: t('Études au Canada', 'Studies in Canada'), showIf: CANADA,
        fields: [
          txt('schoolType', 'Type d’établissement', 'Type of institution', { hint: t('Par exemple : cégep, université, école de métiers.', 'For example: CEGEP, university, trade school.') }),
          txt('teachLang', 'Langue(s) d’enseignement', 'Language(s) of instruction'),
          yn('over8', 'Ces études vous ont-elles fait séjourner au Canada plus de 8 mois?', 'Did these studies keep you in Canada for more than 8 months?'),
          { id: 'inPerson', type: 'radio', required: true, label: t('Part des cours en présentiel pendant au moins 8 mois', 'Share of in-person classes for at least 8 months'),
            options: opts([['over', '50 % ou plus', '50% or more'], ['under', 'Moins de 50 %', 'Less than 50%']]) }
        ]
      },
      {
        // Educational credential assessment: only for a diploma from outside Canada.
        id: 'ecaBox', type: 'group', label: t('Évaluation des diplômes d’études (EDE)', 'Educational credential assessment (ECA)'), showIf: { field: 'country', notIn: ['511', ''] },
        fields: [
          { id: 'ecaYN', type: 'radio', required: true, options: YN, label: t('Avez-vous fait évaluer ce diplôme?', 'Did you have this diploma assessed?') },
          txt('ecaOrg', 'Organisme', 'Organization', { showIf: { field: 'ecaYN', in: ['Y'] }, hint: t('Par exemple : WES, ICAS, IQAS, CES, ordre professionnel désigné.', 'For example: WES, ICAS, IQAS, CES, designated professional body.') }),
          txt('ecaRef', 'Numéro de référence du rapport', 'Report reference number', { showIf: { field: 'ecaYN', in: ['Y'] } }),
          date('ecaDate', 'Date du rapport', 'Report date', { notFuture: true, showIf: { field: 'ecaYN', in: ['Y'] } }),
          txt('ecaEquiv', 'Équivalence canadienne exacte', 'Exact Canadian equivalency', { showIf: { field: 'ecaYN', in: ['Y'] } })
        ]
      }
    ]
  });

  const qualif = (id, fr, en, showIf) => [
    yn(id, fr, en, { showIf }),
    {
      id: id + 'Box', type: 'group', label: t('Certificat de qualification', 'Certificate of qualification'), showIf: yes(id),
      fields: [
        { id: id + 'Auth', type: 'radio', required: true, label: t('Autorité émettrice', 'Issuing authority'), options: opts([['prov', 'Provinciale ou territoriale', 'Provincial or territorial'], ['fed', 'Fédérale', 'Federal']]) },
        txt(id + 'Trade', 'Métier spécialisé (appellation et code CNP)', 'Skilled trade (title and NOC code)')
      ]
    }
  ];

  const jobs = (id, who, showIf) => ({
    id, type: 'repeat', min: who ? 0 : 1, max: 20, showIf,
    label: t(`Activité${who}`, `Activity${who ? ' (spouse)' : ''}`), add: t('Ajouter une activité', 'Add an activity'),
    fields: [
      { id: 'kind', type: 'select', required: true, label: t('Type d’activité', 'Type of activity'),
        options: opts([['job', 'Emploi ou stage rémunéré', 'Job or paid internship'], ['self', 'Travail autonome', 'Self-employed'], ['study', 'Études', 'Studies'], ['search', 'Recherche d’emploi', 'Job search'], ['inactive', 'Inactivité (maladie, maternité, voyage, détention, etc.)', 'Inactivity (illness, maternity, travel, detention, etc.)']]) },
      txt('title', 'Intitulé exact du poste ou de l’activité', 'Exact job or activity title', { hint: t('« Recherche d’emploi », « Études » ou « Inactivité » pour une période sans emploi.', '“Job search”, “Studies” or “Inactivity” for a period without work.') }),
      txt('employer', 'Nom de l’employeur ou de l’établissement', 'Name of the employer or institution', { hint: t('Intérim : le nom de l’agence. Aucun : « s.o. ».', 'Temp work: the agency’s name. None: “n/a”.') }),
      txt('city', 'Ville', 'City'),
      country('country'),
      date('from', 'Du', 'From', { notFuture: true }),
      { id: 'current', type: 'checkbox', label: t('C’est mon activité actuelle', 'This is my current activity') },
      date('to', 'Au', 'To', { notFuture: true, notBefore: 'from', showIf: { field: 'current', notIn: ['Y'] } }),
      { id: 'inactiveWhy', type: 'text', required: true, showIf: { field: 'kind', in: ['inactive'] }, label: t('Raison de l’inactivité', 'Reason for inactivity') },
      { id: 'hours', type: 'text', required: true, showIf: { field: 'kind', in: ['job', 'self'] }, label: t('Heures par semaine', 'Hours per week'), hint: t('Si c’est un forfait, précisez.', 'If it is a flat rate, say so.') },
      { id: 'salary', type: 'text', required: true, showIf: { field: 'kind', in: ['job', 'self'] }, label: t('Salaire annuel (avec la devise)', 'Annual salary (with the currency)') },
      { id: 'duties', type: 'textarea', required: true, showIf: { field: 'kind', in: ['job', 'self'] }, label: t('Fonctions principales', 'Main duties') },
      { id: 'noc', type: 'text', showIf: { field: 'kind', in: ['job', 'self'] }, label: t('Code CNP (si vous le connaissez)', 'NOC code (if you know it)') },
      { id: 'qualified', type: 'date', notFuture: true, showIf: { field: 'kind', in: ['job', 'self'] }, label: t('Date où vous êtes devenu(e) qualifié(e) pour cet emploi', 'Date you became qualified for this job'),
        hint: t('En pratique : la date du diplôme, de la réussite d’un concours, etc.', 'In practice: the date of the diploma, of passing an exam, etc.') }
    ]
  });

  const stays = (id, who, showIf) => ({
    id, type: 'repeat', max: 10, showIf,
    label: t(`Séjour de plus de 6 mois${who}`, `Stay of more than 6 months${who ? ' (spouse)' : ''}`), add: t('Ajouter un pays', 'Add a country'),
    fields: [country('country', 'Pays', 'Country'), from(), to(), txt('status', 'Statut dans ce pays', 'Status in that country', { hint: t('Par exemple : visiteur, étudiant, travailleur, résident permanent.', 'For example: visitor, student, worker, permanent resident.') })]
  });

  // A relative: name, relationship, birth or death, occupation, birth country, citizenship, address.
  const person = (extra) => [
    txt('name', 'Prénom et nom', 'Given name and family name'),
    ...(extra || []),
    date('dob', 'Date de naissance', 'Date of birth', { notFuture: true }),
    { id: 'deceased', type: 'checkbox', label: t('Décédé(e)', 'Deceased') },
    date('dod', 'Date du décès', 'Date of death', { notFuture: true, showIf: { field: 'deceased', in: ['Y'] } }),
    txt('job', 'Profession', 'Occupation', { showIf: { field: 'deceased', notIn: ['Y'] } }),
    { id: 'birthCountry', type: 'select', list: 'CountryOfBirth', required: true, label: t('Pays de naissance', 'Country of birth') },
    { id: 'citizen', type: 'select', list: 'CountryOfCitizenship', required: true, label: t('Citoyenneté', 'Citizenship') },
    txt('address', 'Adresse actuelle (ville et pays au minimum)', 'Current address (at least city and country)', { showIf: { field: 'deceased', notIn: ['Y'] } })
  ];

  const address = (p, label, showIf) => ({
    id: p, type: 'group', label, showIf,
    fields: [
      txt(p + 'Street', 'Numéro, rue, appartement', 'Number, street, apartment'),
      txt(p + 'City', 'Ville', 'City'),
      country(p + 'Country'),
      { id: p + 'Prov', type: 'select', list: 'ProvinceAbbrev', required: true, showIf: { field: p + 'Country', in: ['511'] }, label: t('Province', 'Province') },
      { id: p + 'Region', type: 'text', showIf: { field: p + 'Country', notIn: ['511'] }, label: t('Province, État ou région', 'Province, state or region') },
      { id: p + 'Postal', type: 'text', label: t('Code postal', 'Postal code') }
    ]
  });

  window.OTTAVI_FORM = {
    id: 'ottavi-rp',
    version: 1,
    title: t('Immigration permanente – Questionnaire', 'Permanent immigration – Questionnaire'),
    sections: [
      {
        id: 'demande',
        title: t('Votre demande', 'Your application'),
        lead: t('Répondez avec attention : toutes les informations doivent être strictement conformes à vos documents officiels.', 'Answer carefully: every answer must match your official documents exactly.'),
        fields: [
          yn('appliedBefore', 'Avez-vous déjà fait une demande auprès d’Immigration Canada (visa, permis, résidence permanente, etc.)?', 'Have you ever applied to Immigration Canada (visa, permit, permanent residence, etc.)?'),
          txt('uci', 'Votre IUC (identificateur unique de client), s’il y a lieu', 'Your UCI (unique client identifier), if any', { required: false, showIf: yes('appliedBefore'), hint: t('Le numéro à 8 ou 10 chiffres sur vos documents d’immigration.', 'The 8- or 10-digit number on your immigration documents.') }),
          txt('prevEE', 'Numéro de votre ancien profil Entrée express, s’il y a lieu', 'Number of your previous Express Entry profile, if any', { required: false, showIf: yes('appliedBefore') }),
          {
            id: 'provBox', type: 'group', label: t('Province d’intérêt', 'Province of interest'),
            fields: [
              { id: 'provWanted', type: 'select', required: true, label: t('Province ou territoire visé', 'Province or territory you want'),
                hint: t('Le Québec a son propre processus de sélection.', 'Quebec has its own selection process.'),
                options: opts([['any', 'Indifférent', 'No preference'], ['AB', 'Alberta'], ['BC', 'Colombie-Britannique', 'British Columbia'], ['PE', 'Île-du-Prince-Édouard', 'Prince Edward Island'],
                  ['MB', 'Manitoba'], ['NB', 'Nouveau-Brunswick', 'New Brunswick'], ['NS', 'Nouvelle-Écosse', 'Nova Scotia'], ['NU', 'Nunavut'], ['ON', 'Ontario'], ['SK', 'Saskatchewan'],
                  ['NL', 'Terre-Neuve-et-Labrador', 'Newfoundland and Labrador'], ['NT', 'Territoires du Nord-Ouest', 'Northwest Territories'], ['YT', 'Yukon']]) },
              yn('pnp', 'Avez-vous un certificat de désignation d’une province ou d’un territoire?', 'Do you have a nomination certificate from a province or territory?'),
              txt('pnpDetails', 'Province, numéro et date du certificat', 'Province, number and date of the certificate', { showIf: yes('pnp') }),
              { id: 'liveAt', type: 'text', label: t('Où comptez-vous vivre au Canada? (adresse complète si vous la connaissez)', 'Where do you plan to live in Canada? (full address if known)') }
            ]
          },
          { id: 'funds', type: 'text', required: true, inputmode: 'numeric', label: t('Fonds d’établissement disponibles (en $ CA)', 'Settlement funds available (in CAD)'),
            hint: t('Le total de vos avoirs liquides et disponibles, sans dettes ni obligations.', 'The total of your liquid, available assets, free of debts or obligations.') }
        ]
      },
      {
        id: 'identite',
        title: t('Identité', 'Identity'),
        fields: [
          { id: 'namesNote', type: 'note', text: t('Écrivez vos noms en LETTRES CAPITALES, exactement comme sur votre passeport.', 'Write your names in CAPITAL LETTERS, exactly as in your passport.') },
          txt('familyName', 'Nom de famille', 'Family name', { autocomplete: 'family-name', ...NAME }),
          txt('givenNames', 'Prénom(s)', 'Given name(s)', { required: false, autocomplete: 'given-name', ...NAME }),
          { id: 'otherNames', type: 'text', label: t('Autres noms utilisés (nom de jeune fille, alias, etc.)', 'Other names used (maiden name, alias, etc.)') },
          { id: 'sex', type: 'select', list: 'GenderMel', required: true, label: t('Sexe', 'Sex') },
          date('dob', 'Date de naissance', 'Date of birth', { notFuture: true }),
          txt('birthCity', 'Ville ou village de naissance', 'City or town of birth'),
          { id: 'birthCountry', type: 'select', list: 'CountryOfBirth', required: true, label: t('Pays de naissance', 'Country of birth') },
          { id: 'citizenship', type: 'select', list: 'CountryOfCitizenship', required: true, label: t('Citoyenneté', 'Citizenship') },
          { id: 'citizenship2', type: 'select', list: 'CountryOfCitizenship', label: t('Autre citoyenneté (s’il y a lieu)', 'Other citizenship (if any)') },
          country('residence', 'Pays de résidence actuel', 'Current country of residence'),
          txt('motherTongue', 'Langue maternelle', 'Native language'),
          { id: 'otherLangs', type: 'text', label: t('Autres langues parlées', 'Other languages spoken') },
          { id: 'height', type: 'number', required: true, min: 50, max: 250, label: t('Taille (en cm)', 'Height (in cm)') },
          txt('eyes', 'Couleur des yeux', 'Eye colour'),
          txt('hair', 'Couleur des cheveux', 'Hair colour')
        ]
      },
      {
        id: 'coordonnees',
        title: t('Coordonnées', 'Contact details'),
        fields: [
          address('mail', t('Adresse postale actuelle', 'Current mailing address')),
          yn('sameAddress', 'Votre adresse résidentielle est-elle la même que votre adresse postale?', 'Is your residential address the same as your mailing address?'),
          address('home', t('Adresse résidentielle actuelle', 'Current residential address'), { field: 'sameAddress', in: ['N'] }),
          { id: 'phone', type: 'tel', required: true, autocomplete: 'tel', label: t('Téléphone cellulaire (avec l’indicatif du pays)', 'Mobile phone (with the country code)') },
          { id: 'phoneWork', type: 'tel', label: t('Téléphone du travail ou autre', 'Work or other phone') },
          { id: 'email', type: 'email', required: true, autocomplete: 'email', label: t('Adresse courriel', 'Email address') }
        ]
      },
      {
        id: 'documents',
        title: t('Pièces d’identité', 'Identity documents'),
        fields: [
          {
            id: 'passport', type: 'group', label: t('Passeport', 'Passport'),
            fields: [
              txt('passNo', 'Numéro de passeport', 'Passport number'),
              { id: 'passCountry', type: 'select', list: 'CountryTravelDocument', required: true, label: t('Pays de délivrance', 'Country of issue') },
              txt('passPlace', 'Lieu de délivrance', 'Place of issue'),
              date('passIssue', 'Date de délivrance', 'Issue date', { notFuture: true }),
              date('passExpiry', 'Date d’expiration', 'Expiry date', { after: 'passIssue' })
            ]
          },
          yn('nidYN', 'Avez-vous une carte d’identité nationale?', 'Do you have a national identity card?'),
          {
            id: 'nid', type: 'group', label: t('Carte d’identité nationale', 'National identity card'), showIf: yes('nidYN'),
            fields: [
              txt('nidNo', 'Numéro', 'Number'),
              country('nidCountry', 'Pays de délivrance', 'Country of issue'),
              date('nidIssue', 'Date de délivrance', 'Issue date', { notFuture: true }),
              date('nidExpiry', 'Date d’expiration', 'Expiry date', { required: false, after: 'nidIssue' })
            ]
          }
        ]
      },
      {
        id: 'famille',
        title: t('Famille', 'Family'),
        lead: t('Indiquez toute votre famille, même les personnes qui ne viennent pas au Canada avec vous.', 'List all your family, even those not coming to Canada with you.'),
        fields: [
          { id: 'marital', type: 'select', list: 'MaritalStatus', required: true, label: t('État civil', 'Marital status') },
          date('unionDate', 'Date du mariage ou du début de l’union de fait', 'Date of marriage or start of the common-law relationship', { notFuture: true, showIf: SPOUSE }),
          {
            id: 'spouse', type: 'group', label: t('Votre époux(se) ou conjoint(e) de fait', 'Your spouse or common-law partner'), showIf: SPOUSE,
            fields: [
              txt('spFamily', 'Nom de famille', 'Family name', NAME),
              txt('spGiven', 'Prénom(s)', 'Given name(s)', { required: false, ...NAME }),
              date('spDob', 'Date de naissance', 'Date of birth', { notFuture: true }),
              txt('spJob', 'Profession', 'Occupation'),
              { id: 'spBirthCountry', type: 'select', list: 'CountryOfBirth', required: true, label: t('Pays de naissance', 'Country of birth') },
              { id: 'spCitizen', type: 'select', list: 'CountryOfCitizenship', required: true, label: t('Citoyenneté', 'Citizenship') },
              txt('spAddress', 'Adresse actuelle', 'Current address'),
              yn('spouseComes', 'Vous accompagne-t-il ou elle au Canada?', 'Is your spouse or partner coming to Canada with you?')
            ]
          },
          yn('prevUnionYN', 'Avez-vous déjà été marié(e) ou en union de fait (plus de 12 mois) avec une autre personne?', 'Have you ever been married or in a common-law relationship (over 12 months) with someone else?'),
          {
            id: 'prevUnions', type: 'repeat', min: 1, max: 5, showIf: yes('prevUnionYN'),
            label: t('Union antérieure', 'Previous relationship'), add: t('Ajouter une union', 'Add a relationship'),
            fields: [
              txt('family', 'Nom de famille', 'Family name', NAME),
              txt('given', 'Prénom(s)', 'Given name(s)', { required: false, ...NAME }),
              date('dob', 'Date de naissance', 'Date of birth', { notFuture: true }),
              { id: 'sex', type: 'select', list: 'GenderMel', required: true, label: t('Sexe', 'Sex') },
              { id: 'kind', type: 'radio', required: true, label: t('Type d’union', 'Type of relationship'), options: opts([['married', 'Mariage', 'Marriage'], ['commonLaw', 'Union de fait', 'Common-law']]) },
              date('from', 'Du', 'From', { notFuture: true }),
              date('to', 'Au', 'To', { notFuture: true, notBefore: 'from' })
            ]
          },
          {
            id: 'parents', type: 'repeat', min: 2, max: 2,
            label: t('Parent', 'Parent'), add: t('Ajouter un parent', 'Add a parent'),
            fields: person([{ id: 'rel', type: 'radio', required: true, label: t('Lien', 'Relationship'), options: opts([['mother', 'Mère', 'Mother'], ['father', 'Père', 'Father']]) }])
          },
          yn('childrenYN', 'Avez-vous des enfants?', 'Do you have children?', { hint: t('Tous vos fils et filles, adoptés ou beaux-enfants, quel que soit leur âge ou leur lieu de résidence.', 'All your sons and daughters, adopted or step-children, whatever their age or where they live.') }),
          {
            id: 'children', type: 'repeat', min: 1, max: 12, showIf: yes('childrenYN'),
            label: t('Enfant', 'Child'), add: t('Ajouter un enfant', 'Add a child'),
            fields: person([
              { id: 'rel', type: 'select', required: true, label: t('Lien', 'Relationship'), options: opts([['son', 'Fils', 'Son'], ['daughter', 'Fille', 'Daughter'], ['adopted', 'Enfant adopté', 'Adopted child'], ['step', 'Bel-enfant', 'Step-child']]) },
              { id: 'marital', type: 'select', list: 'MaritalStatus', required: true, label: t('État civil', 'Marital status') }
            ]).concat([
              yn('comes', 'Vient-il ou elle au Canada avec vous?', 'Is this child coming to Canada with you?'),
              yn('abroad', 'Au cours des 5 dernières années, a-t-il ou elle vécu plus de 6 mois dans un autre pays que celui de sa citoyenneté ou de sa résidence actuelle?', 'In the past 5 years, did this child live more than 6 months in a country other than that of citizenship or current residence?'),
              area('abroadDetails', 'Pays, statut, date d’arrivée et date de départ', 'Country, status, arrival date and departure date', { showIf: yes('abroad') })
            ])
          },
          { id: 'dependentsNote', type: 'note', showIf: yes('childrenYN'), text: t('Enfant à charge : moins de 22 ans à la date de la demande et sans époux ni conjoint de fait, ou plus âgé s’il ne peut subvenir à ses besoins en raison d’un état physique ou mental. Les enfants à charge de votre époux ou conjoint(e) comptent aussi.', 'Dependent child: under 22 on the application date and without a spouse or partner, or older if unable to support themselves because of a physical or mental condition. Your spouse’s or partner’s dependent children count too.') },
          yn('siblingsYN', 'Avez-vous des frères ou sœurs (y compris demi-frères et demi-sœurs)?', 'Do you have brothers or sisters (including half-brothers and half-sisters)?'),
          {
            id: 'siblings', type: 'repeat', min: 1, max: 15, showIf: yes('siblingsYN'),
            label: t('Frère ou sœur', 'Brother or sister'), add: t('Ajouter un frère ou une sœur', 'Add a brother or sister'),
            fields: person([
              { id: 'rel', type: 'select', required: true, label: t('Lien', 'Relationship'), options: opts([['brother', 'Frère', 'Brother'], ['sister', 'Sœur', 'Sister'], ['half-brother', 'Demi-frère', 'Half-brother'], ['half-sister', 'Demi-sœur', 'Half-sister']]) },
              { id: 'marital', type: 'select', list: 'MaritalStatus', required: true, label: t('État civil', 'Marital status') }
            ])
          },
          yn('canadaFamilyYN', 'Avez-vous de la famille au Canada?', 'Do you have family in Canada?'),
          {
            id: 'canadaFamily', type: 'repeat', min: 1, max: 10, showIf: yes('canadaFamilyYN'),
            label: t('Parent au Canada', 'Relative in Canada'), add: t('Ajouter une personne', 'Add a person'),
            fields: [
              txt('rel', 'Lien de parenté', 'Relationship'),
              txt('name', 'Prénom et nom', 'Given name and family name'),
              { id: 'age', type: 'number', required: true, min: 0, max: 120, label: t('Âge', 'Age') },
              { id: 'status', type: 'select', required: true, label: t('Statut au Canada', 'Status in Canada'), options: opts([['citizen', 'Citoyen(ne) canadien(ne)', 'Canadian citizen'], ['pr', 'Résident(e) permanent(e)', 'Permanent resident'], ['temp', 'Résident(e) temporaire', 'Temporary resident'], ['other', 'Autre', 'Other']]) },
              { id: 'prov', type: 'select', list: 'ProvinceAbbrev', required: true, label: t('Province de résidence', 'Province of residence') },
              txt('address', 'Adresse complète', 'Full address'),
              { id: 'phone', type: 'tel', label: t('Téléphone', 'Phone') }
            ]
          }
        ]
      },
      {
        id: 'langues',
        title: t('Tests de langue', 'Language tests'),
        lead: t('Les tests doivent dater de moins de 2 ans à la date de la demande.', 'Tests must be less than 2 years old on the application date.'),
        fields: [
          yn('testYN', 'Avez-vous passé un test de français ou d’anglais reconnu?', 'Have you taken a recognized French or English test?'),
          tests('tests', '', yes('testYN')),
          yn('spTestYN', 'Votre époux(se) ou conjoint(e) a-t-il ou elle passé un test de langue reconnu?', 'Has your spouse or partner taken a recognized language test?', { showIf: WITH_SPOUSE }),
          tests('spTests', ' (conjoint)', yes('spTestYN'))
        ]
      },
      {
        id: 'etudes',
        title: t('Études', 'Education'),
        fields: [
          {
            id: 'yearsBox', type: 'group', label: t('Nombre d’années d’études réussies, par niveau', 'Years of study completed, by level'),
            fields: [
              { id: 'yPrimary', type: 'number', required: true, min: 0, max: 15, label: t('Primaire', 'Primary') },
              { id: 'ySecondary', type: 'number', required: true, min: 0, max: 15, label: t('Secondaire', 'Secondary') },
              { id: 'yUniversity', type: 'number', required: true, min: 0, max: 20, label: t('Collégial ou universitaire', 'College or university') },
              { id: 'yTrade', type: 'number', required: true, min: 0, max: 15, label: t('Professionnel ou métier', 'Trade or vocational') }
            ]
          },
          diplomas('diplomas', ''),
          ...qualif('qualYN', 'Avez-vous un certificat de qualification (ou d’aptitude) dans un métier, délivré au Canada?', 'Do you have a certificate of qualification in a trade, issued in Canada?'),
          { id: 'spEduNote', type: 'note', showIf: WITH_SPOUSE, text: t('Les études de votre époux(se) ou conjoint(e), le plus élevé en premier.', 'Your spouse’s or partner’s education, highest first.') },
          diplomas('spDiplomas', ' (conjoint)', WITH_SPOUSE),
          ...qualif('spQualYN', 'Votre époux(se) ou conjoint(e) a-t-il ou elle un certificat de qualification dans un métier, délivré au Canada?', 'Does your spouse or partner have a certificate of qualification in a trade, issued in Canada?', WITH_SPOUSE)
        ]
      },
      {
        id: 'emplois',
        title: t('Activités des 10 dernières années', 'Activities of the past 10 years'),
        lead: t('Toutes vos activités depuis 10 ans, la plus récente en premier : emplois, stages rémunérés, emplois saisonniers, études, recherche d’emploi, inactivité. Aucune période ne doit manquer.', 'All your activities over the past 10 years, most recent first: jobs, paid internships, seasonal work, studies, job search, inactivity. No period may be missing.'),
        fields: [
          jobs('jobs', ''),
          { id: 'spJobsNote', type: 'note', showIf: WITH_SPOUSE, text: t('Les activités de votre époux(se) ou conjoint(e) depuis 10 ans, la plus récente en premier.', 'Your spouse’s or partner’s activities over the past 10 years, most recent first.') },
          jobs('spJobs', ' (conjoint)', WITH_SPOUSE)
        ]
      },
      {
        id: 'offre',
        title: t('Offre d’emploi au Canada', 'Job offer in Canada'),
        fields: [
          yn('offerYN', 'Avez-vous une offre d’emploi au Canada?', 'Do you have a job offer in Canada?'),
          {
            id: 'offer', type: 'group', label: t('Votre offre d’emploi', 'Your job offer'), showIf: yes('offerYN'),
            fields: [
              txt('offerTitle', 'Titre du poste', 'Job title'),
              txt('offerEmployer', 'Nom de l’employeur', 'Employer’s name'),
              txt('offerHours', 'Heures par semaine', 'Hours per week'),
              txt('offerWage', 'Salaire horaire', 'Hourly wage'),
              { id: 'offerProv', type: 'select', list: 'ProvinceAbbrev', required: true, label: t('Province', 'Province') },
              txt('offerCity', 'Ville', 'City'),
              area('offerDuties', 'Fonctions principales', 'Main duties'),
              { id: 'offerNoc', type: 'text', label: t('Code CNP (si vous le connaissez)', 'NOC code (if you know it)') },
              { id: 'offerLmia', type: 'text', label: t('Numéro d’EIMT ou code de dispense (s’il y a lieu)', 'LMIA number or exemption code (if any)') }
            ]
          }
        ]
      },
      {
        id: 'parcours',
        title: t('Adresses et séjours', 'Addresses and stays'),
        fields: [
          { id: 'addrNote', type: 'note', text: t('Toutes les adresses où vous avez vécu depuis 10 ans, la plus récente en premier, sans période manquante. Incluez les séjours temporaires dans les pays traversés pour venir au Canada.', 'Every address you have lived at over the past 10 years, most recent first, with no gap. Include temporary stays in countries you passed through to come to Canada.') },
          {
            id: 'addresses', type: 'repeat', min: 1, max: 25,
            label: t('Adresse', 'Address'), add: t('Ajouter une adresse', 'Add an address'),
            fields: [
              from(), { id: 'current', type: 'checkbox', label: t('J’y habite encore', 'I still live there') },
              to({ showIf: { field: 'current', notIn: ['Y'] } }),
              txt('street', 'Numéro, rue', 'Number, street'),
              txt('city', 'Ville', 'City'),
              { id: 'region', type: 'text', label: t('Province, État ou région', 'Province, state or region') },
              country('country'),
              { id: 'postal', type: 'text', label: t('Code postal', 'Postal code') }
            ]
          },
          yn('staysYN', 'Au cours des 10 dernières années, avez-vous vécu plus de 6 mois de suite dans un pays autre que celui de votre citoyenneté ou de votre résidence actuelle (hors Canada)?', 'In the past 10 years, did you live more than 6 months in a row in a country other than that of your citizenship or current residence (other than Canada)?'),
          stays('stays', '', yes('staysYN')),
          yn('spStaysYN', 'Votre époux(se) ou conjoint(e) aussi?', 'Your spouse or partner too?', { showIf: SPOUSE }),
          stays('spStays', ' (conjoint)', yes('spStaysYN')),
          yn('beenInCanada', 'Êtes-vous déjà venu(e) au Canada?', 'Have you ever been to Canada?'),
          {
            id: 'canadaStays', type: 'group', label: t('Vos séjours au Canada', 'Your stays in Canada'), showIf: yes('beenInCanada'),
            fields: [
              date('firstEntry', 'Date de la première entrée', 'Date of first entry', { notFuture: true }),
              txt('firstPlace', 'Lieu (ville et province)', 'Place (city and province)'),
              txt('firstReason', 'Raison de l’entrée', 'Reason for entry'),
              date('lastEntry', 'Date de la dernière entrée', 'Date of last entry', { notFuture: true, notBefore: 'firstEntry' }),
              txt('lastPlace', 'Lieu (ville et province)', 'Place (city and province)'),
              txt('lastReason', 'Raison de l’entrée', 'Reason for entry'),
              { id: 'route', type: 'textarea', label: t('Votre trajet de votre pays jusqu’au Canada (facultatif)', 'Your route from your country to Canada (optional)'),
                hint: t('Pour chaque étape : dates, aéroport, port ou ville d’arrivée, moyen (avion, bateau, voie terrestre) et qui vous a aidé, s’il y a lieu.', 'For each leg: dates, airport, port or city of arrival, means (air, sea, land) and who helped you, if anyone.') }
            ]
          }
        ]
      },
      {
        id: 'engagements',
        title: t('Fonctions, organisations, service militaire', 'Offices, organizations, military service'),
        fields: [
          yn('officeYN', 'Avez-vous déjà occupé une charge publique (fonctionnaire, juge, policier, maire, député, etc.)?', 'Have you ever held a public office (civil servant, judge, police officer, mayor, member of parliament, etc.)?'),
          {
            id: 'offices', type: 'repeat', min: 1, max: 10, showIf: yes('officeYN'),
            label: t('Charge publique', 'Public office'), add: t('Ajouter une charge', 'Add an office'),
            fields: [from(), to(), country('country'),
              { id: 'level', type: 'select', required: true, label: t('Sphère de compétence', 'Level'), options: opts([['national', 'Nationale', 'National'], ['regional', 'Régionale', 'Regional'], ['municipal', 'Municipale', 'Municipal']]) },
              txt('dept', 'Service ou direction (sans abréviation)', 'Department or branch (no abbreviation)'),
              txt('role', 'Activités ou postes occupés', 'Activities or positions held')]
          },
          yn('orgYN', 'Avez-vous déjà été membre, sympathisant ou affilié d’une organisation (parti politique, syndicat, association professionnelle, groupe social, de jeunes ou d’étudiants, etc.)?', 'Have you ever been a member, supporter or affiliate of an organization (political party, union, professional association, social, youth or student group, etc.)?'),
          {
            id: 'orgs', type: 'repeat', min: 1, max: 15, showIf: yes('orgYN'),
            label: t('Organisation', 'Organization'), add: t('Ajouter une organisation', 'Add an organization'),
            fields: [from(), { id: 'current', type: 'checkbox', label: t('J’en fais encore partie', 'I am still a member') }, to({ showIf: { field: 'current', notIn: ['Y'] } }),
              txt('name', 'Nom de l’organisation (sans abréviation)', 'Name of the organization (no abbreviation)'), txt('place', 'Ville et pays', 'City and country'),
              txt('type', 'Type d’organisation', 'Type of organization'), txt('role', 'Activités ou postes occupés', 'Activities or positions held')]
          },
          yn('militaryYN', 'Avez-vous déjà servi dans une armée, une milice, une unité de défense civile, un service de renseignement ou un corps de police (y compris le service national et les réserves)?', 'Have you ever served in any military, militia, civil defence unit, intelligence service or police force (including national service and reserves)?'),
          {
            id: 'military', type: 'repeat', min: 1, max: 5, showIf: yes('militaryYN'),
            label: t('Service', 'Service'), add: t('Ajouter un service', 'Add a service'),
            fields: [country('country', 'Pays servi', 'Country served'), from(), to(),
              txt('unit', 'Branche, numéro de l’unité et nom du commandant', 'Branch, unit number and commanding officer’s name'),
              txt('rank', 'Grade(s)', 'Rank(s)'),
              { id: 'combat', type: 'textarea', label: t('Dates et lieux de tout combat actif (s’il y a lieu)', 'Dates and places of any active combat (if any)') }]
          }
        ]
      },
      {
        id: 'antecedents',
        title: t('Antécédents', 'Background'),
        lead: t('Répondez à chaque question. Me Poughon est tenue au secret professionnel.', 'Answer every question. Ms. Poughon is bound by professional secrecy.'),
        fields: [
          { id: 'bgWho', type: 'note', text: t('Les questions de santé concernent vous et les membres de votre famille.', 'The health questions cover you and your family members.') },
          yn('tb', 'Au cours des 2 dernières années, vous ou un membre de votre famille avez-vous eu la tuberculose pulmonaire ou été en contact étroit avec une personne qui l’a?', 'In the past 2 years, have you or a family member had tuberculosis of the lungs or been in close contact with someone who has it?'),
          yn('illness', 'Vous ou un membre de votre famille avez-vous une maladie grave, ou un trouble physique ou mental qui nécessiterait des services sociaux ou de santé autres que des médicaments?', 'Do you or a family member have a serious illness, or a physical or mental disorder that would require social or health services other than medication?'),
          yn('crimeCanada', 'Avez-vous déjà été reconnu(e) coupable d’un crime ou d’une infraction au Canada pour lequel vous n’avez pas obtenu de pardon?', 'Have you ever been convicted of a crime or offence in Canada for which you were not pardoned?'),
          yn('crimeAbroad', 'Avez-vous déjà été reconnu(e) coupable, ou êtes-vous accusé(e), poursuivi(e) ou visé(e) par une procédure judiciaire, pour un crime ou une infraction dans un autre pays?', 'Have you ever been convicted of, or are you charged with, on trial for or party to proceedings for, a crime or offence in another country?'),
          yn('asylum', 'Avez-vous déjà demandé l’asile au Canada, dans un bureau des visas canadien, dans un autre pays ou auprès du HCR?', 'Have you ever made a refugee claim in Canada, at a Canadian visa office, in another country or with the UNHCR?'),
          yn('refusedVisa', 'Vous a-t-on déjà refusé le statut de réfugié, un visa d’immigrant ou de résident permanent (y compris un CSQ ou une désignation provinciale), un visa de visiteur ou de résident temporaire, pour le Canada ou un autre pays?', 'Have you ever been refused refugee status, an immigrant or permanent resident visa (including a CSQ or a provincial nomination), or a visitor or temporary resident visa, for Canada or any other country?'),
          yn('refusedEntry', 'Vous a-t-on déjà refusé l’entrée au Canada ou dans un autre pays, ou ordonné de quitter le Canada ou un autre pays?', 'Have you ever been refused entry to, or ordered to leave, Canada or any other country?'),
          yn('genocide', 'Avez-vous participé à un acte de génocide, à un crime de guerre ou à un crime contre l’humanité?', 'Have you taken part in an act of genocide, a war crime or a crime against humanity?'),
          yn('violence', 'Avez-vous déjà utilisé, planifié ou prôné la lutte armée ou la violence pour atteindre des objectifs politiques, religieux ou sociaux?', 'Have you ever used, planned or advocated armed struggle or violence to reach political, religious or social objectives?'),
          yn('violentGroup', 'Avez-vous déjà été associé(e) à un groupe qui utilise ou prône, ou a utilisé ou prôné, la lutte armée ou la violence pour atteindre de tels objectifs?', 'Have you ever been associated with a group that uses or advocates, or used or advocated, armed struggle or violence to reach such objectives?'),
          yn('crimeOrg', 'Avez-vous déjà été membre d’une organisation qui se livre ou s’est livrée à des activités criminelles?', 'Have you ever been a member of an organization that is or was engaged in criminal activity?'),
          yn('detained', 'Avez-vous déjà été détenu(e), incarcéré(e) ou emprisonné(e)?', 'Have you ever been detained, incarcerated or put in jail?'),
          area('bgDetails', 'Précisions sur chaque réponse « Oui » (dates, lieux, personne concernée)', 'Details of each “Yes” answer (dates, places, person concerned)',
            { showIf: ['tb', 'illness', 'crimeCanada', 'crimeAbroad', 'asylum', 'refusedVisa', 'refusedEntry', 'genocide', 'violence', 'violentGroup', 'crimeOrg', 'detained'].map(yes) }),
          { id: 'notes', type: 'textarea', label: t('Autre chose à signaler à Me Poughon? (facultatif)', 'Anything else Ms. Poughon should know? (optional)') }
        ]
      }
    ]
  };
})();
