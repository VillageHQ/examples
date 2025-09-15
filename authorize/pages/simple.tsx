import { useEffect } from "react";
import Head from "next/head";

interface Target {
  id: number;
  name: string;
  linkedinUrl: string;
}

const targets: Target[] = [
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
  {
    id: 4,
    name: "Google",
    linkedinUrl: "https://www.linkedin.com/company/google",
  },
  {
    id: 5,
    name: "Microsoft",
    linkedinUrl: "https://www.linkedin.com/company/microsoft",
  },
];

export default function Home() {
  useEffect(() => {
    window.Village.identify("abc123");
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
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {targets.map((target) => (
              <li key={target.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium text-gray-900">
                    {target.name}
                  </div>
                  <button
                    village-data-url={target.linkedinUrl}
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
    </>
  );
}
