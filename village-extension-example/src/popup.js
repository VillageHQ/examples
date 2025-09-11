// Village Extension Popup - Import Village SDK and show facepiles
import { Village } from '@villagehq/widget-sdk';

async function initPopup() {
  try {
    document.getElementById('status').textContent = 'Importing Village SDK...';
    
    console.log('📱 Popup: Importing Village SDK...');
    
    // Import Village SDK in popup
    // const VillageModule = await import('../public/village-sdk.mjs');
    // const Village = VillageModule.default;
    
    // publicKey = process.env.PUBLIC_KEY;
    // token = process.env.TOKEN;
    
    // Initialize Village
    Village.init('pk_SMhdS08sJc8UIIxDJbeN7lEeFekDcK9');
    
    // Try to authorize
    try {
      await Village.authorize('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkZW50aWZpZXIiOiIxNTYiLCJwdWJsaWNfa2V5IjoicGtfelQ0SHpabjdvVjh4N2RnN1l1Q2pCRUc0MEFNNERoenUiLCJqdGkiOiJkMmEzNmM0ZmQwOWE4MDk0MDU0NGMyM2I1NWUzMjNlMCIsImlhdCI6MTc1NzMzODgxNCwiZXhwIjoxNzg4ODc0ODE0fQ.8nR4PdHAQsAUudYg4P_I1vvDzNPBkQKXW4-WyBR4Wjg');
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