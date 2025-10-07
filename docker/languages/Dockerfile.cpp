# Utilise une image de base avec GCC
FROM gcc:latest

# Définis le répertoire de travail
WORKDIR /app

# Copie un script de test simple pour vérifier le fonctionnement
COPY /docker/languages/test_cpp.cpp .

# Commande par défaut (peut être écrasée)
CMD g++ -o test_cpp test_cpp.cpp && ./test_cpp