const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour protéger les routes
exports.protect = async (req, res, next) => {
  let token;

  // Vérifier si le token existe dans les headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé. Veuillez vous connecter.'
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
};

// Middleware pour vérifier les rôles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas les permissions nécessaires'
      });
    }
    next();
  };
};