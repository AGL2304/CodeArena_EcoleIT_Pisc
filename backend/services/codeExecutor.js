import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Répertoire temporaire pour les fichiers
const TEMP_DIR = path.join(__dirname, '../temp');

// Créer le répertoire temp s'il n'existe pas
const ensureTempDir = async () => {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error('Erreur création répertoire temp:', error);
  }
};

// Nettoyer les fichiers temporaires
const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Ignorer les erreurs de nettoyage
  }
};

// Exécuter une commande avec timeout
const execWithTimeout = (command, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    exec(command, { 
      timeout,
      maxBuffer: 1024 * 1024 // 1MB
    }, (error, stdout, stderr) => {
      if (error) {
        resolve({
          success: false,
          output: stderr || error.message,
          error: true,
          executionTime: 0
        });
      } else {
        resolve({
          success: true,
          output: stdout,
          error: false,
          executionTime: 0
        });
      }
    });
  });
};

// Exécuter du code
export const executeCode = async (code, language, input = '') => {
  await ensureTempDir();
  const fileId = uuidv4();
  let filePath, command;

  try {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        filePath = path.join(TEMP_DIR, `${fileId}.js`);
        await fs.writeFile(filePath, code);
        command = input 
          ? `echo "${input}" | node "${filePath}"`
          : `node "${filePath}"`;
        break;

      case 'python':
      case 'py':
        filePath = path.join(TEMP_DIR, `${fileId}.py`);
        await fs.writeFile(filePath, code);
        command = input
          ? `echo "${input}" | python3 "${filePath}"`
          : `python3 "${filePath}"`;
        break;

      case 'cpp':
      case 'c++':
        filePath = path.join(TEMP_DIR, `${fileId}.cpp`);
        const execPath = path.join(TEMP_DIR, `${fileId}`);
        await fs.writeFile(filePath, code);
        command = input
          ? `g++ "${filePath}" -o "${execPath}" && echo "${input}" | "${execPath}"`
          : `g++ "${filePath}" -o "${execPath}" && "${execPath}"`;
        break;

      case 'java':
        // Extraire le nom de la classe du code
        const classMatch = code.match(/public\s+class\s+(\w+)/);
        const className = classMatch ? classMatch[1] : 'Main';
        filePath = path.join(TEMP_DIR, `${className}.java`);
        await fs.writeFile(filePath, code);
        command = input
          ? `cd "${TEMP_DIR}" && javac "${className}.java" && echo "${input}" | java ${className}`
          : `cd "${TEMP_DIR}" && javac "${className}.java" && java ${className}`;
        break;

      case 'c':
        filePath = path.join(TEMP_DIR, `${fileId}.c`);
        const cExecPath = path.join(TEMP_DIR, `${fileId}`);
        await fs.writeFile(filePath, code);
        command = input
          ? `gcc "${filePath}" -o "${cExecPath}" && echo "${input}" | "${cExecPath}"`
          : `gcc "${filePath}" -o "${cExecPath}" && "${cExecPath}"`;
        break;

      default:
        throw new Error(`Langage non supporté: ${language}`);
    }

    const result = await execWithTimeout(command);
    
    // Nettoyer les fichiers
    await cleanupFile(filePath);
    if (language.toLowerCase() === 'cpp' || language.toLowerCase() === 'c++') {
      await cleanupFile(path.join(TEMP_DIR, fileId));
    }
    if (language.toLowerCase() === 'c') {
      await cleanupFile(path.join(TEMP_DIR, fileId));
    }

    return result;

  } catch (error) {
    await cleanupFile(filePath);
    throw error;
  }
};

// Exécuter du code avec des cas de test
export const testCode = async (code, language, testCases) => {
  const results = [];
  let passedTests = 0;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const { input, expectedOutput } = testCase;

    try {
      const result = await executeCode(code, language, input);
      
      const actualOutput = result.output.trim();
      const expected = expectedOutput.trim();
      const passed = actualOutput === expected;

      if (passed) passedTests++;

      results.push({
        testCase: i + 1,
        input,
        expectedOutput: expected,
        actualOutput,
        passed,
        error: result.error ? result.output : null
      });

    } catch (error) {
      results.push({
        testCase: i + 1,
        input,
        expectedOutput,
        actualOutput: '',
        passed: false,
        error: error.message
      });
    }
  }

  return {
    totalTests: testCases.length,
    passedTests,
    failedTests: testCases.length - passedTests,
    results
  };
};

export default {
  executeCode,
  testCode
};
