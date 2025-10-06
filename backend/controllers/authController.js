import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// 🔹 Inscription
export const register = async (req, res) => {
  try {
    console.log("req.body:", req.body); // 🔹 debug

    const { username, email, password } = req.body;

    // Vérification que tous les champs sont présents
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hasher le mot de passe
     const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = new User({
      username,
      email,
      password: hashedPassword,
      score: 0,
      rank: 0,
    });

    await user.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// 🔹 Connexion
export const login = async (req, res) => {
  try {
    console.log("req.body:", req.body); // 🔹 debug

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
