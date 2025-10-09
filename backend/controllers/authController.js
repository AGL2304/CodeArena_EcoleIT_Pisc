import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// 🔹 Inscription
export const register = async (req, res) => {
  try {
    console.log("req.body:", req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Tous les champs sont requis" 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email déjà utilisé' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      score: 0,
      rank: 0,
      role: 'user',
    });

    await user.save();

    res.status(201).json({ 
      success: true,
      message: 'Utilisateur créé avec succès', 
      userId: user._id 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: err.message 
    });
  }
};

// 🔹 Connexion (CORRIGÉE)
export const login = async (req, res) => {
  try {
    console.log("req.body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email et mot de passe requis" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Utilisateur non trouvé' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Mot de passe incorrect' 
      });
    }

    // Générer le token avec userId (pas id)
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Réponse structurée avec success: true
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        score: user.score,
        rank: user.rank
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: err.message 
    });
  }
};

// 🔹 Obtenir le profil de l'utilisateur (CORRIGÉE)
export const getProfile = async (req, res) => {
  try {
    // req.user est l'objet utilisateur complet défini par le middleware protect
    // Pas besoin de refaire une requête à la DB
    const user = req.user;

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Utilisateur non trouvé' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        score: user.score,
        rank: user.rank
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur', 
      error: err.message 
    });
  }
};

// Profil invité
export const getGuestProfile = (req, res) => {
  res.json({
    success: true,
    message: "Bienvenue invité !",
    user: {
      role: "guest",
      username: "GuestUser"
    }
  });
};