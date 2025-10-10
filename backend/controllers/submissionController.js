import Submission from "../models/Submission.js";
import Challenge from "../models/Challenge.js";
import { runCode } from "../utils/codeExecutor.js";
import mongoose from "mongoose";

// Import de la version async
import { runCodeAsync } from "../utils/codeExecutor.js";

// Ou garder cette version si vous préférez
/*
const runCodeAsync = (language, code) => {
  return new Promise((resolve, reject) => {
    runCode(language, code, (err, output) => {
      if (err) return reject(err);
      resolve(output);
    });
  });
};
*/

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
    // Nettoyer les sorties et gérer undefined / null
    const cleanActual = actual != null ? actual.toString().trim() : '';
    const cleanExpected = expected != null ? JSON.stringify(expected).trim() : '';

    // Essayer de parser en JSON pour comparaison
    try {
      const parsedActual = JSON.parse(cleanActual);
      return JSON.stringify(parsedActual) === cleanExpected;
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
    // ✅ On récupère userId d'abord
    const userId = req.body.userId || null;
    const { challengeId, code, language } = req.body;

    console.log("Création de la submission pour l'utilisateur:", userId);
    console.log("Challenge ID:", challengeId);
    console.log("Langage:", language);
    console.log("Code soumis:\n", code);

    // Validation
    if (!challengeId || !code) {
      return res.status(400).json({ 
        message: "challengeId et code sont requis" 
      });
    }

    // Récupérer le challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge non trouvé" });
    }

    // Vérifier qu’il y a des test cases
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

    console.log(`Exécution de ${totalTests} test(s) pour le challenge "${challenge.title}"`);

    for (let i = 0; i < challenge.testCases.length; i++) {
      console.log(`Exécution du test ${i + 1}...`);

      const testCase = challenge.testCases[i];

      try {
        console.log("Préparation du code pour le test avec l'input:", testCase.input);
        const wrappedCode = prepareUserCode(code, language || 'python', testCase.input);
        console.log("Code préparé:\n", wrappedCode);

        const output = await runCodeAsync(language || 'python', wrappedCode);
        console.log("Sortie obtenue:", output);

        const passed = compareOutputs(output, testCase.output);
        console.log(`Test ${i + 1} ${passed ? 'réussi' : 'échoué'}`);

        if (passed) passedTests++;

        testResults.push({
          testNumber: i + 1,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: typeof output === "string" ? output.trim() : String(output),
          passed: passed,
          explanation: testCase.explanation || null
        });

        allOutput.push(`Test ${i + 1}: ${passed ? '✅ PASS' : '❌ FAIL'}`);

      } catch (err) {
        console.log("Erreur lors de l'exécution du code:", err);
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
        break;
      }
    }

    console.log("Résultats des tests:", testResults);

    const timeTaken = Date.now() - startTime;
    const score = Math.round((passedTests / totalTests) * 100);
    const status = hasError ? 'Failed' : (passedTests === totalTests ? 'Success' : 'Failed');

    // ✅ Création correcte de la soumission
    const submission = new Submission({
      user: mongoose.isValidObjectId(userId) ? userId : null, // ✅ Vérifie si userId est un vrai ObjectId
      challenge: challengeId,
      code,
      language: language || 'python',
      output: allOutput.join('\n'),
      expectedOutput: `${passedTests}/${totalTests} tests réussis`,
      error: errorMessage,
      timeTaken,
      score,
      status
    });

    await submission.save();

    // ✅ Réponse complète
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