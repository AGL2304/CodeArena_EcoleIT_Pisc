#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:5010/api"

echo -e "${BLUE}🧪 Test de l'API CodeArena${NC}"
echo ""

# 1. Test de santé
echo -e "${YELLOW}1️⃣  Test de santé de l'API...${NC}"
curl -s "${API_URL%/api}/api/health" | jq '.'
echo ""

# 2. Test d'inscription
echo -e "${YELLOW}2️⃣  Test d'inscription...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$REGISTER_RESPONSE" | jq '.'
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
echo -e "${GREEN}✅ Token reçu: ${TOKEN:0:20}...${NC}"
echo ""

# 3. Test de connexion
echo -e "${YELLOW}3️⃣  Test de connexion...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# 4. Test de récupération du profil
echo -e "${YELLOW}4️⃣  Test de récupération du profil...${NC}"
curl -s -X GET "$API_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# 5. Test d'exécution de code JavaScript
echo -e "${YELLOW}5️⃣  Test d'exécution de code JavaScript...${NC}"
curl -s -X POST "$API_URL/test/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "console.log(\"Hello from JavaScript!\");",
    "language": "javascript"
  }' | jq '.'
echo ""

# 6. Test d'exécution de code Python
echo -e "${YELLOW}6️⃣  Test d'exécution de code Python...${NC}"
curl -s -X POST "$API_URL/test/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello from Python!\")",
    "language": "python"
  }' | jq '.'
echo ""

# 7. Test avec des cas de test
echo -e "${YELLOW}7️⃣  Test avec des cas de test (Addition)...${NC}"
curl -s -X POST "$API_URL/test/run-tests" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const readline = require(\"readline\");\nconst rl = readline.createInterface({\n  input: process.stdin\n});\nrl.on(\"line\", (line) => {\n  const [a, b] = line.split(\" \").map(Number);\n  console.log(a + b);\n  rl.close();\n});",
    "language": "javascript",
    "testCases": [
      {
        "input": "2 3",
        "expectedOutput": "5"
      },
      {
        "input": "10 20",
        "expectedOutput": "30"
      }
    ]
  }' | jq '.'
echo ""

echo -e "${GREEN}✅ Tests terminés!${NC}"
