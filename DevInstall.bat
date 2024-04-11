@echo off

rem Installer les dépendances pour le Backend
cd Backend
npm install

rem Installer les dépendances pour le FrontCrypto
cd ../FrontCrypto
npm install

rem Lancer le serveur dans le répertoire Backend
cd ../Backend
start node server.js

rem Attendre un peu pour que le serveur démarre
timeout /t 5

rem Lancer npm run dev dans le répertoire FrontCrypto
cd ../FrontCrypto
start npm run dev
