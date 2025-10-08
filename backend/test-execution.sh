#!/bin/bash

API_URL="http://localhost:5010/api"

echo "🧪 Test d'exécution de code simple"
echo ""

# Test JavaScript
echo "1️⃣  JavaScript - Hello World"
curl -X POST "$API_URL/test/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "console.log(\"Hello World\");",
    "language": "javascript"
  }'
echo -e "\n"

# Test Python
echo "2️⃣  Python - Hello World"
curl -X POST "$API_URL/test/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello World\")",
    "language": "python"
  }'
echo -e "\n"

# Test C++
echo "3️⃣  C++ - Hello World"
curl -X POST "$API_URL/test/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "#include <iostream>\nusing namespace std;\nint main() {\n  cout << \"Hello World\" << endl;\n  return 0;\n}",
    "language": "cpp"
  }'
echo -e "\n"

# Test Java
echo "4️⃣  Java - Hello World"
curl -X POST "$API_URL/test/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello World\");\n  }\n}",
    "language": "java"
  }'
echo -e "\n"
