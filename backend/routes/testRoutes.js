import express from 'express';
import { executeCode, runTests } from '../controllers/testController.js';

const router = express.Router();

// Routes de test d'exécution
router.post('/execute', executeCode);
router.post('/run-tests', runTests);

export default router;
