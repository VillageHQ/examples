import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Head from "next/head";

interface Person {
  id: number;
  name: string;
  linkedinUrl: string;
}

const people: Person[] = [
  {
    id: 1,
    name: "Ziad Ibrahim",
    linkedinUrl: "https://www.linkedin.com/in/ziad-ibrahim-12391279/",
  },
  {
    id: 2,
    name: "4dx ventures",
    linkedinUrl: "https://www.linkedin.com/company/4dx-ventures/",
  },
  {
    id: 3,
    name: "rafaelmuttoni", 
    linkedinUrl: "https://www.linkedin.com/in/rafaelmuttoni/",
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

export default function ImportableDemo() {
  const [isVillageLoaded, setIsVillageLoaded] = useState(false);
  const [authStatus, setAuthStatus] = useState<'loading' | 'authorized' | 'failed'>('loading');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    let isMounted = true;

    const initializeVillage = async () => {
      try {
        addLog('🚀 Loading Village SDK as importable module...');
        addLog('💡 Note: Script tag version disabled on this page to avoid conflicts');
        
        // Clear any existing Village instance to avoid conflicts
        if ((window as any).Village) {
          addLog('🧹 Clearing existing Village instance...');
          delete (window as any).Village;
        }
        
        // Dynamically import the Village SDK
        const VillageModule = await import('../public/village-sdk.mjs');
        const Village = VillageModule.default;
        
        // Make it available globally for compatibility with existing HTML attributes
        (window as any).Village = Village;
        
        addLog('✅ Village SDK loaded successfully');
        addLog(`📋 window.Village: ${typeof (window as any).Village}`);
        addLog(`📋 window.Village.init: ${typeof (window as any).Village?.init}`);
        addLog(`📋 window.Village.authorize: ${typeof (window as any).Village?.authorize}`);
        setIsVillageLoaded(true);

        // Create a refresh callback function (optional - only if token expires)
        async function refreshVillageToken() {
          try {
            addLog('🔄 Token expired, refreshing...');
            const response = await fetch('/api/refresh-village-token', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) {
              throw new Error('Failed to refresh token');
            }

            const data = await response.json();
            addLog('✅ Token refreshed successfully');
            return data.token;
          } catch (error) {
            addLog(`❌ Token refresh failed: ${error}`);
            return null;
          }
        }

        // Initialize Village with the public key
        addLog('🔧 Initializing Village with public key...');
        addLog(`📋 Village object: ${typeof Village}`);
        addLog(`📋 Village.init: ${typeof Village.init}`);
        addLog(`📋 Village.authorize: ${typeof Village.authorize}`);
        
        // Use a working public key for the demo
        const publicKey = 'pk_SMhdS08sJc8UIIxDJbeN7lEeFekDcK9'; // Working demo key from the token
        addLog(`🔑 Using public key: ${publicKey}`);
        Village.init(publicKey);
        addLog('✅ Village.init() called successfully');
        
        // Wait a moment for Village to fully initialize
        addLog('⏳ Waiting for Village to fully initialize...');
        await new Promise(resolve => setTimeout(resolve, 500)); // Increase wait time

        // Get initial token and authorize
        addLog('🔑 Getting authorization token from /api/auth...');
        const response = await fetch("/api/auth");
        const data = await response.json();
        
        addLog(`📋 /api/auth response: ${JSON.stringify(data)}`);
        
        if (data.token && isMounted) {
          addLog('✅ Valid token received from /api/auth - authorization should work!');
          addLog(`🔍 Token preview: ${data.token.substring(0, 50)}...`);
          
          // Since /api/auth returned a token, authorization should be correct
          addLog('🔐 Authorizing user (token is valid from /api/auth)...');
          
          const result = await (window as any).Village.authorize(data.token);
          addLog(`📋 Village.authorize result: ${JSON.stringify(result)}`);

          if (result && result.ok) {
            addLog('✅ Authorization successful! Token from /api/auth was correct!');
            setAuthStatus('authorized');
            
            // Set up event listeners
            Village.on(Village.VillageEvents.pathCtaClicked, (data: any) => {
              addLog(`🔗 Path CTA clicked: ${JSON.stringify(data)}`);
            });

            Village.on(Village.VillageEvents.syncCompleted, () => {
              addLog('🔄 Network sync completed');
            });

          } else {
            addLog(`❌ Unexpected: Authorization failed despite valid token from /api/auth`);
            addLog(`📋 Failure reason: ${result?.reason || 'No reason provided'}`);
            addLog(`📋 Full result: ${JSON.stringify(result)}`);
            setAuthStatus('failed');
          }
        } else {
          addLog('❌ No token in /api/auth response');
          addLog(`📋 Full response: ${JSON.stringify(data)}`);
          setAuthStatus('failed');
        }
      } catch (error) {
        addLog(`❌ Failed to initialize Village: ${error}`);
        setAuthStatus('failed');
      }
    };

    initializeVillage();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTestFunction = async () => {
    try {
      const Village = (window as any).Village;
      if (Village) {
        addLog('🧪 Testing Village.identify() function...');
        Village.identify('156');
        addLog('✅ Village.identify() called successfully');
      }
    } catch (error) {
      addLog(`❌ Test function failed: ${error}`);
    }
  };

  return (
    <>
      <Head>
        <title>Village SDK - Importable Module Demo</title>
        <meta
          name="description"
          content="Demo showing Village SDK loaded as an importable ES module"
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
              🎉 NEW: Importable Module
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Village SDK - Importable Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This page demonstrates the Village SDK loaded as an <strong>importable ES module</strong> instead of a script tag.
              Perfect for browser extensions, modern bundlers, and CSP-restricted environments.
            </p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-2xl mx-auto">
              <p className="text-sm text-blue-800">
                💡 <strong>Clean Environment:</strong> Script tag version disabled on this page to demonstrate pure ES module import
              </p>
            </div>
          </div>

          {/* Setup Required Alert */}
          {authStatus === 'failed' && (
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-xl text-red-800 flex items-center gap-2">
                  ⚠️ Setup Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-red-700">
                    Authorization failed. Please set up your Village credentials:
                  </p>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <p className="text-sm font-mono text-red-800">
                      Create <code>.env.local</code> with your real Village credentials:
                    </p>
                    <pre className="text-xs mt-2 text-red-700">
{`NEXT_PUBLIC_VILLAGE_PUBLIC_KEY=pk_your_actual_public_key
NEXT_PUBLIC_VILLAGE_SCRIPT_URL=https://js.village.do
VILLAGE_API_URL=https://api.village.do
VILLAGE_SECRET_KEY=sk_your_actual_secret_key`}
                    </pre>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Get your keys from:</strong> <a href="https://village.do/dashboard" className="underline">Village Dashboard</a>
                    </p>
                  </div>
                  <p className="text-sm text-red-600">
                    ✅ <strong>Good news:</strong> The SDK import works perfectly - just need real credentials!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  📦 SDK Status
                  <Badge variant={isVillageLoaded ? "default" : "secondary"}>
                    {isVillageLoaded ? "Loaded" : "Loading"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {isVillageLoaded 
                    ? "Village SDK imported and initialized" 
                    : "Loading Village SDK module..."
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  🔐 Auth Status
                  <Badge variant={
                    authStatus === 'authorized' ? "default" : 
                    authStatus === 'failed' ? "destructive" : "secondary"
                  }>
                    {authStatus === 'authorized' ? "Authorized" : 
                     authStatus === 'failed' ? "Failed" : "Loading"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {authStatus === 'authorized' 
                    ? "User successfully authorized with Village" 
                    : authStatus === 'failed'
                    ? "Authorization failed - check console"
                    : "Authorizing user..."
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  🎯 Method
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    ES Import
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Using <code className="bg-gray-100 px-1 rounded">import()</code> instead of script tags
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Code Comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">🆚 Implementation Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-3">❌ Old Way (Script Tag)</h3>
                  <pre className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm overflow-x-auto">
{`<Script id="village-script">
  {\`(function(){
    var w=window;var d=document;
    // Inline widget loader code...
  })();
  Village.init('demo_pk_global');\`}
</Script>`}
                  </pre>
                  <div className="mt-3 text-sm text-red-600">
                    <p>• CSP restrictions</p>
                    <p>• Extension compatibility issues</p>
                    <p>• Remote code loading</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-3">✅ New Way (ES Import)</h3>
                  <pre className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm overflow-x-auto">
{`// Import as ES module
const VillageModule = await import('/village-sdk.mjs');
const Village = VillageModule.default;

// Use exactly the same API!
Village.init('demo_pk_global');
Village.authorize(token);`}
                  </pre>
                  <div className="mt-3 text-sm text-green-600">
                    <p>• No CSP issues</p>
                    <p>• Extension friendly</p>
                    <p>• Bundled locally</p>
                    <p>• Same API!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demo - Show even if auth failed to demonstrate SDK import works */}
          {isVillageLoaded && (
            <div className="space-y-8">
              {/* Test API Functions */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">🧪 Test Village Functions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      onClick={handleTestFunction}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Test Village.identify()
                    </Button>
                    <p className="text-sm text-gray-600">
                      Click to test that imported Village functions work correctly
                    </p>
                    {authStatus !== 'authorized' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-amber-800 text-sm">
                          ⚠️ <strong>Note:</strong> Some widgets may not work fully without proper authorization, 
                          but the SDK import and basic functions still work!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Sync Network Widget */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">
                    1. 🔄 Sync Network Widget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 mb-4">
                    Sync your network to unlock more connection opportunities.
                  </p>
                  <Button
                    village-module="sync"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sync Network
                  </Button>
                </CardContent>
              </Card>

              {/* Search Widget */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-green-900">
                    2. 🔍 Search Widget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 mb-4">
                    Embedded network search experience - all running from imported module!
                  </p>
                  <div
                    village-module="search"
                    className="w-full border border-green-300 rounded-md bg-white"
                    style={{ height: "440px" }}
                  >
                    {/* Village will populate this container */}
                  </div>
                </CardContent>
              </Card>

              {/* Find Intro Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-orange-900">
                    3. 🤝 Find Intro Buttons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700 mb-4">
                    Get introductions using imported Village module - same HTML attributes work!
                  </p>
                  <div className="space-y-4">
                    {people.map((person) => (
                      <div key={person.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200">
                        <div className="text-lg font-medium text-gray-900">
                          {person.name}
                        </div>
                        <button
                          village-data-url={person.linkedinUrl}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
                            Loading...
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Browse Paths Widget */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-900">
                    4. 🛤️ Browse Paths Widget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 mb-4">
                    Browse connection paths to companies - powered by imported module!
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {sampleCompanies.map((company) => (
                      <div
                        key={company.name}
                        className="border border-purple-300 rounded-md p-4 bg-white cursor-pointer hover:bg-purple-50 transition-colors"
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
                                <span village-paths-data="count"></span> paths
                                available
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
                </CardContent>
              </Card>
            </div>
          )}

          {/* Debug Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">📋 Debug Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <p>Waiting for logs...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">🔧 Technical Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Benefits for Extensions:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✅</span>
                      <strong>No CSP Issues:</strong> Everything bundled locally, no remote script loading
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✅</span>
                      <strong>Firefox Compatible:</strong> No eval() or remote code execution
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✅</span>
                      <strong>Same API:</strong> Exact same functions and HTML attributes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✅</span>
                      <strong>Modern Bundling:</strong> Works with Webpack, Vite, Rollup, etc.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">How It Works:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm">
                      {`// 1. Import the unified SDK
const VillageModule = await import('/village-sdk.mjs');
const Village = VillageModule.default;

// 2. Make it globally available (for HTML attributes)
window.Village = Village;

// 3. Use exactly like before!
Village.init(process.env.NEXT_PUBLIC_VILLAGE_PUBLIC_KEY);

// 4. Simple auth (no refresh needed if token is valid)
Village.authorize(token, domain);

// 5. Only add refresh callback if token might expire
// Village.authorize(token, domain, refreshCallback);`}
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">For Browser Extensions:</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <code className="text-sm">
                      {`// In your content script or popup
import Village from './village-sdk.mjs';

// Initialize and use - no script tags needed!
Village.init('your_public_key');
Village.authorize('user_token');`}
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <div className="space-x-4">
              <Button variant="outline" asChild>
                <a href="/">← Back to Script Tag Demo</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/search">Search Demo →</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
