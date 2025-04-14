# Village Authorization Flow Example

This is a full-stack Next.js example showing how to implement Village's authorization flow for embedded UIs.

## Overview

This example demonstrates how to:

- Set up Village authorization in a Next.js application
- Handle the OAuth redirect flow
- Make authenticated requests to Village's API
- Display connection paths and other relationship intelligence features

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

### 1. Initialize Village Widget

The Village widget is initialized in `pages/_app.tsx` using your public key:

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

An API route (`pages/api/auth.ts`) handles the generation of the Village authorization token. This route should securely handle your `VILLAGE_SECRET_KEY` and call the Village API (`https://api.village.do/v1/users/authorization`) with the user's unique identifier and email.

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
      // Potentially other Village methods
    };
  }
}

export default function Home() {
  useEffect(() => {
    const fetchTokenAndAuthorize = async () => {
      try {
        // Fetch the token from your backend API route
        const response = await fetch("/api/auth");
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        const data = await response.json();

        // Check if token exists and authorize the user
        if (data.token && window.Village) {
          window.Village.authorize(data.token);
          console.log("Village user authorized.");
        } else if (!data.token) {
          console.error("Token not received from API.");
        } else {
          console.error("Village SDK not loaded yet.");
        }
      } catch (error) {
        console.error("Failed to fetch token or authorize:", error);
      }
    };

    // Ensure Village SDK is loaded before attempting to authorize
    if (window.Village) {
       fetchTokenAndAuthorize();
    } else {
      // Optional: Add a listener or retry mechanism if the SDK might load later
      console.log("Waiting for Village SDK to load...");
      // Example: Re-check after a delay, or use the SDK's load callback if available
    }

  }, []); // Empty dependency array ensures this runs once on mount

  // ... rest of the component JSX
  return (
    // ... JSX for displaying content, e.g., the people list ...
  );
}
```

This flow ensures that only users authenticated by your application can interact with the Village widget under their identity.
