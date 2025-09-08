import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Head from "next/head";

export default function Search() {
  useEffect(() => {
    window.Village.identify("abc123");
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
