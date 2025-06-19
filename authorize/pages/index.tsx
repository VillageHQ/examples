import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Head from "next/head";

declare global {
  interface Window {
    Village: {
      authorize: (token: string) => void;
    };
  }
}

interface Person {
  id: number;
  name: string;
  linkedinUrl: string;
}

const people: Person[] = [
  {
    id: 1,
    name: "Abd Absi",
    linkedinUrl: "https://www.linkedin.com/in/abdabsi/",
  },
  {
    id: 2,
    name: "John Doe",
    linkedinUrl: "https://www.linkedin.com/in/johndoe/",
  },
  {
    id: 3,
    name: "Jane Smith",
    linkedinUrl: "https://www.linkedin.com/in/janesmith/",
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

          {/* Village Sync Network Button */}
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

          {/* Village Search Widget */}
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
              className="w-full h-96 border border-green-300 rounded-md bg-white"
              style={{ minHeight: "400px" }}
            >
              {/* Village will populate this container with search functionality */}
            </div>
          </div>

          {/* Village Browse Paths Widget */}
          <div className="mb-8 p-6 bg-purple-50 border border-purple-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-purple-900 mb-2">
              3. Browse Paths Widget
            </h2>
            <p className="text-purple-700 mb-4">
              Show connection paths to specific companies. Try the examples
              below:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {sampleCompanies.map((company) => (
                <div
                  key={company.name}
                  className="border border-purple-300 rounded-md p-4 bg-white"
                >
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Paths to {company.name}
                  </h3>
                  <div
                    village-module="paths"
                    village-data-url={company.linkedinUrl}
                    className="min-h-[200px]"
                  >
                    <div village-paths-availability="found">
                      {/* Village will auto-populate this with an iframe if paths were found */}
                    </div>
                    <div
                      village-paths-availability="not-found"
                      className="text-center py-8 text-gray-500"
                    >
                      <p>No paths found to {company.name}.</p>
                      <button
                        village-module="sync"
                        className="mt-2 text-purple-600 hover:text-purple-800 underline"
                      >
                        Grow my network →
                      </button>
                    </div>
                    <div
                      village-paths-availability="loading"
                      className="text-center py-8 text-gray-500"
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="mt-2">Loading paths...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Village Find Intro Buttons */}
          <div className="mb-8 p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <h2 className="text-2xl font-semibold text-orange-900 mb-2">
              4. Find Intro Buttons
            </h2>
            <p className="text-orange-700 mb-4">
              Get introductions to specific people using their LinkedIn
              profiles.
            </p>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {people.map((person) => (
                  <li key={person.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-medium text-gray-900">
                        {person.name}
                      </div>
                      <Button
                        variant="outline"
                        village-data-url={person.linkedinUrl}
                        className="get-intro-btn bg-orange-600 text-white hover:bg-orange-700"
                      >
                        Get Intro
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
