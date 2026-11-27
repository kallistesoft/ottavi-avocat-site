# Outil de pré-remplissage des formulaires d'IRCC — plan

Plan de travail pour un outil destiné aux avocats et aux conseillers réglementés en immigration (CRIC):
le client remplit un questionnaire, le professionnel dépose le PDF du client et le formulaire d'IRCC dans l'outil,
et l'outil renvoie le formulaire d'IRCC pré-rempli. Rédigé le 2026-11-27. Ce document est un plan, pas une décision finale.

## 1. Objectif

Faire gagner du temps au professionnel et réduire les erreurs de recopie: les réponses du client sont saisies une seule
fois, puis écrites dans les formulaires officiels d'IRCC. Le professionnel garde le contrôle: il vérifie le formulaire
dans Adobe Reader et clique lui-même sur « Valider » (code-barres 2D).

## 2. Ce qui existe déjà dans ce dépôt

- Questionnaire client (`/formulaire/mobilite-francophone/`): réponses enregistrées dans le navigateur du client, PDF
  produit dans le navigateur, avec les réponses en JSON joint (`reponses.json`). Rien n'est envoyé à un serveur.
- Outil du professionnel (`/outil/mobilite-francophone/`): remplit l'IMM 1295 (hors Canada) et l'IMM 5710 (au Canada)
  dans le navigateur à partir du PDF du client. L'IMM 5707 est écarté pour l'instant.
- Méthode de remplissage (`tools/ircc/prepare.py`, `assets/ircc/`): seul le paquet XFA `datasets` est réécrit, en mise à
  jour incrémentale du PDF d'IRCC (octets d'origine conservés, certification et droits Reader intacts).
- Nettoyage des caractères que le validateur d'IRCC refuse, et tests « Valider » réussis sur un IMM 5710 et un IMM 1295
  (voir `DECISIONS.md`).

## 3. Version 1 proposée

Le professionnel glisse deux fichiers dans l'outil: le PDF du client et le formulaire d'IRCC qu'il a téléchargé
lui-même sur le site d'IRCC. L'outil renvoie le formulaire rempli. Rien n'est conservé.

- Formulaires: IMM 1295 et IMM 5710.
- Reconnaissance du formulaire et de sa version à partir du PDF déposé; refus clair d'une version non supportée.
- Règles de correspondance « réponse du client → champ du formulaire », versionnées par formulaire.
- Comptes et abonnement vérifiés côté serveur.

Hors V1: espace de stockage des formulaires vierges, autres formulaires, import de dossiers.

## 4. Architecture visée

1. Le navigateur lit le JSON joint au PDF du client (aucun envoi du PDF complet).
2. Le navigateur envoie au serveur le JSON, le formulaire vierge d'IRCC et le formulaire choisi.
3. Le serveur applique les règles de correspondance (stockées sur Firebase), écrit les données dans le formulaire en
   mémoire, puis renvoie le PDF rempli dans la réponse.
4. Le professionnel ouvre le PDF dans Adobe Reader, vérifie et clique sur « Valider ».

Les règles restent sur le serveur: elles ne sont jamais livrées au navigateur.

## 5. Sécurité et confidentialité

- Région canadienne pour les fonctions et les données de configuration.
- Traitement en mémoire; aucune écriture des données client dans Storage, Firestore ou les journaux.
- Journaux minimaux (date, compte, formulaire), jamais le contenu du JSON.
- Authentification de chaque requête côté serveur, abonnement vérifié à chaque appel, limites d'utilisation et
  Firebase App Check.
- Validation de la forme et de la taille du JSON avant utilisation; numéro de version du questionnaire dans le JSON.
- Politique de confidentialité exacte sur ce qui transite et sur le sous-traitant (loi 25 au Québec, LPRPDE).
- Vérifier les journaux de Firebase avant d'affirmer publiquement que rien n'est conservé.

## 6. Règles et versions d'IRCC

- Une table de correspondance par formulaire et par version (chemins des champs XFA).
- À chaque nouvelle version d'un formulaire: contrôler les chemins, refaire « Valider », mettre les règles à jour.
- Le serveur refuse une version qu'il ne connaît pas plutôt que de deviner.

## 7. Droit d'auteur (à confirmer, ce n'est pas un avis juridique)

- Les conditions du gouvernement du Canada demandent une autorisation écrite pour la reproduction destinée à la
  redistribution commerciale, et pour la modification d'une œuvre.
- V1: le professionnel apporte son propre exemplaire du formulaire; l'outil n'héberge ni ne redistribue de formulaire et
  n'en modifie ni le texte ni la mise en page; il y inscrit seulement des données.
- À faire: confirmer avec un avocat en propriété intellectuelle et/ou envoyer une demande d'autorisation de droit
  d'auteur de la Couronne à IRCC (formulaire de demande indiqué dans leurs conditions d'utilisation).
- Le dépôt actuel embarque les PDF d'IRCC dans des fichiers JavaScript publics (`assets/ircc/*.js`): à revoir avant toute
  diffusion commerciale.
- Propriété et licence du code de ce dépôt: à clarifier avant de réutiliser l'outil pour d'autres professionnels.

## 8. Étapes

1. Lire en entier `assets/ircc/outil.js`, `tools/ircc/prepare.py` et les fichiers `*-map.js`.
2. Extraire la lecture du formulaire déposé (déchiffrement, lecture des paquets XFA) pour qu'elle ne dépende plus d'un
   PDF embarqué.
3. Prototype du serveur: un point d'entrée qui reçoit le JSON et le PDF, renvoie le PDF rempli.
4. Règles sur Firebase, comptes, abonnement, limites d'utilisation.
5. Tests « Valider » dans Adobe sur des cas variés (statuts, types de permis, numéros de téléphone américains).
6. Essai avec quelques professionnels volontaires.
7. Demande d'autorisation / avis juridique, puis V2 (espace avec formulaires vierges, autres formulaires).

## 9. Questions ouvertes

- Qui possède le code et sous quelle licence? (voir section 7)
- Prix et forme d'abonnement (à valider avec de vrais utilisateurs).
- Français et adaptation au Québec (CAQ, MIFI) dans le questionnaire.
- Quels autres formulaires ajouter en premier après IMM 1295 et IMM 5710?
