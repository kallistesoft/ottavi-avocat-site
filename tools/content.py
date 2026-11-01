"""Site content: contact details, links and every text, in French and English.

Edit this file, then run `python3 tools/build.py` to regenerate the pages.
"""

EMAIL = 'contact@vpavocat.com'
SITE = 'https://www.ottavilawfirm.com'
PHONE = '+1 579-372-8150'
PHONE_TEL = '+15793728150'
CALENDLY = 'https://calendly.com/vanessa-poughon-avocat/consultation-immigration-canadienne-60-mn'
CALENDLY_FLASH = 'https://calendly.com/vanessa-poughon-avocat/consultation-flash-20mn-150-taxes'
AUDIT = 'https://a5c6-contact.systeme.io/commande-22ec70a7'
AUDIT_STUDENT = 'https://a5c6-contact.systeme.io/d4acbe58-5b116c48'
GUIDE_FREE = 'https://a5c6-contact.systeme.io/guidegratuit'
CV_FREE = 'https://a5c6-contact.systeme.io/cvcanadien-e5451c58-4a4b1be3'
NEWSLETTER = 'https://a5c6-contact.systeme.io/newsletter'
EBOOK = 'https://a5c6-contact.systeme.io/guidealbertaachat-ee964b16'
INSTA = 'https://www.instagram.com/poughon_immigration'
# Same address as T[...]['address'], split for the structured data.
ADDRESS = dict(street='204, rue du Saint-Sacrement, bureau 300', city='Montréal', region='QC', postcode='H2Y 2S9', country='CA')

PAGES = ['home', 'services', 'ressources', 'cabinet', 'contact']
LEGAL_PAGES = ['cgv', 'privacy']
URL = {
    'fr': {'home': '/', 'services': '/services/', 'ressources': '/ressources/', 'cabinet': '/cabinet/', 'contact': '/contact/', 'cgv': '/cgv/', 'privacy': '/confidentialite/'},
    'en': {'home': '/en/', 'services': '/en/services/', 'ressources': '/en/resources/', 'cabinet': '/en/firm/', 'contact': '/en/contact/', 'cgv': '/en/terms/', 'privacy': '/en/privacy/'},
}
T = {
    'fr': dict(
        legalNav={'cgv': 'CGV', 'privacy': 'Confidentialité'}, legalEyebrow='Informations légales',
        nav={'home': 'Accueil', 'services': 'Services', 'ressources': 'Ressources', 'cabinet': 'Le cabinet', 'contact': 'Contact'},
        homeLabel='Ottavi Law Firm Inc. — accueil', navLabel='Principale', langLabel='Langue', cta='Réserver',
        skip='Aller au contenu', footNav='Pied de page', footNavTitle='Navigation', footContact='Nous joindre',
        address='204, rue du Saint-Sacrement, bureau 300<br>Montréal (Québec) H2Y 2S9',
        legal="Me Vanessa Poughon, avocate au Barreau du Québec · n° de membre 381467&#8209;0 · Non membre du Barreau de l'Alberta.",
        bar="Avocate au Barreau du Québec · Numéro de membre 381467&#8209;0",
        notAlberta="(Non membre du Barreau de l'Alberta)",
        photo='[Photo actuelle du site]', photoLabel='Me Vanessa Poughon, avocate en immigration canadienne',
        audit="Audit Éclair — Travailleur", auditBlurb="Un questionnaire de 3 minutes, une analyse personnelle de vos réponses et un bilan détaillé sous 48 h.",
        auditSteps=["Réglez votre audit", "Répondez à mon questionnaire (3 minutes)", "J'analyse personnellement vos réponses", "Vous recevez votre bilan détaillé sous 48 h : vos points forts, vos points faibles et les programmes ciblés"],
        auditPrice='49 $', auditUnit='CAD + tx', auditEuro='environ 30 €', auditCta="Réserver votre audit", auditCardCta='Obtenir un audit', heroAudit='Audit Éclair · 49 $ CAD',
        auditPitch="Avant de dépenser des milliers de dollars ou de perdre des mois dans des démarches d'immigration, savez-vous si votre profil intéresse le Canada ?",
        auditBonus="<strong>Le petit plus :</strong> si vous réservez ensuite une consultation complète, vos 49 $ sont crédités à 100&nbsp;% sur votre séance. Votre audit est donc entièrement rentabilisé.",
        auditDisclaimer="Cet audit constitue une pré-évaluation d'éligibilité indicative sur la base de vos déclarations et ne remplace pas une consultation stratégique approfondie sur pièces.",
        howTitle='Fonctionnement',
        tagline="Votre cabinet juridique de confiance pour concrétiser votre projet d'immigration, partout au Canada.",
        bio=["Avocate franco-canadienne, forte de neuf années d'expérience en droit criminel et immigration en France, Me Vanessa Poughon a poursuivi son engagement juridique au Canada en obtenant son admission au Barreau du Québec.", "Aujourd'hui établie en Alberta après avoir vécu six ans au Québec, elle met son expertise au service des personnes et des familles souhaitant concrétiser leur projet d'immigration canadienne.", "À travers son cabinet Ottavi Law Firm Inc., elle offre un accompagnement juridique stratégique, rigoureux et humain dans le droit de l'immigration canadienne.", "Ses domaines de prédilection sont les programmes d'immigration fédéraux et provinciaux, notamment l'Entrée express et la Mobilité francophone.", "L'accompagnement juridique dans votre projet d'immigration au Canada, d'un océan à l'autre."],
        phoneLabel='Téléphone', mailLabel='Courriel',
        consult='Consultation stratégique 1&nbsp;h', heroConsult='Consultation stratégique',
        consultBlurb="Avec Vanessa Poughon. Ce rendez-vous s'adresse à toute personne souhaitant faire le point sur sa situation, évaluer la faisabilité d'un projet d'immigration au Canada et définir la meilleure stratégie à adopter.",
        consultPrice='260 $', taxes='CAD + tx',
        flash='Consultation Flash 20 min', flashPrice='150 $',
        mandate='Mandat complet', mandatePrice='Sur devis', mandateCta='Nous contacter',
        mandateBlurb="Nous prenons en charge toute la stratégie afin d'immigrer au Canada et de maximiser vos chances de réussite. Nous assurons la conformité de votre dossier soumis à IRCC pour votre tranquillité d'esprit.",
        flashBlurb="Avec Vanessa Poughon. Cette consultation express est idéale si vous avez des questions précises sur votre éligibilité, le choix d'un programme ou un doute stratégique sur vos démarches auprès d'IRCC.", consultCta='Réserver sur Calendly', withV='Avec Vanessa Poughon',
        ebook='Ebook : Immigrer en Alberta en 2026', ebookPrice='19,99 $', ebookCta="Acheter l'ebook", ebookValue='Valeur totale : 39 $',
        ebookSub='Guide express pour les francophones', ebookCover="Couverture de l'ebook « Guide express : immigrer en Alberta en 2026 »",
        ebookBlurb="Ce guide pratique vous offre un aperçu des programmes actuels dédiés à l'immigration en Alberta pour les francophones.",
        ebookPitch="Vous souhaitez immigrer en Alberta et sécuriser votre projet d'avenir ? Ne gaspillez plus des heures à chercher des informations dispersées ou obsolètes. Ce guide pratique vous offre un aperçu des programmes actuels dédiés à l'immigration en Alberta pour les francophones. Découvrez les critères d'éligibilité de chaque programme et les étapes pour structurer votre démarche en toute confiance.",
        ebookListTitle='Ce que vous allez découvrir dans ce guide',
        ebookPoints=["Programme pilote d'immigration dans les communautés rurales (PPICR 2026)", "Les critères d'éligibilité et exigences linguistiques", "Des ressources indispensables pour vos procédures d'immigration", "Comment obtenir la résidence temporaire et permanente", "Un modèle de CV canadien", "Accès instantané au format PDF téléchargeable"],
        ebookBonus="<strong>En cadeau :</strong> 20 $ CAD de réduction sur votre consultation individuelle de stratégie d'immigration. Vous recevrez votre code de réduction par courriel.",
        guide='Guide «&nbsp;Immigrer au Canada&nbsp;» (édition 2026)',
        guidePoints=["Les 5 principales voies d'immigration", "Le fonctionnement d'Entrée express", "Les 5 erreurs qui coûtent cher aux candidats"],
        guideCta='Recevoir le guide', free='Gratuit', cv='Modèle de CV au format canadien', cvCta='Recevoir le modèle',
        eyebrow='Me Vanessa Poughon, avocate', h1='Immigration <span>canadienne</span>',
        mailMe='Contactez-moi par courriel', facts='Coordonnées professionnelles',
        nlBlurb='Abonnez-vous à notre newsletter pour vous tenir informé des derniers changements en immigration canadienne.',
        subscribe="S'abonner", barLabel='Barreau', addrLabel='Adresse', specialty='Immigration canadienne',
        titles={'cgv': 'Conditions générales de vente', 'privacy': 'Politique de confidentialité', 'home': 'Avocate en immigration canadienne — Ottavi Law Firm Inc.', 'services': 'Audit et consultation en immigration', 'ressources': 'Guide gratuit pour immigrer au Canada', 'cabinet': 'Me Vanessa Poughon, avocate', 'contact': 'Contacter une avocate en immigration'},
        descs={
            'home': "Avocate en immigration canadienne à Montréal, membre du Barreau du Québec. Audit de profil dès 49 $ et consultation stratégique à distance, partout au Canada.",
            'services': "Audit Éclair travailleur ou étudiant, consultation stratégique, mandat complet et ebook Alberta : l'accompagnement en immigration canadienne qu'il vous faut.",
            'ressources': "Guide gratuit « Immigrer au Canada » (édition 2026) : voies d'immigration, Entrée express, erreurs à éviter. Et un modèle de CV au format canadien.",
            'cabinet': "Me Vanessa Poughon, avocate au Barreau du Québec, 9 ans d'expérience : programmes fédéraux et provinciaux, Entrée express, Mobilité francophone.",
            'contact': "Écrivez à Me Vanessa Poughon ou réservez une consultation en immigration canadienne, à distance, où que vous soyez dans le monde.",
            'cgv': "Conditions générales de vente d'Ottavi Law Firm Inc. pour les achats en ligne : audits, consultations et ebook.",
            'privacy': "Politique de confidentialité d'Ottavi Law Firm Inc. : renseignements recueillis, utilisation, conservation et vos droits.",
        },
    ),
    'en': dict(
        legalNav={'cgv': 'Terms of sale', 'privacy': 'Privacy'}, legalEyebrow='Legal',
        nav={'home': 'Home', 'services': 'Services', 'ressources': 'Resources', 'cabinet': 'The firm', 'contact': 'Contact'},
        homeLabel='Ottavi Law Firm Inc. — home', navLabel='Main', langLabel='Language', cta='Book',
        skip='Skip to content', footNav='Footer', footNavTitle='Navigate', footContact='Contact',
        address='204 Saint-Sacrement Street, Suite 300<br>Montréal, QC H2Y 2S9',
        legal='Vanessa Poughon, lawyer, member of the Barreau du Québec · no. 381467&#8209;0 · Not a member of the Law Society of Alberta.',
        bar='Member of the Barreau du Québec · Member no. 381467&#8209;0',
        notAlberta='(Not a member of the Law Society of Alberta)',
        photo='[Current site photo]', photoLabel='Vanessa Poughon, Canadian immigration lawyer',
        audit='Express Audit — Worker', auditBlurb='A 3-minute questionnaire, a personal analysis of your answers and a detailed report within 48 hours.',
        auditSteps=['Pay for your audit', 'Answer my questionnaire (3 minutes)', 'I personally analyze your answers', 'You receive your detailed report within 48 hours: your strengths, your weaknesses and the programs to target'],
        auditPrice='$49', auditUnit='CAD + tax', auditEuro='about €30', auditCta='Book your audit', auditCardCta='Get an audit', heroAudit='Express audit · CAD $49',
        auditPitch='Before spending thousands of dollars or losing months on immigration procedures, do you even know whether Canada is interested in your profile?',
        auditBonus='<strong>A little extra:</strong> if you then book a full consultation, your $49 is fully credited toward your session. Your audit pays for itself.',
        auditDisclaimer='This audit is an indicative pre-assessment of eligibility based on your own statements. It does not replace an in-depth strategy consultation based on documents.',
        howTitle='How it works',
        tagline='Your trusted law firm for your immigration project, anywhere in Canada.',
        bio=['A French-Canadian lawyer with nine years of experience in criminal and immigration law in France, Vanessa Poughon continued her legal career in Canada by being admitted to the Barreau du Québec.', 'Now based in Alberta after living six years in Québec, she helps individuals and families make their Canadian immigration plans a reality.', 'Through her firm Ottavi Law Firm Inc., she offers strategic, rigorous and human legal support in Canadian immigration law.', 'Her areas of focus are federal and provincial immigration programs, including Express Entry and Francophone Mobility.', 'Legal support for your immigration project in Canada, from coast to coast.'],
        phoneLabel='Phone', mailLabel='Email',
        consult='1-hour strategy consultation', heroConsult='Strategy consultation',
        consultBlurb='With Vanessa Poughon. This appointment is for anyone who wants to take stock of their situation, assess whether an immigration project to Canada is feasible, and define the best strategy to follow.',
        consultPrice='$260', taxes='CAD + tax',
        flash='20-minute flash consultation', flashPrice='$150',
        mandate='Full mandate', mandatePrice='On quote', mandateCta='Contact us',
        mandateBlurb='We take charge of your whole strategy to immigrate to Canada and maximize your chances of success. We make sure the application you submit to IRCC is compliant, for your peace of mind.',
        flashBlurb='With Vanessa Poughon. This express consultation is ideal if you have specific questions about your eligibility, the choice of a program, or a strategic doubt about your applications with IRCC.', consultCta='Book on Calendly', withV='With Vanessa Poughon',
        ebook='Ebook: Immigrating to Alberta in 2026', ebookPrice='$19.99', ebookCta='Buy the ebook', ebookValue='Total value: $39',
        ebookSub='Express guide for French speakers (in French)', ebookCover='Cover of the ebook “Guide express : immigrer en Alberta en 2026”',
        ebookBlurb='This practical guide gives you an overview of the current immigration programs in Alberta for French speakers.',
        ebookPitch='Want to immigrate to Alberta and secure your future? Stop wasting hours looking for scattered or outdated information. This practical guide gives you an overview of the current immigration programs in Alberta for French speakers. Discover the eligibility criteria of each program and the steps to plan your application with confidence.',
        ebookListTitle="What you'll find in this guide",
        ebookPoints=['Rural Community Immigration Pilot (RCIP 2026)', 'Eligibility criteria and language requirements', 'Essential resources for your immigration procedures', 'How to obtain temporary and permanent residence', 'A Canadian CV template', 'Instant access as a downloadable PDF'],
        ebookBonus='<strong>Bonus:</strong> CAD $20 off your individual immigration strategy consultation. You will receive your discount code by email.',
        guide='“Immigrating to Canada” guide (2026 edition)',
        guidePoints=['The 5 main immigration pathways', 'How Express Entry works', 'The 5 costliest mistakes applicants make'],
        guideCta='Get the guide', free='Free', cv='Canadian-format CV template', cvCta='Get the template',
        eyebrow='Vanessa Poughon, lawyer', h1='Canadian <span>immigration</span>',
        mailMe='Contact me by email', facts='Professional details',
        nlBlurb='Subscribe to our newsletter to stay informed about the latest changes in Canadian immigration.',
        subscribe='Subscribe', barLabel='Bar', addrLabel='Address', specialty='Canadian immigration',
        titles={'cgv': 'Terms of sale', 'privacy': 'Privacy policy', 'home': 'Canadian Immigration Lawyer — Ottavi Law Firm Inc.', 'services': 'Immigration audit and consultation', 'ressources': 'Free guide to immigrating to Canada', 'cabinet': 'Vanessa Poughon, lawyer', 'contact': 'Contact an immigration lawyer'},
        descs={
            'home': 'Canadian immigration lawyer in Montréal, member of the Barreau du Québec. Profile audit from $49 and remote strategy consultations, anywhere in Canada.',
            'services': 'Express Audit for workers and students, strategy consultation, full mandate and Alberta ebook: the Canadian immigration support that fits your situation.',
            'ressources': 'Free “Immigrating to Canada” guide (2026 edition): immigration pathways, Express Entry, mistakes to avoid. Plus a Canadian-format CV template.',
            'cabinet': 'Vanessa Poughon, member of the Barreau du Québec, 9 years of experience: federal and provincial programs, Express Entry, Francophone Mobility.',
            'contact': 'Write to Vanessa Poughon or book a Canadian immigration consultation, remotely, wherever you are in the world.',
            'cgv': 'Terms of sale of Ottavi Law Firm Inc. for online purchases: audits, consultations and ebook.',
            'privacy': 'Privacy policy of Ottavi Law Firm Inc.: what information is collected, how it is used and kept, and your rights.',
        },
    ),
}

# Texts added with the Ivoire redesign.
T['fr'].update(
    heroTitle="Immigrer au Canada,<br><em>accompagné par une avocate.</em>",
    heroPrimary='Réserver une consultation', heroSecondary="Faire l'Audit Éclair · 49 $",
    trust=["Membre du Barreau du Québec · n°&nbsp;381467&#8209;0", "9 ans d'expérience comme avocate en France et au Québec", "Accompagnement à distance, où que vous soyez"],
    chooseEyebrow='Services', chooseTitle='Par où commencer&nbsp;?',
    chooseLead="Choisissez l'accompagnement qui correspond à votre situation.",
    needs={'audit': "Je veux savoir si mon profil intéresse le Canada", 'student': "Je veux étudier au Canada", 'flash': "J'ai quelques questions précises",
           'consult': "Je veux évaluer mon projet et définir ma stratégie", 'mandate': "Je veux être accompagné de A à&nbsp;Z"},
    seeAll='Voir le détail des services',
    aboutEyebrow='Votre avocate', aboutCta='Découvrir le cabinet',
    ebookEyebrow='Ebook', ebookMore="Découvrir l'ebook",
    resEyebrow='Ressources gratuites', resTitle='Préparez votre projet',
    resLead='Des documents gratuits pour bien démarrer.',
    finalTitle='Votre projet mérite une stratégie solide.',
    finalLead="Réservez un rendez-vous avec Me Poughon ou écrivez-nous : nous vous répondons rapidement.",
    servicesLead="De la première vérification à la prise en charge complète : choisissez le niveau d'accompagnement dont vous avez besoin.",
    servicesTitle='Nos services en immigration canadienne', resourcesTitle='Ressources gratuites pour immigrer au Canada', contactTitle='Contacter votre avocate en immigration',
    jump='Aller à', mandateMore='Sur devis, selon votre dossier.',
    menu='Menu', close='Fermer', mobileBook='Réserver', mobileAudit='Audit 49 $',
    contactLead='Une question sur votre projet ? Écrivez-nous ou réservez directement un rendez-vous.',
    remote='Consultations à distance, où que vous soyez dans le monde.',
    bookTitle='Réserver un rendez-vous', writeTitle='Nous écrire', findTitle='Nous trouver',
    areasTitle='Domaines de prédilection',
    areas=['Entrée express', 'Mobilité francophone', "Programmes d'immigration fédéraux"],
    cabinetLead="Un accompagnement juridique stratégique, rigoureux et humain en droit de l'immigration canadienne.",
    affEyebrow='Affiliations',
    affTitle="Membre du Barreau du Québec et des associations en droit de l'immigration canadienne",
    affiliations=[
        ('barreau-du-quebec', 'Logo du Barreau du Québec', 575, 171, 'Membre du Barreau du Québec', 'https://www.barreau.qc.ca/fr/trouver-un-avocat/membre/?id=1a98d38602211a4c099e6c84482e4f6abdf1a2d61cd007e1affc97580604c684&amp;backUrl=%2Ffr%2Ftrouver-un-avocat%2Fresultats%2F%3Fn%3DPoughon%252C%2BVanessa'),
        ('aqaadi', "Logo de l'AQAADI", 587, 158, "Membre de l'Association québécoise des avocats et avocates en droit de l'immigration (AQAADI)", 'https://www.aqaadi.com/fr'),
        ('cila-acai', "Logo de l'ACAI / CILA", 410, 191, "Membre de l'Association canadienne des avocats en immigration (ACAI / CILA)", 'https://cila.co/fr/?lang=fr'),
    ],
    affVisit='Visiter le site',
    resourcesLead='Des ressources gratuites pour préparer votre projet en toute confiance.',
    per='', priceFrom='',
)
T['en'].update(
    heroTitle='Immigrate to Canada,<br><em>with a lawyer by your side.</em>',
    heroPrimary='Book a consultation', heroSecondary='Take the Express Audit · $49',
    trust=['Member of the Barreau du Québec · no.&nbsp;381467&#8209;0', '9 years of experience as a lawyer in France and Québec', 'Remote support, wherever you are'],
    chooseEyebrow='Services', chooseTitle='Where to start?',
    chooseLead='Pick the support that fits your situation.',
    needs={'audit': "I want to know whether Canada is interested in my profile", 'student': 'I want to study in Canada', 'flash': 'I have a few specific questions',
           'consult': 'I want to assess my project and set my strategy', 'mandate': 'I want support from start to finish'},
    seeAll='See all services in detail',
    aboutEyebrow='Your lawyer', aboutCta='About the firm',
    ebookEyebrow='Ebook', ebookMore='Discover the ebook',
    resEyebrow='Free resources', resTitle='Prepare your project',
    resLead='Free documents to get started.',
    finalTitle='Your project deserves a solid strategy.',
    finalLead='Book an appointment with Vanessa Poughon or write to us: we reply quickly.',
    servicesLead='From a first check to full support: choose the level of help you need.',
    servicesTitle='Our Canadian immigration services', resourcesTitle='Free resources for immigrating to Canada', contactTitle='Contact your immigration lawyer',
    jump='Jump to', mandateMore='On quote, depending on your file.',
    menu='Menu', close='Close', mobileBook='Book', mobileAudit='Audit $49',
    contactLead='A question about your project? Write to us or book an appointment directly.',
    remote='Remote consultations, wherever you are in the world.',
    bookTitle='Book an appointment', writeTitle='Write to us', findTitle='Find us',
    areasTitle='Areas of focus',
    areas=['Express Entry', 'Francophone Mobility', 'Federal immigration programs'],
    cabinetLead='Strategic, rigorous and human legal support in Canadian immigration law.',
    affEyebrow='Affiliations',
    affTitle='Member of the Barreau du Québec and of Canadian immigration law associations',
    affiliations=[
        ('barreau-du-quebec', 'Barreau du Québec logo', 575, 171, 'Member of the Barreau du Québec', 'https://www.barreau.qc.ca/fr/trouver-un-avocat/membre/?id=1a98d38602211a4c099e6c84482e4f6abdf1a2d61cd007e1affc97580604c684&amp;backUrl=%2Ffr%2Ftrouver-un-avocat%2Fresultats%2F%3Fn%3DPoughon%252C%2BVanessa'),
        ('aqaadi', 'AQAADI logo', 587, 158, 'Member of the Association québécoise des avocats et avocates en droit de l\'immigration (AQAADI)', 'https://www.aqaadi.com/fr'),
        ('cila-acai', 'CILA / ACAI logo', 410, 191, 'Member of the Canadian Immigration Lawyers Association (CILA / ACAI)', 'https://cila.co/'),
    ],
    affVisit='Visit website',
    resourcesLead='Free resources to prepare your project with confidence.',
    per='', priceFrom='',
)

# Free resources and student audit: visitors continue on her systeme.io pages.
T['fr'].update(
    resNote='Indiquez votre courriel sur la page suivante pour recevoir le document.',
    student='Audit Éclair — Étudiant', studentCardCta='Obtenir un audit', studentCta='Réserver votre audit',
    studentBlurb="Sécurisez votre projet d'études avant d'investir des milliers de dollars. Bilan détaillé sous 48 h.",
    studentPitch="Vous souhaitez faire des études au Canada ? Ne tentez pas votre chance au hasard avec l'immigration canadienne : un dossier mal préparé, c'est un refus quasi assuré. Sécurisez votre projet d'études avant d'investir des milliers de dollars.",
    studentListTitle="Que contient l'audit",
    studentPoints=["Diagnostic d'admissibilité stratégique", "Détection des points faibles de votre dossier", "Feuille de route personnalisée", "Conseils pour votre demande de permis", "Votre bilan détaillé sous 48 h"],
    studentBonus="<strong>Le petit plus :</strong> si vous nous confiez ensuite la prise en charge complète de votre dossier, vos 49 $ sont intégralement déduits de votre prestation. Votre audit est donc entièrement rentabilisé.",
)
T['en'].update(
    resNote='Enter your email on the next page to receive the document.',
    student='Express Audit — Student', studentCardCta='Get an audit', studentCta='Book your audit',
    studentBlurb='Secure your study project before investing thousands of dollars. Detailed report within 48 hours.',
    studentPitch="Want to study in Canada? Don't leave Canadian immigration to chance: a poorly prepared application is almost certain to be refused. Secure your study project before investing thousands of dollars.",
    studentListTitle="What the audit includes",
    studentPoints=['Strategic eligibility diagnosis', 'Identifying the weak points of your application', 'A personalized roadmap', 'Advice for your permit application', 'Your detailed report within 48 hours'],
    studentBonus="<strong>A little extra:</strong> if you then entrust us with your entire application, your $49 is fully deducted from our fee. Your audit pays for itself.",
)
