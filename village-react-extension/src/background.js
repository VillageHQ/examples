// Village Extension Background Script
console.log('🚀 Village Extension: Background script loaded');

// Simple background script - just for completeness
chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ Village Extension installed');
});