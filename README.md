FamilyDo - Application de Gestion des Tâches Familiales
📱 Présentation
FamilyDo est une application mobile développée avec React Native et Expo pour organiser et suivre les tâches d'une famille. L'application permet de gérer les membres de la famille, les types de tâches et les tâches elles-mêmes avec un système complet d'authentification et de statistiques.

🚀 Fonctionnalités
🔐 Authentification
Connexion sécurisée avec un utilisateur administrateur prédéfini

Gestion de session persistante

👨‍👩‍👧‍👦 Gestion des Membres
CRUD complet des membres de la famille

Champs : nom, prénom, téléphone, email, mot de passe

Validation des emails uniques

📋 Types de Tâches
CRUD complet des catégories de tâches

Types par défaut : Ménage, Cuisine, Courses

Gestion des libellés personnalisés

✅ Gestion des Tâches
CRUD complet des tâches

Champs : titre, description, statut, type, membre assigné

6 statuts : Nouveau, Vue, Planifiée, En cours, Achevée, Annulée

📊 Tableau de Bord
Statistiques en temps réel

Graphiques de distribution (barres et circulaire)

Répartition par statut et par membre

Tâches actives vs terminées

🛠️ Technologies Utilisées
Frontend : React Native, Expo, TypeScript

Navigation : Expo Router

État Global : React Context API

Stockage : AsyncStorage (local)

UI : Composants React Native personnalisés

Graphiques : Composants custom sans dépendances externes

📥 Installation
1. Installer les dépendances
bash
npm install
2. Démarrer l'application
bash
npx expo start
3. Tester l'application
Scannez le QR code avec l'application Expo Go sur votre téléphone ou utilisez un émulateur.

🔐 Compte de Démonstration
Email : admin@familydo.tn

Mot de passe : admin


## le video de demo est dans /assets/demo/