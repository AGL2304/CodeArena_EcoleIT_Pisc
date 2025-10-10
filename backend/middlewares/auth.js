import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const JWT_SECRET = process.env.JWT_SECRET ?? 'super_secret_key'; // même fallback, un seul endroit
export const JWT_EXPIRES_IN = '1d';
export const JWT_ALGOS = ['HS256']; // optionnel mais bien


// Middleware pour protéger les routes
export const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token existe dans les headers (format: Bearer TOKEN)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log("Token reçu:", token);

  // Si aucun token n'est trouvé
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé. Veuillez vous connecter.'
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé:", decoded);

    // Récupérer l'utilisateur à partir de l'ID décodé du token
    const user = await User.findById(decoded.userId).select('-password');
    console.log("Utilisateur trouvé:", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé ou compte supprimé.'
      });
    }

    req.user = user;
    next(); // Passer au middleware suivant ou au contrôleur
  } catch (error) {
    console.error('Erreur de vérification du token:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Votre session a expiré. Veuillez vous reconnecter.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide. Accès non autorisé.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'authentification.'
    });
  }
};

// Middleware pour vérifier les rôles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Rôle utilisateur non défini ou non authentifié.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Vous n'avez pas les permissions nécessaires pour accéder à cette ressource. Votre rôle actuel est: ${req.user.role}.`
      });
    }

    next();
  };
};
