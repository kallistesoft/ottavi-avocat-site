// Intake form questions (made-up content to start; replace with Me Poughon's real questions).
// Only this file changes when the questions change. Each label is { fr, en }.
//
// Field types: text, email, tel, date, number, select, radio, textarea,
//   group  (a framed block of fields, usually with showIf),
//   repeat (a list of items, each with the same fields: jobs, children...).
// Rules: required: true; empty: { fr, en } (printed in the PDF when left blank); showIf: { field: 'id', in: ['value', ...] } (looks in the same repeat item first).
// Answers are stored flat by field id; a repeat stores an array of objects.
// Bump `version` only if old saved answers can no longer be read (renamed ids); the engine refuses other versions.
window.OTTAVI_FORM = {
  id: 'ottavi-intake',
  version: 1,
  title: { fr: "Questionnaire d'admissibilité", en: 'Eligibility questionnaire' },
  sections: [
    {
      id: 'identity',
      title: { fr: 'Identité', en: 'Identity' },
      fields: [
        { id: 'fullName', type: 'text', required: true, autocomplete: 'name', label: { fr: 'Nom complet', en: 'Full name' } },
        { id: 'birthDate', type: 'date', required: true, label: { fr: 'Date de naissance', en: 'Date of birth' } },
        { id: 'citizenship', type: 'text', required: true, label: { fr: 'Citoyenneté', en: 'Citizenship' } },
        { id: 'residence', type: 'text', required: true, autocomplete: 'country-name', label: { fr: 'Pays de résidence actuel', en: 'Current country of residence' } },
        { id: 'email', type: 'email', required: true, autocomplete: 'email', label: { fr: 'Courriel', en: 'Email' } },
        { id: 'phone', type: 'tel', autocomplete: 'tel', label: { fr: 'Téléphone (facultatif)', en: 'Phone (optional)' } }
      ]
    },
    {
      id: 'family',
      title: { fr: 'Famille', en: 'Family' },
      fields: [
        {
          id: 'maritalStatus', type: 'radio', required: true, label: { fr: 'État civil', en: 'Marital status' },
          options: [
            { value: 'single', label: { fr: 'Célibataire', en: 'Single' } },
            { value: 'married', label: { fr: 'Marié(e)', en: 'Married' } },
            { value: 'commonlaw', label: { fr: 'Conjoint de fait', en: 'Common-law' } },
            { value: 'divorced', label: { fr: 'Divorcé(e) ou séparé(e)', en: 'Divorced or separated' } },
            { value: 'widowed', label: { fr: 'Veuf ou veuve', en: 'Widowed' } }
          ]
        },
        {
          id: 'spouse', type: 'group', label: { fr: 'Votre conjoint(e)', en: 'Your spouse or partner' },
          showIf: { field: 'maritalStatus', in: ['married', 'commonlaw'] },
          fields: [
            { id: 'spouseName', type: 'text', required: true, label: { fr: 'Nom complet', en: 'Full name' } },
            { id: 'spouseBirthDate', type: 'date', required: true, label: { fr: 'Date de naissance', en: 'Date of birth' } },
            { id: 'spouseCitizenship', type: 'text', label: { fr: 'Citoyenneté', en: 'Citizenship' } }
          ]
        },
        { id: 'children', type: 'number', min: 0, max: 20, required: true, label: { fr: "Nombre d'enfants à charge", en: 'Number of dependent children' } }
      ]
    },
    {
      id: 'education',
      title: { fr: 'Études et langues', en: 'Education and languages' },
      fields: [
        {
          id: 'diploma', type: 'select', required: true, label: { fr: 'Diplôme le plus élevé', en: 'Highest diploma' },
          options: [
            { value: 'secondary', label: { fr: 'Secondaire (bac)', en: 'High school' } },
            { value: 'oneyear', label: { fr: 'Formation de 1 an après le secondaire', en: 'One-year post-secondary program' } },
            { value: 'twoyear', label: { fr: 'Formation de 2 ans (bac + 2)', en: 'Two-year program' } },
            { value: 'bachelor', label: { fr: 'Licence ou baccalauréat (bac + 3 ou 4)', en: "Bachelor's degree" } },
            { value: 'master', label: { fr: 'Master (bac + 5)', en: "Master's degree" } },
            { value: 'phd', label: { fr: 'Doctorat', en: 'PhD' } }
          ]
        },
        { id: 'field', type: 'text', required: true, label: { fr: "Domaine d'études", en: 'Field of study' } },
        { id: 'diplomaCountry', type: 'text', required: true, label: { fr: "Pays d'obtention du diplôme", en: 'Country where you earned it' } },
        {
          id: 'french', type: 'select', required: true, label: { fr: 'Niveau de français', en: 'French level' },
          options: [
            { value: 'native', label: { fr: 'Langue maternelle', en: 'Native' } },
            { value: 'fluent', label: { fr: 'Courant', en: 'Fluent' } },
            { value: 'intermediate', label: { fr: 'Intermédiaire', en: 'Intermediate' } },
            { value: 'beginner', label: { fr: 'Débutant', en: 'Beginner' } },
            { value: 'none', label: { fr: 'Aucun', en: 'None' } }
          ]
        },
        {
          id: 'english', type: 'select', required: true, label: { fr: "Niveau d'anglais", en: 'English level' },
          options: [
            { value: 'native', label: { fr: 'Langue maternelle', en: 'Native' } },
            { value: 'fluent', label: { fr: 'Courant', en: 'Fluent' } },
            { value: 'intermediate', label: { fr: 'Intermédiaire', en: 'Intermediate' } },
            { value: 'beginner', label: { fr: 'Débutant', en: 'Beginner' } },
            { value: 'none', label: { fr: 'Aucun', en: 'None' } }
          ]
        }
      ]
    },
    {
      id: 'work',
      title: { fr: 'Expérience de travail', en: 'Work experience' },
      lead: { fr: 'Vos emplois des 10 dernières années, du plus récent au plus ancien.', en: 'Your jobs in the last 10 years, most recent first.' },
      fields: [
        {
          id: 'jobs', type: 'repeat', min: 1,
          label: { fr: 'Emploi', en: 'Job' },
          add: { fr: 'Ajouter un emploi', en: 'Add a job' },
          fields: [
            { id: 'title', type: 'text', required: true, label: { fr: 'Poste occupé', en: 'Job title' } },
            { id: 'employer', type: 'text', required: true, label: { fr: 'Employeur', en: 'Employer' } },
            { id: 'country', type: 'text', required: true, label: { fr: 'Pays', en: 'Country' } },
            { id: 'start', type: 'date', required: true, label: { fr: 'Début', en: 'Start' } },
            { id: 'end', type: 'date', label: { fr: 'Fin', en: 'End' }, empty: { fr: 'En cours', en: 'Current' }, hint: { fr: "Laissez vide s'il s'agit de votre emploi actuel.", en: 'Leave empty if this is your current job.' } },
            { id: 'hours', type: 'number', min: 1, max: 80, required: true, label: { fr: 'Heures par semaine', en: 'Hours per week' } }
          ]
        },
        { id: 'notes', type: 'textarea', label: { fr: 'Autre chose à signaler ? (facultatif)', en: 'Anything else we should know? (optional)' } }
      ]
    }
  ]
};
