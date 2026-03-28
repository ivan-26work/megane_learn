/* ═══════════════════════════════════════════════
   MEGANE_LEARN — Notifications
═══════════════════════════════════════════════ */

let notifEnabled = false;

// Initialisation
async function initNotif() {
  if (!('Notification' in window)) {
    console.log('Notifications non supportées');
    return;
  }
  
  if (Notification.permission === 'granted') {
    notifEnabled = true;
    console.log('✅ Notifications actives');
  }
}

// Demander la permission
async function askNotif() {
  if (!('Notification' in window)) {
    alert('Votre navigateur ne supporte pas les notifications');
    return false;
  }
  
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    notifEnabled = true;
    
    // Envoyer une notification de bienvenue via le Service Worker
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title: 'MEGANE_LEARN',
        body: 'Notifications activées !'
      });
    }
    
    console.log('✅ Permission accordée');
    return true;
  } else {
    console.log('❌ Permission refusée');
    return false;
  }
}

// Afficher une notification
function showNotif(title, body) {
  if (!notifEnabled) {
    console.log('Notifications non activées');
    return;
  }
  
  // Via Service Worker (meilleur pour PWA)
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title: title,
      body: body
    });
  } 
  // Fallback direct
  else if (Notification.permission === 'granted') {
    new Notification(title, { body: body });
  }
}

// Exporter les fonctions globalement
initNotif();
window.askNotif = askNotif;
window.showNotif = showNotif;
