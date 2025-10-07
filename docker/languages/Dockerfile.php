# Utilise une image PHP FPM légère
FROM php:8.1-cli-alpine

# Définis le répertoire de travail
WORKDIR /app

# Copie un script de test simple pour vérifier le fonctionnement
COPY /docker/languages/test_php.php .

# Commande par défaut (peut être écrasée)
CMD ["php", "./test_php.php"]