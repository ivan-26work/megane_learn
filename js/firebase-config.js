// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCO3TEIw7WdZhLLMGxkq5xua3M_bdNGI84",
  authDomain: "megane-cloud.firebaseapp.com",
  projectId: "megane-cloud",
  storageBucket: "megane-cloud.firebasestorage.app",
  messagingSenderId: "879368289094",
  appId: "1:879368289094:web:b1faff6124a26dc3314347",
  measurementId: "G-T6178WJHQ9"
};

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging.js';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function demandeToken() {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BP156UcVNtSMC9U6-sQjtdyqlMe5Ey0HYenqdUO99TBMYbDqM-rqclufUDGzuMAeJAqI-6nJGWBePywO1uSQHLQ"
    });
    console.log('Token FCM:', token);
    return token;
  } catch (err) {
    console.error('Erreur token:', err);
  }
}

onMessage(messaging, (payload) => {
  console.log('Message reçu:', payload);
  if (payload.notification) {
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/images/icon-192.png'
    });
  }
});

window.demandeToken = demandeToken;
