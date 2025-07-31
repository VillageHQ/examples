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
      <div className="min-h-screen min-w-screen" village-module="search" />
    </>
  );
}
