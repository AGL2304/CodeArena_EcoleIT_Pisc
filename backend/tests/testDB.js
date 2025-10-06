import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codearena_test';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ MongoDB connecté !');

    // Test simple : créer un utilisateur
    const testUser = new User({ username: 'testuser', email: 'test@test.com', password: '123456' });
    await testUser.save();
    console.log('Utilisateur créé :', testUser);

    // Nettoyer et fermer la connexion
    await User.deleteMany({});
    mongoose.connection.close();
    console.log('Test terminé et base nettoyée.');
  })
  .catch(err => console.error('❌ Erreur MongoDB :', err));
