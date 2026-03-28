// Test simple : notification toutes les 2 minutes
setInterval(() => {
  if (Notification.permission === 'granted') {
    showNotif('🔔 TEST MEGANE_LEARN', 'La notification fonctionne !');
    console.log('Notification envoyée à', new Date().toLocaleTimeString());
  }
}, 600000); // 120000 ms = 2 minutes

console.log('Test de rappel activé - Notification toutes les 2 minutes');
