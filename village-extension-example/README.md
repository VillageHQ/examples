# Village Browser Extension

A simple browser extension demonstrating how to **import and use the Village SDK** as an ES module in a browser extension.

## 🎯 Key Features

- ✅ **Importable Village SDK** - No script tags needed
- ✅ **No CSP Issues** - Everything bundled locally  
- ✅ **Firefox Compatible** - No remote code execution
- ✅ **Same API** - Exact same Village functions

## 📁 Files

```
village-extension-example/
├── manifest.json           # Extension manifest
├── public/
│   └── village-sdk.mjs     # Importable Village SDK
└── src/
    ├── content.js          # Adds Village buttons to LinkedIn
    ├── content.css         # Styles for injected components  
    ├── popup.html          # Extension popup UI
    ├── popup.js            # Popup logic with Village import
    └── background.js       # Background service worker
```

## 🚀 How It Works

### 1. Import Village SDK
```javascript
// In popup.js or content.js
const VillageModule = await import('../public/village-sdk.mjs');
const Village = VillageModule.default;
```

### 2. Use Village Functions
```javascript
// Initialize
Village.init('your_public_key');

// Authorize  
Village.authorize('user_token');

// Use components
Village.identify('user-id');
```

### 3. HTML Components Work
```html
<!-- Village intro buttons work automatically -->
<button village-data-url="https://linkedin.com/in/someone">
  <span village-paths-availability="found">
    <span village-paths-data="count"></span> paths found
  </span>
  <span village-paths-availability="not-found">Get Intro</span>
</button>
```

## 🔧 Installation

1. Open Chrome/Firefox extension management
2. Enable "Developer mode"  
3. Click "Load unpacked extension"
4. Select this `village-extension-example` folder
5. Visit LinkedIn to see Village buttons appear!

## 💡 For Production

Replace the demo credentials with your real Village API keys:

```javascript
// In content.js and popup.js
Village.init('your_actual_public_key');
await Village.authorize('token_from_your_backend');
```

## 🎉 Result

- **Content Script**: Adds Village intro buttons to LinkedIn pages
- **Popup**: Shows Village SDK import status and test functions
- **No Remote Code**: Everything runs locally in the extension
- **Same Experience**: Identical to the web widget, but bundled

Perfect for Luke's use case! 🚀
