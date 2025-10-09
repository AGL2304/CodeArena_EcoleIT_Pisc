import Submission from "../models/Submission.js";
import Challenge from "../models/Challenge.js";
import { runCode } from "../utils/codeExecutor.js";

// Helper pour transformer la fonction callback en Promise
const runCodeAsync = (language, code) => {
  return new Promise((resolve, reject) => {
    runCode(language, code, (err, output) => {
      if (err) return reject(err);
      resolve(output);
    });
  });
};

// Fonction pour extraire et préparer le code utilisateur
const prepareUserCode = (code, language, testInput) => {
  let wrappedCode = code;
  
  if (language === 'javascript') {
    // Extraire la fonction solution si elle existe
    const functionMatch = code.match(/function\s+solution\s*\([^)]*\)\s*{[\s\S]*}/);
    if (functionMatch) {
      wrappedCode = `
        ${functionMatch[0]}
        console.log(JSON.stringify(solution(${JSON.stringify(testInput)})));
      `;
    } else {
      wrappedCode = `
        ${code}
        console.log(JSON.stringify(solution(${JSON.stringify(testInput)})));
      `;
    }
  } else if (language === 'python') {
    wrappedCode = `
import json
${code}
print(json.dumps(solution(${JSON.stringify(testInput)})))
    `;
  }
  
  return wrappedCode;
};

// Fonction pour comparer les sorties
const compareOutputs = (actual, expected) => {
  try {
    // Nettoyer les sorties
    const cleanActual = actual.trim();
    const cleanExpected = JSON.stringify(expected).trim();
    
    // Essayer de parser en JSON pour comparaison
    try {
      const parsedActual = JSON.parse(cleanActual);
      return JSON.stringify(parsedActual) === JSON.stringify(expected);
    } catch {
      // Si ce n'est pas du JSON, comparer directement
      return cleanActual === cleanExpected;
    }
  } catch (err) {
    console.error("Erreur de comparaison:", err);
    return false;
  }
};

// Créer une submission et exécuter le code
export const createSubmission = async (req, res) => {
  try {
    const { userId, challengeId, code, language } = req.body;

    // Validation
    if (!userId || !challengeId || !code) {
      return res.status(400).json({ 
        message: "userId, challengeId et code sont requis" 
      });
    }

    // Récupérer le challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge non trouvé" });
    }

    // Vérifier que le challenge a des test cases
    if (!challenge.testCases || challenge.testCases.length === 0) {
      return res.status(400).json({ 
        message: "Ce challenge n'a pas de test cases définis" 
      });
    }

    const startTime = Date.now();
    let totalTests = challenge.testCases.length;
    let passedTests = 0;
    let testResults = [];
    let allOutput = [];
    let hasError = false;
    let errorMessage = null;

    // Exécuter le code pour chaque test case
    for (let i = 0; i < challenge.testCases.length; i++) {
      const testCase = challenge.testCases[i];
      
      try {
        // Préparer le code avec l'input du test
        const wrappedCode = prepareUserCode(code, language || 'javascript', testCase.input);
        
        // Exécuter le code
        const output = await runCodeAsync(language || 'javascript', wrappedCode);
        
        // Comparer avec la sortie attendue
        const passed = compareOutputs(output, testCase.output);
        
        if (passed) passedTests++;
        
        testResults.push({
          testNumber: i + 1,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: output.trim(),
          passed: passed,
          explanation: testCase.explanation || null
        });
        
        allOutput.push(`Test ${i + 1}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
        
      } catch (err) {
        hasError = true;
        errorMessage = err.toString();
        
        testResults.push({
          testNumber: i + 1,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: null,
          passed: false,
          error: err.toString()
        });
        
        allOutput.push(`Test ${i + 1}: ❌ ERREUR - ${err.message}`);
        break; // Arrêter si une erreur survient
      }
    }

    const timeTaken = Date.now() - startTime;
    const score = Math.round((passedTests / totalTests) * 100);
    const status = hasError ? 'Failed' : (passedTests === totalTests ? 'Success' : 'Failed');

    // Créer la soumission
    const submission = new Submission({
      user: userId,
      challenge: challengeId,
      code,
      language: language || 'javascript',
      output: allOutput.join('\n'),
      expectedOutput: `${passedTests}/${totalTests} tests réussis`,
      error: errorMessage,
      timeTaken,
      score,
      status
    });

    await submission.save();

    // Retourner les résultats détaillés
    res.status(201).json({ 
      message: status === 'Success' ? "Tous les tests sont passés!" : "Certains tests ont échoué",
      submission: {
        ...submission.toObject(),
        testResults,
        passedTests,
        totalTests
      }
    });

  } catch (err) {
    console.error("Erreur dans createSubmission:", err);
    res.status(500).json({ 
      message: "Erreur serveur", 
      error: err.message 
    });
  }
};

// Récupérer toutes les submissions d'un utilisateur
export const getSubmissionsByUser = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.params.userId })
      .populate("challenge", "title description difficulty")
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur serveur", 
      error: err.message 
    });
  }
};

// Récupérer toutes les submissions pour un challenge
export const getSubmissionsByChallenge = async (req, res) => {
  try {
    const submissions = await Submission.find({ challenge: req.params.challengeId })
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur serveur", 
      error: err.message 
    });
  }
};

// Récupérer une submission spécifique par ID
export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("user", "username email")
      .populate("challenge", "title description");
    
    if (!submission) {
      return res.status(404).json({ message: "Submission non trouvée" });
    }
    
    res.json(submission);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur serveur", 
      error: err.message 
    });
  }
};

// Récupérer le leaderboard pour un challenge
export const getChallengeLeaderboard = async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      challenge: req.params.challengeId,
      status: 'Success'
    })
      .populate("user", "username")
      .sort({ score: -1, timeTaken: 1 })
      .limit(10);
    
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur serveur", 
      error: err.message 
    });
  }
};