import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  connect(url = 'http://localhost:5010') {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.io connecté');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.io déconnecté');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion Socket.io:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
    }
  }

  // Rejoindre une salle
  joinRoom(roomId, username, userId) {
    if (!this.socket) {
      console.error('Socket non connecté');
      return;
    }

    this.socket.emit('joinRoom', { roomId, username, userId });
  }

  // Quitter une salle
  leaveRoom(roomId) {
    if (!this.socket) return;
    this.socket.emit('leaveRoom', { roomId });
  }

  // Envoyer un message
  sendMessage(roomId, content, userId, username, type = 'text') {
    if (!this.socket) {
      console.error('Socket non connecté');
      return;
    }

    this.socket.emit('sendMessage', {
      roomId,
      content,
      userId,
      username,
      type
    });
  }

  // Indicateur de frappe
  startTyping(roomId, userId, username) {
    if (!this.socket) return;
    this.socket.emit('typing', { roomId, userId, username });
  }

  stopTyping(roomId, userId) {
    if (!this.socket) return;
    this.socket.emit('stopTyping', { roomId, userId });
  }

  // Marquer comme lu
  markAsRead(roomId, userId) {
    if (!this.socket) return;
    this.socket.emit('markAsRead', { roomId, userId });
  }

  // Mettre à jour le score
  updateScore(roomId, score) {
    if (!this.socket) return;
    this.socket.emit('updateScore', { roomId, score });
  }

  // Écouter un événement
  on(eventName, callback) {
    if (!this.socket) {
      console.error('Socket non connecté');
      return;
    }

    this.socket.on(eventName, callback);
    
    // Stocker le listener pour pouvoir le supprimer plus tard
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(callback);
  }

  // Arrêter d'écouter un événement
  off(eventName, callback) {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(eventName, callback);
      
      // Retirer de la liste des listeners
      const callbacks = this.listeners.get(eventName);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    } else {
      this.socket.off(eventName);
      this.listeners.delete(eventName);
    }
  }

  // Écouter une seule fois
  once(eventName, callback) {
    if (!this.socket) {
      console.error('Socket non connecté');
      return;
    }

    this.socket.once(eventName, callback);
  }

  // Vérifier si connecté
  isConnected() {
    return this.connected && this.socket?.connected;
  }

  // Obtenir l'instance du socket
  getSocket() {
    return this.socket;
  }
}

// Export singleton
export default new SocketService();