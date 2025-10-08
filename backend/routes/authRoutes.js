import express from 'express';
import { register, login, getProfile, getGuestProfile } from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protège cette route avec le middleware 'protect'
router.get('/profile', protect, getProfile);

// Accessible sans authentification
router.get('/guest-profile', getGuestProfile);

// Exemple de route nécessitant un rôle spécifique (par exemple, pour un tableau de bord admin)
router.get('/admin-dashboard', protect, authorize('admin'), (req, res) => {
  res.json({ message: `Bienvenue sur le tableau de bord admin, ${req.user.username}!` });
});

export default router;
