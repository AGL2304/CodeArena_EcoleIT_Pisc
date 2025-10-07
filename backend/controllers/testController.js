import codeExecutor from '../services/codeExecutor.js';

// @desc    Tester l'exécution d'un code
// @route   POST /api/test/execute
// @access  Public (pour test)
export const executeCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    // Validation
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Le code et le langage sont requis'
      });
    }

    // Langages supportés
    const supportedLanguages = ['javascript', 'python', 'java', 'cpp', 'c'];
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Langage non supporté. Langages disponibles: ${supportedLanguages.join(', ')}`
      });
    }

    // Exécuter le code
    const result = await codeExecutor.executeCode(code, language, input || '');

    res.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Erreur lors de l\'exécution du code:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'exécution du code',
      error: error.message
    });
  }
};

// @desc    Tester avec plusieurs cas de test
// @route   POST /api/test/run-tests
// @access  Public (pour test)
export const runTests = async (req, res) => {
  try {
    const { code, language, testCases } = req.body;
console.log("coucou");
    // Validation
    if (!code || !language || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({
        success: false,
        message: 'Le code, le langage et les cas de test sont requis'
      });
    }

    // Tester le code
    const result = await codeExecutor.testCode(code, language, testCases);

    res.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Erreur lors de l\'exécution des tests:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'exécution des tests',
      error: error.message
    });
  }
};