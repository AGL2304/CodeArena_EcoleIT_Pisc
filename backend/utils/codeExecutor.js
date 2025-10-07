import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Fonction pour exécuter du code
export const runCode = (language, code, callback) => {
    // Créer un fichier temporaire
    let fileName;
    switch (language) {
        case 'python':
            fileName = 'temp.py';
            break;
        case 'javascript':
            fileName = 'temp.js';
            break;
        default:
            return callback(`Language ${language} not supported`);
    }

    const filePath = path.join('./temp', fileName);

    // S'assurer que le dossier temp existe
    if (!fs.existsSync('./temp')) {
        fs.mkdirSync('./temp');
    }

    // Écrire le code dans le fichier
    fs.writeFileSync(filePath, code);

    // Exécuter le code
    let command;
    if (language === 'python') command = `python3 ${filePath}`;
    if (language === 'javascript') command = `node ${filePath}`;

    exec(command, (error, stdout, stderr) => {
        // Supprimer le fichier après exécution
        fs.unlinkSync(filePath);

        if (error) return callback(stderr || error.message);
        return callback(null, stdout);
    });
};
