// Test : notification toutes les 2 minutes
function envoyerNotif() {
  if (Notification.permission === 'granted') {
    new Notification('🔔 MEGANE_LEARN', {
      body: 'Test - ' + new Date().toLocaleTimeString(),
      icon: '/images/icon-192.png'
    });
    console.log('Notification envoyée à', new Date().toLocaleTimeString());
  }
}

setInterval(envoyerNotif, 120000);
setTimeout(envoyerNotif, 5000);
