// Content script - Silently loads Village SDK for full-page modals (NO visible widgets)
console.log('🔇 Village Content Script: Loading silently...');

let Village = null;

// Initialize Village SDK silently in background - NO visible elements
async function initVillageForModals() {
  try {
    console.log('📦 Silently importing Village SDK...');
    const VillageModule = await import(chrome.runtime.getURL('public/village-sdk.mjs'));
    Village = VillageModule.default;
    
    // Make it globally available - this enables full-page modals!
    window.Village = Village;
    
    console.log('✅ Village SDK silently loaded - ready for full-page modals');
    
    // Initialize Village on the actual page (not popup)
    Village.init('pk_SMhdS08sJc8UIIxDJbeN7lEeFekDcK9');
    
    // Try to authorize
    try {
      const result = await Village.authorize('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkZW50aWZpZXIiOiIxNTYiLCJwdWJsaWNfa2V5IjoicGtfelQ0SHpabjdvVjh4N2RnN1l1Q2pCRUc0MEFNNERoenUiLCJqdGkiOiJmZGU5MTdmMTRkNzc1OGJkN2UxOTE5YTc4MmYzZjI1NyIsImlhdCI6MTc1Njk4Njc1MCwiZXhwIjoxNzg4NTIyNzUwfQ.Jz5KEbfy-61egZ44a3JkpBK7ZKrAvXd5ZFbU_S3W7HQ');
      console.log('🔐 Village silently authorized');
    } catch (e) {
      console.log('⚠️ Auth failed, but SDK ready for modals:', e);
    }
    
    console.log('🎯 Village ready - waiting for popup commands (no visible widgets)');
    
  } catch (error) {
    console.error('❌ Village import failed:', error);
  }
}

// Listen for messages from popup to trigger Village actions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Message received from popup:', message);
  
  if (message.action === 'openPaths' && Village) {
    console.log('🛤️ Opening full-page paths modal...');
    // Create a temporary element with village-module="paths" to trigger the modal
    const tempElement = document.createElement('div');
    tempElement.setAttribute('village-module', 'paths');
    tempElement.setAttribute('village-data-url', message.url);
    tempElement.style.display = 'none';
    document.body.appendChild(tempElement);
    tempElement.click();
    sendResponse({success: true});
  }
  
  if (message.action === 'openIntro' && Village) {
    console.log('🤝 Opening full-page intro modal...');
    // Create a temporary element with village-data-url to trigger the intro
    const tempElement = document.createElement('button');
    tempElement.setAttribute('village-data-url', message.url);
    tempElement.style.display = 'none';
    document.body.appendChild(tempElement);
    tempElement.click();
    sendResponse({success: true});
  }
  
  return true; // Keep message channel open
});

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVillageForModals);
} else {
  initVillageForModals();
}
