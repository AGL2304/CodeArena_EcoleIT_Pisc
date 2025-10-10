import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const JWT_SECRET = process.env.JWT_SECRET ?? 'super_secret_key';
export const JWT_EXPIRES_IN = '1d';
export const JWT_ALGOS = ['HS256'];

// Middleware principal pour protéger les routes (avec User DB)
export const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token existe dans les headers
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
    const decoded = jwt.verify(token, JWT_SECRET);
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
    next();
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

// Middleware léger pour le chat (sans requête DB)
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Token d'authentification manquant"
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Erreur vérification token:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expiré'
      });
    }

    return res.status(403).json({
      success: false,
      error: "Token invalide ou expiré"
    });
  }
};

// Middleware pour Socket.io
export const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Erreur authentification Socket:", error);
    next(new Error("Authentication error: Invalid token"));
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