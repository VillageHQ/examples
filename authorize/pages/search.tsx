import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Head from "next/head";

export default function Search() {
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
        {/* Navigation Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Village Search Demo</h1>
              <div className="space-x-4">
                <Button variant="outline" asChild>
                  <a href="/">← Script Tag Demo</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/importable-demo">🆕 Importable Demo</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Full Screen Search */}
        <div className="h-[calc(100vh-80px)]" village-module="search" />
      </div>
    </>
  );
}
