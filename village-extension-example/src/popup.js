// Village Extension Popup - Import Village SDK and show facepiles

async function initPopup() {
  try {
    document.getElementById('status').textContent = 'Importing Village SDK...';
    
    console.log('📱 Popup: Importing Village SDK...');
    
    // Import Village SDK in popup
    const VillageModule = await import('../public/village-sdk.mjs');
    const Village = VillageModule.default;
    
    publicKey = process.env.PUBLIC_KEY;
    token = process.env.TOKEN;
    
    // Initialize Village
    Village.init(publicKey);
    
    // Try to authorize
    try {
      await Village.authorize(token);
      document.getElementById('status').textContent = '✅ Village ready with facepiles!';
    } catch (e) {
      document.getElementById('status').textContent = '✅ Village SDK loaded';
    }
    
    // Make Village available globally
    window.Village = Village;
    
    console.log('✅ Village SDK imported in popup');
    
  } catch (error) {
    document.getElementById('status').textContent = '❌ Failed to import Village SDK';
    console.error('Village import error:', error);
  }
}


document.addEventListener('DOMContentLoaded', initPopup);