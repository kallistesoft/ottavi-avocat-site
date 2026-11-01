"""Terms of sale and privacy policy. Each page is (title, lead, [(heading, [paragraphs])]).

Items wrapped in todo() are decisions Me Poughon must make. Remove DRAFT_NOTE and every todo() before www switches.
"""


def todo(text):
    return f'<mark class="legal-todo">{text}</mark>'


UPDATED = {'fr': 'Dernière mise à jour : 1er novembre 2026', 'en': 'Last updated: November 1, 2026'}
DRAFT_NOTE = {
    'fr': "<strong>Projet :</strong> ce document doit être validé par Me Poughon. Les passages surlignés sont à confirmer.",
    'en': "<strong>Draft:</strong> this document must be approved by Me Poughon. Highlighted passages need confirmation.",
}

LEGAL = {
    'fr': {
        'cgv': ("Conditions générales de vente", "Ces conditions s'appliquent aux achats effectués en ligne auprès d'Ottavi Law Firm Inc.", [
            ("1. Le vendeur", [
                "Ottavi Law Firm Inc., 204, rue du Saint-Sacrement, bureau 300, Montréal (Québec) H2Y 2S9. Téléphone : +1 579-372-8150. Courriel : contact@vpavocat.com.",
                "Me Vanessa Poughon est avocate au Barreau du Québec (n° de membre 381467&#8209;0). Elle n'est pas membre du Barreau de l'Alberta.",
            ]),
            ("2. Les produits", [
                "<strong>Audit Éclair — Travailleur (49 $ CAD + taxes) :</strong> questionnaire de 3 minutes, analyse personnelle de vos réponses et bilan détaillé : vos points forts, vos points faibles et les programmes ciblés.",
                "<strong>Audit Éclair — Étudiant (49 $ CAD + taxes) :</strong> diagnostic d'admissibilité stratégique, détection des points faibles de votre dossier, feuille de route personnalisée et conseils pour votre demande de permis.",
                "<strong>Guide Express : immigrer en Alberta en 2026 (19,99 $ CAD + taxes) :</strong> guide numérique en PDF téléchargeable.",
                "Les audits constituent une pré-évaluation d'éligibilité indicative sur la base de vos déclarations. Ils ne remplacent pas une consultation stratégique approfondie sur pièces et ne garantissent aucune décision des autorités d'immigration. Le guide est fourni à titre d'information générale et ne constitue pas un avis juridique personnalisé.",
            ]),
            ("3. Prix et paiement", [
                "Les prix sont en dollars canadiens. " + "Les taxes applicables, le cas échéant, sont indiquées au moment du paiement.",
                "Le paiement se fait en ligne par carte de crédit ou, lorsqu'il est proposé, par Klarna. Il est traité par un prestataire de paiement sécurisé. Le cabinet ne conserve pas vos données de carte.",
            ]),
            ("4. Livraison", [
                "<strong>Audits :</strong> après le paiement, vous recevez le questionnaire. Votre bilan détaillé vous est transmis par courriel, en principe sous 48 h ouvrables à compter de la réception de votre questionnaire complété.",
                "Ce délai est un objectif et non une garantie : il peut être un peu plus long en période de forte demande. Un tel dépassement ne donne pas droit à un remboursement.",
                "<strong>Guide :</strong> accès au PDF dès la confirmation du paiement.",
            ]),
            ("5. Annulation et remboursement", [
                "Les audits et le guide ne sont pas remboursables une fois le paiement effectué.",
                "Vous reconnaissez ce point en cochant la case prévue avant le paiement. Si vous n'avez pas reçu votre produit, écrivez à contact@vpavocat.com : nous vous le transmettons dans les meilleurs délais, idéalement sous quelques jours ouvrables, sans que ce délai soit garanti. Aucun remboursement n'est accordé dans ce cas.",
                "Ces conditions ne limitent pas les droits que la loi vous accorde et auxquels il n'est pas possible de renoncer, notamment en matière de protection du consommateur.",
                "<strong>Clients résidant en France ou dans l'Union européenne :</strong> lorsque le droit de votre pays vous l'accorde, vous disposez d'un droit de rétractation de 14 jours à compter de votre achat, à exercer en écrivant à contact@vpavocat.com. Ce droit prend fin avant ce délai si vous demandez à recevoir le guide ou le bilan immédiatement et y renoncez expressément : pour le guide, dès que vous y avez accès ; pour un audit, dès que le bilan vous a été transmis.",
            ]),
            ("6. Avantages liés aux achats", [
                "<strong>Audit Éclair — Travailleur :</strong> si vous réservez ensuite une consultation complète, vos 49 $ sont crédités à 100&nbsp;% sur votre séance.",
                "<strong>Audit Éclair — Étudiant :</strong> si vous nous confiez ensuite la prise en charge complète de votre dossier, vos 49 $ sont intégralement déduits de votre prestation.",
                "<strong>Guide :</strong> vous recevez par courriel un code de réduction de 20 $ CAD sur votre consultation individuelle de stratégie d'immigration.",
                "Ces avantages n'ont pas de date limite.",
            ]),
            ("7. Relation avocat-client", [
                "L'achat d'un audit ou du guide ne crée pas à lui seul un mandat de représentation. Vos renseignements sont traités de façon confidentielle.",
            ]),
            ("8. Propriété intellectuelle", ["Le guide et les bilans sont destinés à votre usage personnel. Ils ne peuvent pas être reproduits ni diffusés sans autorisation."]),
            ("9. Renseignements personnels", ['Leur traitement est décrit dans notre <a href="PRIVACY_URL">politique de confidentialité</a>.']),
            ("10. Droit applicable", [
                "Ces conditions sont régies par les lois du Québec et les lois du Canada qui s'y appliquent, sous réserve des dispositions impératives dont vous bénéficiez selon votre lieu de résidence.",
                "Pour toute question ou réclamation : contact@vpavocat.com.",
            ]),
        ]),
        'privacy': ("Politique de confidentialité", "Comment Ottavi Law Firm Inc. recueille, utilise et protège vos renseignements personnels.", [
            ("1. Responsable", [
                "Ottavi Law Firm Inc., 204, rue du Saint-Sacrement, bureau 300, Montréal (Québec) H2Y 2S9.",
                "Responsable de la protection des renseignements personnels : Me Vanessa Poughon, contact@vpavocat.com.",
            ]),
            ("2. Renseignements recueillis", [
                "Selon votre démarche : nom, prénom, courriel, numéro de téléphone, code postal, pays, informations de facturation, réponses aux questionnaires d'audit et renseignements fournis pour votre projet d'immigration.",
                "Les données de carte sont saisies directement chez le prestataire de paiement. Le cabinet n'y a pas accès.",
            ]),
            ("3. Pourquoi nous les utilisons", ["Traiter votre commande, réaliser votre audit, vous envoyer vos documents et les renseignements liés à votre achat, répondre à vos questions, gérer vos rendez-vous, et remplir nos obligations légales et comptables. Vous recevez notre infolettre uniquement si vous y avez consenti, et vous pouvez vous désinscrire à tout moment."]),
            ("4. Fournisseurs de services", [
                "Vos renseignements peuvent être traités par nos principaux fournisseurs : systeme.io (pages de vente, commandes et courriels), le prestataire de paiement, Klarna lorsque vous le choisissez, Calendly (prise de rendez-vous) et GoDaddy (hébergement du site). Le site charge aussi ses polices depuis Google Fonts, qui reçoit votre adresse IP.",
                "Certains de ces fournisseurs peuvent traiter des renseignements à l'extérieur du Québec.",
            ]),
            ("5. Conservation", ["Nous conservons vos renseignements uniquement le temps nécessaire pour traiter vos demandes, sous réserve des durées que la loi nous impose (comptabilité et tenue de dossiers de l'avocate)."]),
            ("6. Vos droits", ["Vous pouvez demander l'accès à vos renseignements, leur rectification, ou retirer votre consentement en écrivant à contact@vpavocat.com. Vous pouvez aussi déposer une plainte auprès de la Commission d'accès à l'information du Québec."]),
            ("7. Sécurité", ["Nous prenons des mesures raisonnables pour protéger vos renseignements. Évitez toutefois d'envoyer des documents sensibles par courriel sans y être invité."]),
            ("8. Modifications", ["Cette politique peut être mise à jour. La date de la dernière mise à jour figure sur cette page."]),
        ]),
    },
    'en': {
        'cgv': ("Terms of sale", "These terms apply to purchases made online from Ottavi Law Firm Inc.", [
            ("1. The seller", [
                "Ottavi Law Firm Inc., 204 Saint-Sacrement Street, Suite 300, Montréal, QC H2Y 2S9. Phone: +1 579-372-8150. Email: contact@vpavocat.com.",
                "Vanessa Poughon is a lawyer and member of the Barreau du Québec (no. 381467&#8209;0). She is not a member of the Law Society of Alberta.",
            ]),
            ("2. The products", [
                "<strong>Express Audit — Worker (CAD $49 + tax):</strong> a 3-minute questionnaire, a personal analysis of your answers and a detailed report: your strengths, your weaknesses and the programs to target.",
                "<strong>Express Audit — Student (CAD $49 + tax):</strong> strategic eligibility diagnosis, identification of the weak points of your application, a personalized roadmap and advice for your permit application.",
                "<strong>Express guide: immigrating to Alberta in 2026 (CAD $19.99 + tax):</strong> a downloadable PDF guide, in French.",
                "The audits are an indicative pre-assessment of eligibility based on your own statements. They do not replace an in-depth strategy consultation based on documents and do not guarantee any decision by immigration authorities. The guide provides general information and is not personalized legal advice.",
            ]),
            ("3. Price and payment", [
                "Prices are in Canadian dollars. " + "Applicable taxes, if any, are shown at checkout.",
                "Payment is made online by credit card or, where offered, Klarna, through a secure payment provider. The firm does not store your card details.",
            ]),
            ("4. Delivery", [
                "<strong>Audits:</strong> after payment, you receive the questionnaire. Your detailed report is normally sent by email within 48 business hours of receiving your completed questionnaire.",
                "This timeframe is a target, not a guarantee: it may be somewhat longer during periods of high demand. Such a delay does not entitle you to a refund.",
                "<strong>Guide:</strong> access to the PDF as soon as payment is confirmed.",
            ]),
            ("5. Cancellation and refunds", [
                "Audits and the guide are non-refundable once paid.",
                "You acknowledge this by ticking the box before payment. If you have not received your product, write to contact@vpavocat.com: we will send it as soon as we can, ideally within a few business days, though this timeframe is not guaranteed. No refund is given in this case.",
                "These terms do not limit any rights the law grants you that cannot be waived, including under consumer protection law.",
                "<strong>Clients living in France or the European Union:</strong> where the law of your country grants it, you have a 14-day right of withdrawal from your purchase, exercised by writing to contact@vpavocat.com. This right ends earlier if you ask to receive the guide or report immediately and expressly waive it: for the guide, once you have access to it; for an audit, once the report has been sent to you.",
            ]),
            ("6. Purchase benefits", [
                "<strong>Express Audit — Worker:</strong> if you then book a full consultation, your $49 is fully credited toward your session.",
                "<strong>Express Audit — Student:</strong> if you then entrust us with your entire application, your $49 is fully deducted from our fee.",
                "<strong>Guide:</strong> you receive by email a CAD $20 discount code for your individual immigration strategy consultation.",
                "These benefits have no time limit.",
            ]),
            ("7. Lawyer-client relationship", [
                "Buying an audit or the guide does not in itself create a mandate of representation. Your information is treated confidentially.",
            ]),
            ("8. Intellectual property", ["The guide and reports are for your personal use. They may not be copied or shared without permission."]),
            ("9. Personal information", ['How we handle it is described in our <a href="PRIVACY_URL">privacy policy</a>.']),
            ("10. Governing law", [
                "These terms are governed by the laws of Québec and the laws of Canada applicable there, subject to any mandatory provisions that apply where you live.",
                "For any question or complaint: contact@vpavocat.com.",
            ]),
        ]),
        'privacy': ("Privacy policy", "How Ottavi Law Firm Inc. collects, uses and protects your personal information.", [
            ("1. Who is responsible", [
                "Ottavi Law Firm Inc., 204 Saint-Sacrement Street, Suite 300, Montréal, QC H2Y 2S9.",
                "Person in charge of the protection of personal information: Vanessa Poughon, contact@vpavocat.com.",
            ]),
            ("2. Information we collect", [
                "Depending on what you do: first and last name, email, phone number, postal code, country, billing information, audit questionnaire answers and information provided for your immigration project.",
                "Card details are entered directly with the payment provider. The firm has no access to them.",
            ]),
            ("3. Why we use it", ["To process your order, carry out your audit, send your documents and purchase-related information, answer your questions, manage appointments, and meet our legal and accounting obligations. You receive our newsletter only if you consented, and you can unsubscribe at any time."]),
            ("4. Service providers", [
                "Your information may be processed by our main providers: systeme.io (sales pages, orders and emails), the payment provider, Klarna when you choose it, Calendly (appointments) and GoDaddy (website hosting). The site also loads its fonts from Google Fonts, which receives your IP address.",
                "Some of these providers may process information outside Québec.",
            ]),
            ("5. Retention", ["We keep your information only as long as needed to process your requests, subject to periods required by law (accounting and the lawyer's record-keeping)."]),
            ("6. Your rights", ["You may request access to your information, have it corrected, or withdraw your consent by writing to contact@vpavocat.com. You may also file a complaint with the Commission d'accès à l'information du Québec."]),
            ("7. Security", ["We take reasonable measures to protect your information. Please avoid emailing sensitive documents unless invited to."]),
            ("8. Changes", ["This policy may be updated. The date of the last update appears on this page."]),
        ]),
    },
}
