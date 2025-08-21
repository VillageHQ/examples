import { useEffect } from "react";
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

export default function Home() {
  useEffect(() => {
    let isMounted = true;

    const fetchToken = async () => {
      // Check if already authorized to prevent re-initialization
      if ((window.Village as any)?._isAuthorized) {
        return;
      }

      try {
        const response = await fetch("/api/auth");
        const data = await response.json();
        if (data.token && isMounted) {
          window.Village.authorize(data.token);
          // Mark as authorized to prevent re-initialization
          (window.Village as any)._isAuthorized = true;
        }
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };

    fetchToken();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Head>
        <title>Village Integration Demo</title>
        <meta
          name="description"
          content="Demo app showing all Village SDK embedded UI widgets"
        />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Village SDK Integration Demo
          </h1>

          {/* 1. Village Sync Network Button */}
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              1. Sync Network Widget
            </h2>
            <p className="text-blue-700 mb-4">
              Sync your network to unlock more connection opportunities and get
              better intro suggestions.
            </p>
            <Button
              village-module="sync"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sync Network
            </Button>
          </div>

          {/* 2. Village Search Widget */}
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-green-900 mb-2">
              2. Search Widget
            </h2>
            <p className="text-green-700 mb-4">
              Embed a network search experience directly on your platform.
              Search for people and companies in your network.
            </p>
            <div
              village-module="search"
              className="w-full border border-green-300 rounded-md bg-white"
              style={{ height: "440px" }}
            >
              {/* Village will populate this container with search functionality */}
            </div>
          </div>

          {/* 3. Village Find Intro Buttons */}
          <div className="mb-8 p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-orange-900 mb-2">
              3. Find Intro Buttons
            </h2>
            <p className="text-orange-700 mb-4">
              Get introductions to specific people or companies using their
              LinkedIn profiles.
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
              Click on the cards below to browse connection paths to specific
              companies:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
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
          </div>

          {/* 5. Village Autopilot Widget - WIP */}
          <div className="mb-8 p-6 bg-indigo-50 border border-indigo-200 rounded-lg relative">
            {/* WIP Overlay */}
            <div className="absolute inset-0 bg-gray-900 bg-opacity-60 rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Work in Progress
                </h3>
                <p className="text-white text-lg">
                  Autopilot feature is currently under development
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  Check back soon for AI-powered search capabilities
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-indigo-900 mb-2">
              5. Autopilot Widget (AI-Powered Search & Screening)
            </h2>
            <p className="text-indigo-700 mb-4">
              Use AI to search and screen candidates based on natural language
              queries and custom criteria.
            </p>

            <div className="space-y-4 opacity-50">
              {/* Link to Advanced Demo */}
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                <p className="text-yellow-800 font-semibold mb-2">
                  🚀 Want to try Autopilot now?
                </p>
                <a
                  href="/autopilot-demo"
                  className="inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors font-medium"
                >
                  View Advanced Autopilot Demo →
                </a>
              </div>

              {/* Example 1: Basic Autopilot */}
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  Basic Autopilot
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Click to start autopilot with default settings
                </p>
                <Button
                  disabled
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Start Autopilot
                </Button>
              </div>

              {/* Example 2: Pre-configured Searches */}
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  Pre-configured Searches
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Try these example searches:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled
                    className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                  >
                    Find Engineers
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                  >
                    Find Product Managers
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                  >
                    Find AI Researchers
                  </Button>
                </div>
              </div>

              {/* Example 3: Declarative Autopilot Button */}
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  Declarative Autopilot
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Using HTML attributes for configuration
                </p>
                <button
                  disabled
                  className="px-4 py-2 bg-indigo-600 text-white rounded opacity-50 cursor-not-allowed"
                >
                  Find Marketing Leaders
                </button>
              </div>
            </div>
          </div>

          {/* Additional Village Features */}
          <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Village SDK Features Summary
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Implemented Widgets:
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>
                    ✅ Sync Network - <code>village-module="sync"</code>
                  </li>
                  <li>
                    ✅ Search Experience - <code>village-module="search"</code>
                  </li>
                  <li>
                    ✅ Browse Paths - <code>village-module="paths"</code>
                  </li>
                  <li>
                    ✅ Find Intro Buttons - <code>village-data-url</code>
                  </li>
                  <li>
                    🚧 Autopilot AI Search - <code>Coming Soon</code>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Key Features:
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Network synchronization</li>
                  <li>• People & company search</li>
                  <li>• Connection path discovery</li>
                  <li>• Introduction facilitation</li>
                  <li>• Custom CTAs and branding</li>
                  <li>• AI-powered screening (Coming Soon)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
