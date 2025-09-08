import Head from "next/head";
import { useEffect, useState } from "react";

export default function PublicSearchDemo() {
  const [searchCount, setSearchCount] = useState(0);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize Village SDK with public key
    const initializePublicSearch = () => {
      if (typeof window !== "undefined" && window.Village) {
        // Initialize with public landing key
        // Initialize public search widget
        // Note: The actual SDK initialization would happen through
        // the village-module and village-public-key attributes
        // This is placeholder for demonstration purposes
        console.log("Initializing public search with pk_landing_public");

        // In production, the SDK would handle this automatically
        // based on the HTML attributes on the container
        setIsInitialized(true);
      }
    };

    // Wait for SDK to load
    if (window.Village) {
      initializePublicSearch();
    } else {
      // Retry after a short delay if SDK not loaded yet
      const timer = setTimeout(initializePublicSearch, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Public Search Demo - Village SDK</title>
        <meta
          name="description"
          content="Try Village search without signing up. Experience AI-powered people and company search with no authentication required."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a href="/" className="text-gray-600 hover:text-gray-900">
                  ← Back to demos
                </a>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Public Search Demo
                </h1>
              </div>

              {/* Rate Limit Display */}
              <div className="flex items-center space-x-6">
                <div className="text-sm">
                  <span className="text-gray-500">Searches used:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {searchCount}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Remaining:</span>
                  <span
                    className={`ml-2 font-semibold ${
                      rateLimitRemaining > 20
                        ? "text-green-600"
                        : rateLimitRemaining > 10
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {rateLimitRemaining}/100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Try Village Search Without Signing Up
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the power of AI-powered relationship intelligence.
              Search for people and companies in our demo network - no
              authentication required.
            </p>
          </div>

          {/* Info Banner */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-teal-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-teal-800">
                  Public Access Mode
                </h3>
                <div className="mt-2 text-sm text-teal-700">
                  <p>
                    You're using the public search feature with these
                    limitations:
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>100 searches per hour (IP-based rate limiting)</li>
                    <li>Anonymized demo data for privacy</li>
                    <li>Results cached for 5 minutes</li>
                    <li>No export or list features</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Search Widget Container */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                    Public Mode
                  </span>
                  {isInitialized && (
                    <span className="text-sm text-gray-600">
                      CSRF Protected • Rate Limited • Cached
                    </span>
                  )}
                </div>
                {searchCount >= 3 && rateLimitRemaining > 0 && (
                  <a
                    href="https://village.do/signup"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                  >
                    Sign up for unlimited searches →
                  </a>
                )}
              </div>
            </div>

            {/* Village Search Widget */}
            <div
              id="public-search-container"
              village-module="search"
              village-public-key="pk_landing_public"
              className="w-full"
              style={{ height: "600px" }}
            >
              {!isInitialized && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                      Loading search widget...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          {searchCount >= 5 && (
            <div className="mt-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg shadow-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3">
                  Ready for Unlimited Access?
                </h3>
                <p className="text-lg mb-6 opacity-95">
                  Join thousands of professionals using Village to expand their
                  network
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="https://village.do/signup"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Create Free Account
                  </a>
                  <a
                    href="https://village.do/demo"
                    className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-teal-600 transition-colors"
                  >
                    Watch Demo
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-3">
                <svg
                  className="h-6 w-6 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h4 className="ml-2 text-lg font-semibold text-gray-900">
                  Secure by Design
                </h4>
              </div>
              <p className="text-gray-600 text-sm">
                CSRF protection, rate limiting, and IP-based validation ensure
                secure public access
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-3">
                <svg
                  className="h-6 w-6 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <h4 className="ml-2 text-lg font-semibold text-gray-900">
                  Lightning Fast
                </h4>
              </div>
              <p className="text-gray-600 text-sm">
                5-minute result caching and optimized queries deliver instant
                search results
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-3">
                <svg
                  className="h-6 w-6 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <h4 className="ml-2 text-lg font-semibold text-gray-900">
                  Privacy First
                </h4>
              </div>
              <p className="text-gray-600 text-sm">
                All data is anonymized in public mode to protect user privacy
                while showcasing functionality
              </p>
            </div>
          </div>

          {/* Rate Limit Warning */}
          {rateLimitRemaining <= 10 && rateLimitRemaining > 0 && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Running low on searches
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      You have {rateLimitRemaining} searches remaining this
                      hour.
                      <a
                        href="https://village.do/signup"
                        className="ml-1 font-medium underline"
                      >
                        Sign up for unlimited access
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rate Limit Hit */}
          {rateLimitRemaining === 0 && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-red-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-red-800 mb-2">
                  Rate limit reached
                </h3>
                <p className="text-red-700 mb-4">
                  You've used all 100 free searches for this hour. Your limit
                  will reset soon.
                </p>
                <a
                  href="https://village.do/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Sign up for unlimited searches
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
