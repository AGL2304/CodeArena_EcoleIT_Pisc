# Utilise une image Node.js légère
FROM node:16-slim

# Définis le répertoire de travail
WORKDIR /app

# Copie un script de test simple pour vérifier le fonctionnement
COPY /docker/languages/test_javascript.js .

# Commande par défaut (peut être écrasée)
CMD ["node", "./test_javascript.js"]