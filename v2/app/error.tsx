"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <svg
          className="h-8 w-8 text-red-600 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-zinc-400">Error ID: {error.digest}</p>
        )}
      </div>

      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
