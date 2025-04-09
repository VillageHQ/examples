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
          content="Demo app showing Village integration"
        />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            People Directory
          </h1>
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
                      className="get-intro-btn"
                    >
                      Get Intro
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
