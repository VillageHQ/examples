# Village SDK Complete Integration Example

This is a comprehensive Next.js example showcasing the complete Village SDK integration, including secure authorization flow and all available embedded UI widgets.

## Overview

This example demonstrates how to:

- Set up Village authorization in a Next.js application
- Handle the OAuth redirect flow securely
- Make authenticated requests to Village's API
- Implement all Village SDK embedded UI widgets:
  - **Sync Network** - Network synchronization and onboarding
  - **Search Widget** - Embedded network search experience
  - **Autopilot Widget** - AI-powered candidate search and screening
  - **Browse Paths** - Connection path discovery for companies
  - **Find Intro Buttons** - Introduction facilitation for specific people
- Display connection paths and relationship intelligence features
- Create a production-ready UI with proper error handling

## Quick Demo

The main page (`pages/index.tsx`) includes:

1. **🔄 Sync Network Widget** - Blue section with network sync functionality
2. **🔍 Search Widget** - Green section with embedded search experience
3. **🤖 Autopilot Widget** - Indigo section with AI-powered search and screening
4. **🛤️ Browse Paths Widget** - Purple section showing paths to companies (Google, Microsoft)
5. **👥 Find Intro Buttons** - Orange section with person-specific intro requests

## Setup

1. Clone this repository
2. Copy `.env.example` to `.env` and fill in your Village credentials:
   ```
   VILLAGE_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_VILLAGE_SCRIPT_URL=https://js.village.do
   NEXT_PUBLIC_VILLAGE_PUBLIC_KEY=your_public_key
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## How It Works

### 1. Initialize Village SDK

The Village SDK is initialized in `pages/_app.tsx` using your public key:

```typescript
// examples/authorize/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";

const VILLAGE_PUBLIC_KEY = process.env.NEXT_PUBLIC_VILLAGE_PUBLIC_KEY;
const VILLAGE_SCRIPT_URL = process.env.NEXT_PUBLIC_VILLAGE_SCRIPT_URL;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script id="village-script" strategy="beforeInteractive">
        {`
          (function(){var w=window;var d=document;var v=w.Village||{};d.head.appendChild(Object.assign(d.createElement("style"),{textContent:'[village-paths-availability="found"],[village-paths-availability="not-found"]{display:none}'}));v.q=v.q||[];v._call=function(method,args){v.q.push([method,args])};v.init=function(){v._call("init",arguments)};v.identify=function(){v._call("authorize",arguments)};w.Village=v;var l=function(){var s=d.createElement("script");s.type="text/javascript";s.async=true;s.src="${VILLAGE_SCRIPT_URL}";var x=d.getElementsByTagName("script")[0];x.parentNode.insertBefore(s,x)};if(w.Village.loaded)return;if(w.attachEvent){w.attachEvent("onload",l)}else{w.addEventListener("load",l,false)}w.Village.loaded=true})();
          Village.init('${VILLAGE_PUBLIC_KEY}');
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}
```

### 2. Generate Authorization Token Server-Side

An API route (`pages/api/auth.ts`) handles the generation of the Village authorization token. This route securely handles your `VILLAGE_SECRET_KEY` and calls the Village API (`https://api.village.do/v1/users/authorization`) with the user's unique identifier and email.

_Note: The `getSession` function in this example uses mock data. In a real application, you would fetch the actual logged-in user's session data._

```typescript
// examples/authorize/pages/api/auth.ts
import { NextApiRequest, NextApiResponse } from "next";

// Mock session function - replace with your actual session management
function getSession(
  req: NextApiRequest
): Promise<{ user: { id: string; email: string; name: string } }> {
  return Promise.resolve({
    user: {
      id: "abc123", // Replace with actual user ID
      email: "example-authorization-test@village.do", // Replace with actual user email
      name: "Example Authorization Test",
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession(req); // Fetch user session
  const secretKey = process.env.VILLAGE_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({ error: "VILLAGE_SECRET_KEY is not set" });
  }

  try {
    const response = await fetch(
      "https://api.village.do/v1/users/authorization",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "secret-key": secretKey,
          "user-identifier": session.user.id, // Your internal unique user ID
        },
        body: JSON.stringify({
          email: session.user.email, // User's email
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Village API error:", errorData);
      return res
        .status(response.status)
        .json({ error: "Failed to fetch token from Village API" });
    }

    const data = await response.json();
    return res.status(200).json({ token: data.token }); // Return the generated token
  } catch (error) {
    console.error("API route error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
```

### 3. Authorize User Client-Side

On the client-side (e.g., in `pages/index.tsx`), fetch the token from your API route (`/api/auth`) and use `window.Village.authorize(token)` to authenticate the user with the Village widget.

```typescript
// examples/authorize/pages/index.tsx (Relevant part)
import { useEffect } from "react";
// ... other imports

declare global {
  interface Window {
    Village: {
      authorize: (token: string) => void;
    };
  }
}

export default function Home() {
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/auth");
        const data = await response.json();
        if (data.token) {
          window.Village.authorize(data.token);
        }
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };

    fetchToken();
  }, []);

  // ... rest of the component with all Village widgets
}
```

## Village SDK Widgets Implementation

### 1. Sync Network Widget

```html
<button village-module="sync">Sync Network</button>
```

### 2. Search Widget

```html
<div village-module="search"></div>
```

### 3. Autopilot Widget

The Autopilot widget provides AI-powered candidate search and screening capabilities.

#### Programmatic Usage:

```javascript
window.Village.startAutopilot({
  initialQuery: "Senior engineers in San Francisco",
  criteria: ["5+ years experience", "Python or JavaScript"],
  onResultClick: (result) => {
    console.log("Result clicked:", result);
  },
  onComplete: (data) => {
    console.log("Autopilot completed with", data.results.length, "results");
  },
  onClose: () => {
    console.log("Autopilot modal closed");
  }
});
```

#### Declarative Usage:

```html
<button 
  village-module="autopilot"
  village-autopilot-query="Product managers at B2B SaaS companies"
  village-autopilot-criteria='["Experience with PLG", "Team leadership"]'
>
  Find Product Managers
</button>
```

### 4. Browse Paths Widget

```html
<div
  village-module="paths"
  village-data-url="https://www.linkedin.com/company/google"
>
  <div village-paths-availability="found">
    <!-- Village will auto-populate this with an iframe if paths were found -->
  </div>
  <div village-paths-availability="not-found">
    <!-- Fallback content when no paths are found -->
    No paths found. <a href="#" village-module="sync">Grow my network →</a>
  </div>
  <div village-paths-availability="loading">
    <!-- Loading state -->
  </div>
</div>
```

### 5. Find Intro Buttons

```html
<button village-data-url="https://www.linkedin.com/in/person">Get Intro</button>
```

## Features Demonstrated

- **Responsive Design**: All widgets adapt to different screen sizes
- **Loading States**: Proper loading indicators for async operations
- **Error Handling**: Graceful fallbacks when content isn't available
- **Color-Coded Sections**: Easy identification of different widget types
- **Production Ready**: Proper TypeScript types and error boundaries

## Documentation Links

- [Village Documentation](https://docs.village.do/)
- [Embedded UIs](https://docs.village.do/embedded-uis)
- [Authorization Flow](https://docs.village.do/authorization-flow)
- [Sync Network](https://docs.village.do/embedded-uis/sync-network)
- [Search Widget](https://docs.village.do/embedded-uis/search)
- [Autopilot Widget](https://docs.village.do/embedded-uis/autopilot)
- [Browse Paths](https://docs.village.do/embedded-uis/browse-paths)

This flow ensures that only users authenticated by your application can interact with the Village widget under their identity, while showcasing all available Village SDK capabilities.
