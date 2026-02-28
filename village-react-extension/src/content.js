// Content script - Silently loads Village SDK for full-page modals (NO visible widgets)
console.log('🔇 Village Content Script: Loading silently...');

// Note: Content scripts can't use ES module imports directly
// The Village SDK will be loaded via the popup or we need to bundle it differently

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Village content script ready - page loaded');
  });
} else {
  console.log('🎯 Village content script ready - page already loaded');
}