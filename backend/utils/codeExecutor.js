import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Créer un dossier temporaire pour les fichiers d'exécution
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Nettoyer les anciens fichiers temporaires au démarrage
const cleanupOldFiles = () => {
  try {
    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);
      // Supprimer les fichiers de plus de 5 minutes
      if (now - stats.mtimeMs > 5 * 60 * 1000) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (err) {
    console.error('Erreur lors du nettoyage:', err);
  }
};

cleanupOldFiles();

/**
 * Exécute du code dans un environnement isolé
 * @param {string} language - Le langage de programmation (javascript, python, java, cpp, php)
 * @param {string} code - Le code source à exécuter
 * @param {function} callback - Callback (err, output)
 */
export const runCode = (language, code, callback) => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const fileId = `${timestamp}_${randomId}`;
  
  let filePath, command;
  const timeout = 5000; // 5 secondes max

  try {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        filePath = path.join(tempDir, `${fileId}.js`);
        fs.writeFileSync(filePath, code);
        command = `node "${filePath}"`;
        break;

      case 'python':
      case 'py':
        filePath = path.join(tempDir, `${fileId}.py`);
        fs.writeFileSync(filePath, code);
        command = `python3 "${filePath}"`;
        break;

      case 'java':
        filePath = path.join(tempDir, `${fileId}.java`);
        // Extraire le nom de la classe du code
        const classMatch = code.match(/public\s+class\s+(\w+)/);
        const className = classMatch ? classMatch[1] : 'Solution';
        const javaFilePath = path.join(tempDir, `${className}.java`);
        fs.writeFileSync(javaFilePath, code);
        command = `cd "${tempDir}" && javac "${className}.java" && java ${className}`;
        filePath = javaFilePath; // Pour le cleanup
        break;

      case 'cpp':
      case 'c++':
        filePath = path.join(tempDir, `${fileId}.cpp`);
        const execPath = path.join(tempDir, fileId);
        fs.writeFileSync(filePath, code);
        command = `g++ "${filePath}" -o "${execPath}" && "${execPath}"`;
        break;

      case 'php':
        filePath = path.join(tempDir, `${fileId}.php`);
        fs.writeFileSync(filePath, code);
        command = `php "${filePath}"`;
        break;

      default:
        return callback(new Error(`Langage non supporté: ${language}`));
    }

    console.log(`🔧 Exécution: ${command}`);

    // Exécuter le code avec un timeout
    const execProcess = exec(
      command,
      {
        timeout: timeout,
        maxBuffer: 1024 * 1024, // 1MB max output
        killSignal: 'SIGTERM'
      },
      (error, stdout, stderr) => {
        // Nettoyer les fichiers temporaires
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          // Nettoyer les fichiers compilés Java
          if (language.toLowerCase() === 'java') {
            const classFile = filePath.replace('.java', '.class');
            if (fs.existsSync(classFile)) {
              fs.unlinkSync(classFile);
            }
          }
          // Nettoyer les exécutables C++
          if (language.toLowerCase() === 'cpp' || language.toLowerCase() === 'c++') {
            const execPath = path.join(tempDir, fileId);
            if (fs.existsSync(execPath)) {
              fs.unlinkSync(execPath);
            }
          }
        } catch (cleanupErr) {
          console.error('Erreur de nettoyage:', cleanupErr);
        }

        // Gérer les erreurs
        if (error) {
          if (error.killed) {
            return callback(new Error('Timeout: Le code a pris trop de temps à s\'exécuter'));
          }
          return callback(new Error(stderr || error.message));
        }

        if (stderr && !stdout) {
          return callback(new Error(stderr));
        }

        // Retourner la sortie standard
        callback(null, stdout);
      }
    );

    // Timeout de sécurité supplémentaire
    setTimeout(() => {
      if (execProcess.exitCode === null) {
        execProcess.kill('SIGKILL');
      }
    }, timeout + 1000);

  } catch (err) {
    console.error('Erreur dans runCode:', err);
    callback(err);
  }
};

// Version Promise pour faciliter l'utilisation
export const runCodeAsync = (language, code) => {
  return new Promise((resolve, reject) => {
    runCode(language, code, (err, output) => {
      if (err) return reject(err);
      resolve(output);
    });
  });
};

// Exporter par défaut pour compatibilité
export default { runCode, runCodeAsync };