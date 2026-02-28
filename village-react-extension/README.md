# 📦 Village Widget SDK - React Extension Example

A comprehensive guide and working example of integrating the Village Widget SDK into a React-based Chrome extension.

---

## Table of Contents

1. [Installation](#installation)  
2. [Quick Start](#quick-start)
3. [Authentication](#authentication)
   - [Token-based Authentication](#token-based-authentication)
   - [User Reference Authentication](#user-reference-authentication)
   - [Browser Extension Support](#browser-extension-support)
4. [Usage](#usage)  
   - [Initializing the SDK](#initializing-the-sdk)  
   - [Custom CTAs](#custom-ctas)  
   - [Listening to Events](#listening-to-events)  
5. [Module Usage (ES6)](#module-usage-es6)
6. [React Integration Guide](#react-integration-guide)
7. [Building the Extension](#building-the-extension)
8. [API Reference](#api-reference)
9. [Available Events](#available-events)
10. [Troubleshooting](#troubleshooting)

---

## Installation

### NPM/Yarn
```bash
npm install @villagehq/widget-sdk
# or
yarn add @villagehq/widget-sdk
```

### CDN (Script Tag)
```html
<script src="https://unpkg.com/@villagehq/widget-sdk/dist/village-widget.js"></script>
```

### ES6 Module
```javascript
import Village from '@villagehq/widget-sdk';
```

## Quick Start

```javascript
// Initialize the SDK
Village.init('YOUR_PARTNER_KEY');

// Authenticate with token
const authResult = await Village.authorize('your-auth-token', 'yourdomain.com');
if (authResult.ok) {
  console.log('Authenticated successfully!');
}
```

## Authentication

### Token-based Authentication

For applications with existing authentication systems:

```javascript
// Basic token authentication
const result = await Village.authorize(authToken, 'yourdomain.com');

// With automatic token refresh (optional callback)
const result = await Village.authorize(
  authToken, 
  'yourdomain.com',
  async () => {
    // Optional: Called when token expires, return new token
    const response = await fetch('/api/auth/refresh');
    const { accessToken } = await response.json();
    return accessToken;
  }
);
```

### User Reference Authentication

For backwards compatibility with the identify system:

```javascript
// Identify user with reference ID
await Village.authorize('user-123', { 
  email: 'user@example.com',
  name: 'John Doe' 
});

// Or use the legacy identify method
await Village.identify('user-123', {
  email: 'user@example.com',
  name: 'John Doe'
});
```

### Browser Extension Support

The SDK is fully CSP-compliant for Chrome and Firefox extensions:

```javascript
// manifest.json (Chrome Extension Manifest V3)
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  },
  "host_permissions": ["https://yourdomain.com/*"]
}

// In your extension popup or content script
import Village from '@villagehq/widget-sdk';

Village.init('YOUR_PARTNER_KEY');
const result = await Village.authorize(token, 'yourdomain.com');

// For extension popups, manually trigger widget rendering after auth
if (result.ok && window.Village._renderWidget) {
  setTimeout(() => window.Village._renderWidget(), 100);
}
```

## Usage

### Initializing the SDK

```javascript
// Basic initialization
Village.init('YOUR_PARTNER_KEY');

// With configuration
Village.init('YOUR_PARTNER_KEY', {
  paths_cta: [],  // Custom CTAs (see below)
  // other config options
});
```

### Custom CTAs

Add custom buttons to intro modals:

```javascript
Village.init('YOUR_PUBLIC_KEY', {
  paths_cta: [
    {
      label: 'Save to CRM',
      callback(payload) {
        console.log('CTA clicked:', payload);
        // Your custom action here
      },
      style: {
        backgroundColor: '#007bff',
        color: '#fff'
      }
    }
  ]
});
```

### Listening to Events

```javascript
// Listen for widget ready
Village.on('village.widget.ready', (data) => {
  console.log('Widget is ready!', data);
});

// Listen for CTA clicks
Village.on('village.path.cta.clicked', ({ index, cta, context }) => {
  console.log('CTA clicked:', cta.label, context);
});

// Listen for OAuth success
Village.on('village.oauth.success', ({ token }) => {
  console.log('OAuth successful, token received');
});
```

## Module Usage (ES6)

```javascript
import Village from '@villagehq/widget-sdk';

// Initialize and authenticate
Village.init('YOUR_PARTNER_KEY');
const result = await Village.authorize(token, 'yourdomain.com');
```

---

## React Integration Guide

### How the Village SDK Works with React

The Village SDK uses a **MutationObserver pattern** to automatically detect and enhance DOM elements with special `village-*` attributes. This means it works seamlessly with React's virtual DOM - you just need to render the HTML with the correct attributes, and the SDK handles the rest.

### Key Concepts

1. **Attribute-Based System**: The SDK looks for specific HTML attributes on elements:
   - `village-data-url`: LinkedIn URL for intro requests
   - `village-paths-availability`: Shows different states (found/not-found/loading)
   - `village-paths-data`: Displays facepiles and path counts
   - `village-module`: For sync network button

2. **Automatic DOM Updates**: The SDK watches for DOM changes and automatically:
   - Injects facepiles when paths are found
   - Updates loading states
   - Handles click events for intro requests

3. **React Compatibility**: The SDK works with React because:
   - It observes the actual DOM, not React's virtual DOM
   - It doesn't interfere with React's rendering
   - It enhances elements after React renders them

### Complete React Example

This is the actual implementation in `src/App.tsx`:

```tsx
import React, { useEffect, useState } from 'react';
import Village from '@villagehq/widget-sdk';

const App: React.FC = () => {
  const [status, setStatus] = useState<string>('Ready');

  useEffect(() => {
    const initVillage = async () => {
      // Initialize the SDK
      Village.init('pk_YOUR_PUBLIC_KEY');
      
      // Authenticate with token (required for facepiles)
      const result = await Village.authorize(
        'your-auth-token',
        'yourdomain.com'
      );
      
      if (result.ok) {
        setStatus('✅ Village ready with facepiles!');
        
        // For browser extensions, manually trigger rendering
        if (window.Village._renderWidget) {
          setTimeout(() => window.Village._renderWidget(), 100);
        }
      }
    };

    initVillage();
  }, []);

  return (
    <div>
      <h1>Village Extension</h1>
      <div>{status}</div>
      
      {/* Intro button with Village attributes */}
      <button 
        village-data-url="https://www.linkedin.com/in/username/"
        className="intro-btn"
      >
        <span village-paths-availability="found">
          <span village-paths-data="facepiles"></span>
          <span village-paths-data="count"></span>
          <span> paths found →</span>
        </span>
        <span village-paths-availability="not-found">Get Intro →</span>
        <span village-paths-availability="loading">Loading...</span>
      </button>
      
      {/* Sync Network Button */}
      <button village-module="sync">
        Sync Network
      </button>
    </div>
  );
};

export default App;
```

### What Happens Behind the Scenes

1. **Initialization**: When you call `Village.init()`, the SDK:
   - Sets up a MutationObserver to watch the DOM
   - Loads necessary styles and scripts
   - Prepares to handle Village-specific elements

2. **Authentication**: When you call `Village.authorize()`:
   - Validates the token with Village's servers
   - Enables facepile fetching
   - Returns auth status

3. **DOM Enhancement**: The SDK automatically:
   - Finds all elements with `village-data-url`
   - Fetches connection paths for each LinkedIn URL
   - Updates the DOM with facepiles and counts
   - Handles click events to open intro modals

4. **React Rendering**: Your React components:
   - Render the HTML with Village attributes
   - Don't need to manage Village state
   - Can listen to Village events if needed


---

## Building the Extension

### Development Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Development mode (with hot reload):**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

### Loading in Chrome

1. Run `npm run build` to create the production build
2. Open Chrome and navigate to `chrome://extensions/`
3. Toggle "Developer mode" ON
4. Click "Load unpacked"
5. Select the entire `village-react-extension` folder
6. Click the extension icon to test

### Project Structure

```
village-react-extension/
├── src/
│   ├── App.tsx         # Main React component with Village integration
│   ├── App.css         # Styles
│   ├── main.tsx        # React entry point
│   └── popup.html      # Extension popup HTML
├── dist/               # Built files (generated)
├── manifest.json       # Chrome extension manifest
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── vite.config.ts      # Vite build configuration
```

### Key Files Explained

- **App.tsx**: Main React component that initializes Village SDK and renders intro buttons
- **vite.config.ts**: Configures build to work as Chrome extension (handles paths, copies files)
- **manifest.json**: Defines extension permissions and popup configuration

---

## API Reference

### Core Methods

#### `Village.init(partnerKey, config?)`
Initialize the Village SDK with your partner key.

**Parameters:**
- `partnerKey` (string, required): Your Village partner key
- `config` (object, optional): Configuration options
  - `paths_cta`: Array of CTA objects

**Returns:** Village instance

---

#### `Village.authorize(token, domain, refreshCallback?)`
Authenticate a user with token or user reference.

**Parameters:**
- `token` (string): Auth token
- `domain` (string): Domain for token auth
- `refreshCallback` (function, optional): Async function to refresh token when expired

**Returns:** Promise<AuthResult>
```javascript
{
  ok: boolean,
  status: 'authorized' | 'unauthorized',
  domain?: string,
  reason?: string
}
```

---

#### `Village.identify(userReference, details?)`
Legacy method for user identification (backwards compatibility).

**Parameters:**
- `userReference` (string): Unique user identifier
- `details` (object, optional): User details (email, name, etc.)

**Returns:** Promise<void>

---

#### `Village.on(event, callback)`
Subscribe to Village events.

**Parameters:**
- `event` (string): Event name
- `callback` (function): Event handler

---

#### `Village.updatePathsCTA(ctaList)`
Replace the entire CTA list.

**Parameters:**
- `ctaList` (array): Array of CTA objects

---

#### `Village.addPathCTA(cta)`
Add a single CTA to the existing list.

**Parameters:**
- `cta` (object): CTA object with label and callback

---

## Available Events

| Event                       | Description                                    | Payload                      |
|-----------------------------|------------------------------------------------|------------------------------|
| `village.widget.ready`      | Widget has initialized                         | `void`                       |
| `village.path.cta.clicked`  | User clicked a configured CTA                  | `{ index, cta, context }`    |
| `village.paths_cta.updated` | CTA list was dynamically updated               | `PathCTA[]`                  |
| `village.user.synced`       | User graph sync completed                      | `{ userId, syncedAt }`       |
| `village.oauth.success`     | OAuth flow succeeded with token                | `{ token }`                  |
| `village.oauth.error`       | OAuth flow failed                              | `{ error }`                  |
| `village.widget.error`      | Internal widget error                          | `{ message, source, details }` |

---

## Troubleshooting

### Facepiles Not Appearing

1. **Check SDK initialization**: Ensure `Village.init()` is called with valid public key
2. **Verify authentication**: Check that `Village.authorize()` returns `{ ok: true }`
3. **Domain parameter**: Token auth requires domain parameter
4. **Browser extension context**: Call `window.Village._renderWidget()` after auth
5. **Check console**: Look for error messages in browser console
6. **LinkedIn URLs**: Ensure URLs are valid LinkedIn profile/company URLs

### Common Issues

**"Domain is required" error:**
```javascript
// Wrong
await Village.authorize(token);

// Correct
await Village.authorize(token, 'yourdomain.com');
```

**Facepiles not updating in extension:**
```javascript
// After successful auth in extension popup
if (result.ok && window.Village._renderWidget) {
  setTimeout(() => window.Village._renderWidget(), 100);
}
```

