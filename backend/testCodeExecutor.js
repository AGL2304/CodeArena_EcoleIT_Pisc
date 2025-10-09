import { runCodeAsync } from './utils/codeExecutor.js';

console.log('🧪 Test de l\'exécuteur de code\n');

// Test 1: JavaScript simple
const testJS = async () => {
  console.log('📝 Test JavaScript...');
  const code = `
function solution(input) {
  return input[0] + input[1];
}
console.log(JSON.stringify(solution([2, 3])));
  `;
  
  try {
    const output = await runCodeAsync('javascript', code);
    console.log('✅ Résultat:', output.trim());
    console.log('');
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    console.log('');
  }
};

// Test 2: Python simple
const testPython = async () => {
  console.log('📝 Test Python...');
  const code = `
import json
def solution(input):
    return input[0] + input[1]
print(json.dumps(solution([5, 7])))
  `;
  
  try {
    const output = await runCodeAsync('python', code);
    console.log('✅ Résultat:', output.trim());
    console.log('');
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    console.log('');
  }
};

// Test 3: Code JavaScript avec erreur
const testError = async () => {
  console.log('📝 Test avec erreur...');
  const code = `
function solution(input) {
  throw new Error('Test d\\'erreur');
}
solution([1, 2]);
  `;
  
  try {
    const output = await runCodeAsync('javascript', code);
    console.log('✅ Résultat:', output.trim());
  } catch (err) {
    console.log('✅ Erreur capturée correctement:', err.message);
  }
  console.log('');
};

// Exécuter tous les tests
(async () => {
  await testJS();
  await testPython();
  await testError();
  console.log('🎉 Tests terminés!');
  process.exit(0);
})();
