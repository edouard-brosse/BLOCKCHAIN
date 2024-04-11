@echo off

rem Lancer le serveur dans le répertoire Backend
cd Backend
start node server.js

rem Attendre un peu pour que le serveur démarre
timeout /t 5

rem Lancer npm run dev dans le répertoire FrontCrypto
cd ../FrontCrypto
start npm run dev
