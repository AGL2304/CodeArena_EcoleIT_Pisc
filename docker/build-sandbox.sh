#!/bin/bash

echo "🐳 Construction de l'image Docker sandbox..."

docker build -t codearena-sandbox:latest -f Dockerfile.sandbox .

if [ $? -eq 0 ]; then
    echo "✅ Image codearena-sandbox construite avec succès!"
    echo ""
    echo "Pour tester l'image:"
    echo "  docker run -it --rm codearena-sandbox:latest"
else
    echo "❌ Erreur lors de la construction de l'image"
    exit 1
fi
