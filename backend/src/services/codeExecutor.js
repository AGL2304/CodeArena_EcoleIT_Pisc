const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuration pour chaque langage
const LANGUAGE_CONFIG = {
  javascript: {
    extension: 'js',
    command: (filename) => `node ${filename}`,
    image: 'codearena-sandbox:latest'
  },
  python: {
    extension: 'py',
    command: (filename) => `python ${filename}`,
    image: 'codearena-sandbox:latest'
  },
  java: {
    extension: 'java',
    command: (filename) => {
      const className = filename.replace('.java', '');
      return `javac ${filename} && java ${className}`;
    },
    image: 'codearena-sandbox:latest'
  },
  cpp: {
    extension: 'cpp',
    command: (filename) => {
      const outputName = filename.replace('.cpp', '.out');
      return `g++ -o ${outputName} ${filename} && ./${outputName}`;
    },
    image: 'codearena-sandbox:latest'
  }
};

// Limites d'exécution
const EXECUTION_LIMITS = {
  timeout: 5000, // 5 secondes
  memory: '128m', // 128 MB
  cpus: '0.5' // 50% d'un CPU
};

class CodeExecutor {
  constructor() {
    this.tempDir = path.join(__dirname, '../../temp');
    this.ensureTempDir();
  }

  // S'assurer que le dossier temp existe
  async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Erreur lors de la création du dossier temp:', error);
    }
  }

  // Exécuter du code
  async executeCode(code, language, input = '') {
    const startTime = Date.now();
    
    try {
      // Valider le langage
      const config = LANGUAGE_CONFIG[language];
      if (!config) {
        throw new Error(`Langage non supporté: ${language}`);
      }

      // Générer un ID unique pour cette exécution
      const executionId = uuidv4();
      const filename = `code_${executionId}.${config.extension}`;
      const filepath = path.join(this.tempDir, filename);

      // Écrire le code dans un fichier
      await fs.writeFile(filepath, code);

      // Préparer la commande Docker
      const dockerCommand = this.buildDockerCommand(
        config.image,
        config.command(filename),
        this.tempDir,
        input
      );

      // Exécuter le code
      const result = await this.runCommand(dockerCommand, EXECUTION_LIMITS.timeout);

      // Calculer le temps d'exécution
      const executionTime = Date.now() - startTime;

      // Nettoyer les fichiers temporaires
      await this.cleanup(filepath, language, executionId);

      return {
        success: result.code === 0,
        output: result.stdout,
        error: result.stderr,
        executionTime,
        status: this.determineStatus(result)
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      if (error.killed) {
        return {
          success: false,
          output: '',
          error: 'Temps d\'exécution dépassé (Timeout)',
          executionTime,
          status: 'time_limit'
        };
      }

      return {
        success: false,
        output: '',
        error: error.message || 'Erreur lors de l\'exécution',
        executionTime,
        status: 'runtime_error'
      };
    }
  }

  // Construire la commande Docker
  buildDockerCommand(image, command, volumePath, input) {
    const dockerCmd = [
      'docker run',
      '--rm',
      `--memory=${EXECUTION_LIMITS.memory}`,
      `--cpus=${EXECUTION_LIMITS.cpus}`,
      '--network=none', // Pas d'accès réseau
      '--read-only', // Système de fichiers en lecture seule
      `--volume=${volumePath}:/code:ro`, // Monter le volume en lecture seule
      '--workdir=/code',
      '--user=coderunner',
      image,
      '/bin/bash',
      '-c',
      `"${command}"`
    ];

    // Ajouter l'input si présent
    if (input) {
      return `echo "${input}" | ${dockerCmd.join(' ')}`;
    }

    return dockerCmd.join(' ');
  }

  // Exécuter une commande avec timeout
  runCommand(command, timeout) {
    return new Promise((resolve, reject) => {
      const process = exec(command, {
        timeout,
        maxBuffer: 1024 * 1024 // 1MB
      }, (error, stdout, stderr) => {
        if (error) {
          if (error.killed) {
            error.killed = true;
          }
          resolve({
            code: error.code || 1,
            stdout: stdout || '',
            stderr: stderr || error.message
          });
        } else {
          resolve({
            code: 0,
            stdout,
            stderr
          });
        }
      });

      // Gérer le timeout manuellement
      setTimeout(() => {
        process.kill();
        reject({ killed: true, message: 'Timeout' });
      }, timeout + 100);
    });
  }

  // Déterminer le statut d'exécution
  determineStatus(result) {
    if (result.code === 0) {
      return 'accepted';
    }
    
    if (result.stderr.includes('Compilation error') || 
        result.stderr.includes('SyntaxError')) {
      return 'compile_error';
    }

    return 'runtime_error';
  }

  // Nettoyer les fichiers temporaires
  async cleanup(filepath, language, executionId) {
    try {
      // Supprimer le fichier source
      await fs.unlink(filepath);

      // Supprimer les fichiers compilés
      if (language === 'java') {
        const classFile = filepath.replace('.java', '.class');
        try {
          await fs.unlink(classFile);
        } catch (e) {
          // Fichier class peut ne pas exister si compilation échouée
        }
      }

      if (language === 'cpp') {
        const outFile = filepath.replace('.cpp', '.out');
        try {
          await fs.unlink(outFile);
        } catch (e) {
          // Fichier out peut ne pas exister si compilation échouée
        }
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  }

  // Tester un code avec des cas de test
  async testCode(code, language, testCases) {
    const results = [];
    
    for (const testCase of testCases) {
      const result = await this.executeCode(code, language, testCase.input);
      
      const passed = result.success && 
                    result.output.trim() === testCase.expectedOutput.trim();
      
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.output,
        passed,
        executionTime: result.executionTime,
        error: result.error
      });
    }

    const passedCount = results.filter(r => r.passed).length;
    
    return {
      results,
      passedCount,
      totalCount: testCases.length,
      allPassed: passedCount === testCases.length
    };
  }
}

module.exports = new CodeExecutor();