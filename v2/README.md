# Village V2 API Integration Example

A Next.js application demonstrating how to integrate with Village's V2 API-first system. Build custom frontend experiences while leveraging Village's relationship intelligence backend.

## Overview

The V2 integration enables partners to:

- **Control their UI** - Build custom paths display with your own design system
- **Query paths programmatically** - Direct API access to relationship data
- **Embed sync widget** - Minimal iframe only for network synchronization

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Partner Application                                                          │
│                                                                             │
│  ┌─────────────────────┐          ┌──────────────────────────────────────┐ │
│  │ Partner Backend     │          │ Partner Frontend                      │ │
│  │                     │          │                                       │ │
│  │ • Holds secret_key  │          │ • Uses Bearer token from backend     │ │
│  │ • Generates tokens  │◄────────►│ • Makes direct API calls to Village  │ │
│  │   via /v2/auth/tokens│         │ • Embeds sync iframe when needed      │ │
│  │                     │          │ • Builds custom paths UI              │ │
│  └─────────┬───────────┘          └─────────────┬────────────────────────┘ │
│            │                                     │                          │
└────────────┼─────────────────────────────────────┼──────────────────────────┘
             │ secret-key header                   │ Bearer token
             │                                     │
             ▼                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Village Platform                                                             │
│  ┌─────────────────────┐          ┌─────────────────────────────────────┐  │
│  │ V2 API              │          │ Widget iframe (/widget/v2)          │  │
│  │ (api.village.do)    │          │ (village.do/widget/v2)              │  │
│  │                     │          │                                     │  │
│  │ • POST /v2/auth/tokens        │ • Handles network sync              │  │
│  │ • GET /v2/user/me   │          │ • Google/LinkedIn integration       │  │
│  │ • POST /v2/companies/paths    │ • postMessage communication         │  │
│  └─────────────────────┘          └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file:

```env
# Server-side only (never expose to client)
VILLAGE_API_URL=https://api.village.do
VILLAGE_SECRET_KEY=sk_your_secret_key_here

# Client-side (public)
NEXT_PUBLIC_VILLAGE_API_URL=https://api.village.do
NEXT_PUBLIC_VILLAGE_APP_URL=https://village.do
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### 4. Test different user flows

The mock auth endpoint (`/api/auth/mock`) has a toggle for testing:

```typescript
// app/api/auth/mock/route.ts
const MOCK_USER: MockUser = {
  isActiveCustomer: true, // Toggle to test different flows
  // ...
};
```

- `isActiveCustomer: true` - User gets Village token, can sync and query paths
- `isActiveCustomer: false` - User sees upsell modal (no token generated)

## Project Structure

```
v2/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Homepage with company list
│   └── api/auth/mock/route.ts  # Server-side token generation
├── components/
│   ├── company-table/          # Company listing UI
│   ├── modals/                 # Upsell & paths modals
│   ├── providers/              # React Query provider
│   ├── ui/                     # Base components (Button, Modal, Spinner)
│   └── village-widget.tsx      # Iframe wrapper for sync
├── contexts/
│   └── auth-context.tsx        # Authentication state management
├── hooks/
│   ├── use-village-user.ts     # User query hook
│   └── use-company-paths.ts    # Paths mutation hook
├── lib/
│   ├── services/
│   │   └── village-api.ts      # API client with Bearer auth
│   ├── types/
│   │   ├── auth.types.ts       # Auth type definitions
│   │   └── village-api.types.ts # API response types
│   ├── utils/
│   │   └── iframe-messenger.ts # Widget postMessage protocol
│   ├── store/
│   │   └── widget-atoms.ts     # Jotai atoms for widget state
│   └── constants/
│       ├── query-keys.ts       # React Query cache keys
│       └── companies.ts        # Sample company data
```

## Authentication Flow

### Two-Layer Authentication

**Layer 1: Server-to-Server (Secret Key)**

```typescript
// Your backend (never expose secret key to client)
const response = await fetch("https://api.village.do/v2/auth/tokens", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "secret-key": process.env.VILLAGE_SECRET_KEY,
  },
  body: JSON.stringify({
    external_user_id: user.id,
    email: user.email,
  }),
});

const { data } = await response.json();
// data.token is a JWT valid for 1 year
```

**Layer 2: Client-to-API (Bearer Token)**

```typescript
// Your frontend
const villageApi = axios.create({
  baseURL: "https://api.village.do",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Check user status
const user = await villageApi.get("/v2/user/me");
// Query paths
const paths = await villageApi.post("/v2/companies/paths", {
  domain: "acme.com",
});
```

## Widget Integration

For users who need to sync their network (Google Contacts, LinkedIn), embed the Village widget.

### Preloaded Iframe (Recommended)

```tsx
// components/village-widget.tsx
export function VillageWidget() {
  const token = useAtomValue(widgetTokenAtom);
  const isVisible = useAtomValue(widgetVisibleAtom);
  const setVisible = useSetAtom(widgetVisibleAtom);

  useEffect(() => {
    const handler = createWidgetMessageListener({
      onCloseRequested: () => setVisible(false),
      onSyncComplete: () => {
        setVisible(false);
      },
    });
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [setVisible]);

  if (!token) return null;

  return (
    <iframe
      src={`https://village.do/widget/v2?token=${encodeURIComponent(token)}`}
      style={{ display: isVisible ? "block" : "none" }}
      className="fixed inset-0 z-[2147483647] h-full w-full border-0"
      allow="clipboard-write"
    />
  );
}
```

### PostMessage Events

**Widget → Parent:**

| Event                     | Payload              | Description         |
| ------------------------- | -------------------- | ------------------- |
| `village:ready`           | `{ version }`        | Widget loaded       |
| `village:close-requested` | `{ reason }`         | User wants to close |
| `village:view.changed`    | `{ view, previous }` | Navigation change   |
| `village:error`           | `{ code, message }`  | Error occurred      |

**Parent → Widget:**

| Command            | Payload            | Description      |
| ------------------ | ------------------ | ---------------- |
| `village:navigate` | `{ view: "sync" }` | Navigate to view |
| `village:close`    | `{ reason? }`      | Close widget     |

## User Flows

### Flow A: Non-Active Customer

1. User clicks "Find paths"
2. Upsell modal appears (no token was generated)
3. User can upgrade or dismiss

### Flow B: Active Customer (Needs Sync)

1. User clicks "Find paths"
2. Widget iframe opens
3. User connects LinkedIn/Google accounts

### Flow C: Active Customer (Ready)

1. User clicks "Find paths"
2. API call fetches paths immediately
3. Modal displays connections to people at company

## API Endpoints

| Endpoint                    | Method | Auth       | Description                   |
| --------------------------- | ------ | ---------- | ----------------------------- |
| `/v2/auth/tokens`           | POST   | secret-key | Generate user token           |
| `/v2/user/me`               | GET    | Bearer     | Get current user info         |
| `/v2/companies/paths`       | POST   | Bearer     | Get paths to company          |
| `/v2/companies/paths/check` | POST   | Bearer     | Quick path availability check |

### Response Format

All responses follow a standardized envelope:

```json
{
  "data": {
    /* response data */
  },
  "metadata": { "request_id": "req_abc123" },
  "pagination": {
    /* if applicable */
  }
}
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **React:** 19.2.1
- **State Management:** Jotai (atomic state)
- **Data Fetching:** TanStack React Query v5
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS v4

## Key Integration Points

| File                            | Purpose                        |
| ------------------------------- | ------------------------------ |
| `app/api/auth/mock/route.ts`    | Server-side token generation   |
| `contexts/auth-context.tsx`     | Auth state management          |
| `lib/services/village-api.ts`   | API client with Bearer auth    |
| `lib/utils/iframe-messenger.ts` | Widget communication utilities |
| `lib/store/widget-atoms.ts`     | Jotai atoms for widget state   |
| `components/village-widget.tsx` | Preloaded iframe component     |

## Documentation

- [Village Documentation](https://docs.village.do/)
- [API Reference](https://docs.village.do/api-reference)
