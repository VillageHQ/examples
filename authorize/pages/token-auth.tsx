import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Head from "next/head";

export default function TokenAuth() {
  const [authMode, setAuthMode] = useState<"legacy" | "token">("token");
  const [authStatus, setAuthStatus] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [domain, setDomain] = useState<string>("yourdomain.com");
  const [refreshEnabled, setRefreshEnabled] = useState(false);

  // Mock token generator for demo
  const generateMockToken = () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      user_id: "user_123",
      email: "demo@example.com",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = "mock_signature_" + Math.random().toString(36).substring(7);
    return `${header}.${payload}.${signature}`;
  };

  // Mock refresh token function
  const refreshToken = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const newToken = generateMockToken();
    setToken(newToken);
    setAuthStatus("Token refreshed successfully!");
    return newToken;
  };

  // Legacy authorization
  const handleLegacyAuth = () => {
    window.Village.authorize("user123", {
      email: "user@example.com",
      name: "Demo User"
    });
    setAuthStatus("Legacy authorization: Called identify('user123')");
  };

  // Token-based authorization
  const handleTokenAuth = async () => {
    if (!token) {
      setAuthStatus("Please generate or enter a token first");
      return;
    }

    try {
      const result = await window.Village.authorize(
        token,
        domain || undefined,
        refreshEnabled ? refreshToken : undefined
      );
      
      if (result.ok) {
        setAuthStatus(`✅ Authorization successful! Status: ${result.status}`);
      } else {
        setAuthStatus(`❌ Authorization failed: ${result.reason || result.status}`);
      }
    } catch (error) {
      setAuthStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  useEffect(() => {
    // Initialize with a mock token
    setToken(generateMockToken());
  }, []);

  return (
    <>
      <Head>
        <title>Village Token Authorization Demo</title>
        <meta
          name="description"
          content="Demo of Village SDK's new token-based authorization flow"
        />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <a href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to main demo
            </a>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Village Token Authorization Demo
          </h1>

          {/* Mode Selector */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authorization Mode</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setAuthMode("legacy")}
                className={`px-4 py-2 rounded ${
                  authMode === "legacy"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Legacy (identify)
              </button>
              <button
                onClick={() => setAuthMode("token")}
                className={`px-4 py-2 rounded ${
                  authMode === "token"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Token-Based (New)
              </button>
            </div>
          </div>

          {/* Legacy Mode */}
          {authMode === "legacy" && (
            <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h2 className="text-2xl font-semibold text-yellow-900 mb-4">
                Legacy Authorization (Backward Compatible)
              </h2>
              <p className="text-gray-700 mb-4">
                The authorize function maintains backward compatibility. When called with
                a user ID and details object, it automatically calls identify() internally.
              </p>
              <div className="bg-white p-4 rounded border border-yellow-300 mb-4">
                <pre className="text-sm overflow-x-auto">
{`Village.authorize('user123', {
  email: 'user@example.com',
  name: 'Demo User'
});

// This is equivalent to:
Village.identify('user123', {
  email: 'user@example.com',
  name: 'Demo User'
});`}
                </pre>
              </div>
              <Button
                onClick={handleLegacyAuth}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Authorize (Legacy Mode)
              </Button>
            </div>
          )}

          {/* Token Mode */}
          {authMode === "token" && (
            <div className="space-y-6">
              {/* Token Configuration */}
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h2 className="text-2xl font-semibold text-green-900 mb-4">
                  Token-Based Authorization
                </h2>
                <p className="text-gray-700 mb-4">
                  New secure authorization using JWT tokens from your backend.
                </p>

                {/* Token Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    JWT Token
                  </label>
                  <textarea
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg font-mono text-xs"
                    rows={4}
                    placeholder="Enter your JWT token..."
                  />
                  <button
                    onClick={() => setToken(generateMockToken())}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Generate new mock token
                  </button>
                </div>

                {/* Domain Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain (Optional - for secure mode)
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., yourdomain.com"
                  />
                </div>

                {/* Refresh Toggle */}
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={refreshEnabled}
                      onChange={(e) => setRefreshEnabled(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Enable auto-refresh (provide refresh callback)
                    </span>
                  </label>
                </div>

                <Button
                  onClick={handleTokenAuth}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Authorize with Token
                </Button>
              </div>

              {/* Code Examples */}
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">
                  Implementation Examples
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Simple Token Auth:</h4>
                    <pre className="bg-white p-3 rounded border border-blue-300 text-sm overflow-x-auto">
{`const token = await fetchTokenFromBackend();
const result = await Village.authorize(token);

if (result.ok) {
  console.log('User authorized!');
}`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">With Domain Validation:</h4>
                    <pre className="bg-white p-3 rounded border border-blue-300 text-sm overflow-x-auto">
{`const result = await Village.authorize(
  token,
  'yourdomain.com'
);

console.log('Authorized for:', result.domain);`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">With Auto-Refresh:</h4>
                    <pre className="bg-white p-3 rounded border border-blue-300 text-sm overflow-x-auto">
{`async function refreshToken() {
  const response = await fetch('/api/refresh');
  const data = await response.json();
  return data.token;
}

Village.authorize(token, domain, refreshToken);`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-900 mb-4">
                  How Token Detection Works
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">1.</span>
                    <span>The function checks if the first parameter is a token (string &gt; 20 chars with . or _)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">2.</span>
                    <span>If not a token, it falls back to legacy mode (calls identify)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">3.</span>
                    <span>For tokens, it validates with your backend and stores in secure storage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">4.</span>
                    <span>Optional refresh callback auto-refreshes expired tokens</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">5.</span>
                    <span>Returns Promise with status: {`{ ok: boolean, status: string, reason?: string }`}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Status Display */}
          {authStatus && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Authorization Status:</h3>
              <p className="font-mono text-sm">{authStatus}</p>
            </div>
          )}

          {/* Test Widgets */}
          <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Test Authorization with Widgets
            </h2>
            <p className="text-gray-600 mb-4">
              After authorizing, these widgets will work with your authenticated session:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                village-module="sync"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sync Network
              </Button>
              <button
                village-data-url="https://www.linkedin.com/company/google/"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
              >
                Find Intro to Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}