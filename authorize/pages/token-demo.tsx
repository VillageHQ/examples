import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Head from "next/head";

interface Person {
  id: number;
  name: string;
  linkedinUrl: string;
}

const people: Person[] = [
  {
    id: 1,
    name: "Abdallah Absi",
    linkedinUrl: "https://www.linkedin.com/in/abdabsi/",
  },
  {
    id: 2,
    name: "Google", 
    linkedinUrl: "https://www.linkedin.com/company/google/",
  },
  {
    id: 3,
    name: "Islam Ibrahim",
    linkedinUrl: "https://www.linkedin.com/in/islaamm/",
  },
];

const sampleCompanies = [
  {
    name: "Google",
    linkedinUrl: "https://www.linkedin.com/company/google",
  },
  {
    name: "Microsoft", 
    linkedinUrl: "https://www.linkedin.com/company/microsoft",
  },
];

export default function TokenDemo() {
  const [authStatus, setAuthStatus] = useState<string>("Initializing...");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Fetch token from API endpoint
  const fetchToken = async () => {
    try {
      const response = await fetch('/api/auth');
      if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.statusText}`);
      }
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("[Token Demo] Failed to fetch token:", error);
      throw error;
    }
  };

  // Refresh callback that will be called when token expires
  const refreshTokenCallback = async () => {
    console.log("[Token Demo] Refresh callback triggered!");
    setRefreshCount(prev => prev + 1);
    
    // Fetch a new token from the API
    try {
      const newToken = await fetchToken();
      console.log("[Token Demo] New token fetched from API");
      setAuthStatus(`Token refreshed (${refreshCount + 1} times)`);
      return newToken;
    } catch (error) {
      console.error("[Token Demo] Failed to refresh token:", error);
      setAuthStatus(`Failed to refresh token`);
      throw error;
    }
  };

  useEffect(() => {
    const initializeVillage = async () => {
      if (typeof window !== 'undefined' && window.Village) {
        try {
          // Fetch initial token from API
          const initialToken = await fetchToken();
          console.log("[Token Demo] Authorizing with token from API and refresh callback...");
          
          // Use the new authorize flow with token, domain, and refresh callback
          const result = await window.Village.authorize(
            initialToken,
            'yourdomain.com', // Your domain
            refreshTokenCallback // Refresh callback function
          ) as { ok: boolean; status: string; reason?: string; domain?: string };
          
          if (result.ok) {
            setAuthStatus(`✅ Authorized successfully! Domain: ${result.domain || 'default'}`);
            setIsAuthorized(true);
            console.log("[Token Demo] Authorization successful:", result);
          } else {
            setAuthStatus(`❌ Authorization failed: ${result.reason || result.status}`);
            console.error("[Token Demo] Authorization failed:", result);
          }
        } catch (error) {
          setAuthStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          console.error("[Token Demo] Authorization error:", error);
        }
      }
    };

    initializeVillage();
  }, []);

  return (
    <>
      <Head>
        <title>Village Token Authorization Demo</title>
        <meta
          name="description"
          content="Demo app showing Village SDK with token authorization and refresh callback"
        />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <a href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to main demo
            </a>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Village Token Authorization Demo
          </h1>

          {/* Authorization Status */}
          <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Authorization Status</h2>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isAuthorized ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
              <p className="text-gray-700">{authStatus}</p>
            </div>
            {refreshCount > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                Token has been automatically refreshed {refreshCount} time{refreshCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* 1. Village Sync Network Button */}
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              1. Sync Network Widget
            </h2>
            <p className="text-blue-700 mb-4">
              Sync your network using token authentication. The token will be automatically
              refreshed when it expires using the callback function.
            </p>
            <Button
              village-module="sync"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!isAuthorized}
            >
              {isAuthorized ? 'Sync Network' : 'Authorizing...'}
            </Button>
          </div>

          {/* 2. Village Search Widget (Embedded) */}
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-green-900 mb-2">
              2. Embedded Search Widget
            </h2>
            <p className="text-green-700 mb-4">
              Search for people and companies. This widget uses the authorized token
              and will continue working even after token refresh.
            </p>
            <div
              village-module="search"
              className="w-full border border-green-300 rounded-md bg-white"
              style={{ height: "500px" }}
            >
              {/* Village will populate this container with search functionality */}
            </div>
          </div>

          {/* 3. Village Find Intro Buttons */}
          <div className="mb-8 p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-orange-900 mb-2">
              3. Find Intro Buttons with Facepiles
            </h2>
            <p className="text-orange-700 mb-4">
              Get introductions to specific people. These buttons will show facepiles
              when paths are found using the authorized token.
            </p>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {people.map((person) => (
                  <li key={person.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-medium text-gray-900">
                        {person.name}
                      </div>
                      <button
                        village-data-url={person.linkedinUrl}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        disabled={!isAuthorized}
                      >
                        <span
                          village-paths-availability="found"
                          className="inline-flex items-center"
                        >
                          <span
                            village-paths-data="facepiles"
                            className="flex -space-x-2 mr-2"
                          ></span>
                          <span village-paths-data="count"></span>
                          <span className="ml-1">paths found →</span>
                        </span>
                        <span village-paths-availability="not-found">
                          Get Intro →
                        </span>
                        <span
                          village-paths-availability="loading"
                          className="inline-flex items-center"
                        >
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Checking...
                        </span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Village Browse Paths Widget */}
          <div className="mb-8 p-6 bg-purple-50 border border-purple-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-purple-900 mb-2">
              4. Browse Paths Widget
            </h2>
            <p className="text-purple-700 mb-4">
              Click on the cards to browse connection paths. These use the token
              authentication and will remain functional after token refresh.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {sampleCompanies.map((company) => (
                <div
                  key={company.name}
                  className={`border border-purple-300 rounded-md p-4 bg-white ${
                    isAuthorized ? 'cursor-pointer hover:bg-purple-50' : 'opacity-50 cursor-not-allowed'
                  } transition-colors`}
                  village-module="paths"
                  village-data-url={company.linkedinUrl}
                >
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Paths to {company.name}
                  </h3>
                  <div className="min-h-[150px] flex items-center justify-center">
                    <div
                      village-paths-availability="found"
                      className="text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span
                          village-paths-data="facepiles"
                          className="flex -space-x-2"
                        ></span>
                        <span className="text-purple-600 font-medium">
                          <span village-paths-data="count"></span> paths available
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Click to view connection paths
                      </p>
                    </div>
                    <div
                      village-paths-availability="not-found"
                      className="text-center"
                    >
                      <p className="text-gray-500">
                        No paths found to {company.name}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Click to sync more connections
                      </p>
                    </div>
                    <div
                      village-paths-availability="loading"
                      className="text-center"
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="mt-2 text-gray-500">Checking paths...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Token Refresh Info */}
          <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              How Token Refresh Works
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                This demo uses the new <code className="px-2 py-1 bg-gray-100 rounded text-sm">Village.authorize(token, domain, refreshCallback)</code> API.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The SDK validates the initial token on authorization</li>
                <li>When the token expires, the refresh callback is automatically triggered</li>
                <li>The callback returns a new token which the SDK uses seamlessly</li>
                <li>All widgets continue working without interruption</li>
                <li>Facepiles and path checking use the refreshed token automatically</li>
              </ul>
              {refreshCount > 0 && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
                  <p className="text-green-800 font-medium">
                    ✅ Token refresh is working! The callback has been triggered {refreshCount} time{refreshCount !== 1 ? 's' : ''}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Code Example */}
          <div className="mb-8 p-6 bg-gray-900 text-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Implementation Example
            </h2>
            <pre className="overflow-x-auto text-sm">
              <code>{`// Fetch token from your API endpoint
async function fetchToken() {
  const response = await fetch('/api/auth');
  const data = await response.json();
  return data.token;
}

// Define your token refresh callback
async function refreshTokenCallback() {
  const response = await fetch('/api/auth');
  const data = await response.json();
  return data.token;
}

// Initialize Village with token and refresh callback
const initialToken = await fetchToken();
const result = await Village.authorize(
  initialToken,        // Your JWT token from API
  'yourdomain.com',    // Your domain
  refreshTokenCallback // Auto-refresh function
);

if (result.ok) {
  console.log('Authorized!', result);
  // All Village widgets now work with the token
  // and will auto-refresh when needed
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}