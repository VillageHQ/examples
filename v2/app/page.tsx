"use client";

import { CompanyTable } from "@/components/company-table/company-table";
import { useAuth } from "@/contexts/auth-context";
import { LoadingScreen } from "@/components/ui/spinner";

export default function Home() {
  const {
    isLoading,
    error,
    mockUser,
    isActiveCustomer,
    hasToken,
    userNeedsSync,
    villageUser,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <LoadingScreen message="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <p className="text-red-600">Error: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
              <span className="text-sm font-bold text-white dark:text-zinc-900">
                V
              </span>
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white">
              Village V2 API Demo
            </span>
          </div>

          {/* Auth status */}
          <div className="flex items-center gap-4">
            {mockUser && (
              <div className="text-right">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {mockUser.name}
                </p>
                <p className="text-xs text-zinc-500">{mockUser.email}</p>
              </div>
            )}
            <AuthStatusBadge
              isActiveCustomer={isActiveCustomer}
              hasToken={hasToken}
              userNeedsSync={userNeedsSync}
              isSyncComplete={villageUser?.is_sync_complete ?? false}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Discover Your Network
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Find connections to people at any company through your network.
          </p>
        </div>

        {/* Status cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatusCard
            title="Subscription"
            value={isActiveCustomer ? "Active" : "Inactive"}
            status={isActiveCustomer ? "success" : "warning"}
          />
          <StatusCard
            title="Village Token"
            value={hasToken ? "Connected" : "Not connected"}
            status={hasToken ? "success" : "neutral"}
          />
          <StatusCard
            title="Network Sync"
            value={
              !hasToken
                ? "N/A"
                : userNeedsSync
                ? "Required"
                : villageUser?.is_sync_complete
                ? "Complete"
                : "In progress"
            }
            status={
              !hasToken
                ? "neutral"
                : userNeedsSync
                ? "warning"
                : villageUser?.is_sync_complete
                ? "success"
                : "neutral"
            }
          />
        </div>

        {/* Company table */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            Companies
          </h2>
          <CompanyTable />
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-lg bg-zinc-100 p-6 dark:bg-zinc-800/50">
          <h3 className="font-medium text-zinc-900 dark:text-white">
            How it works
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Active customers</strong>: Click "Find paths" to see your
              connections at each company.
            </li>
            <li>
              <strong>New users</strong>: You'll be prompted to sync your
              network first via the Village widget.
            </li>
            <li>
              <strong>Non-customers</strong>: You'll see an upsell modal
              prompting you to upgrade.
            </li>
          </ul>
          <p className="mt-4 text-xs text-zinc-500">
            Toggle <code>isActiveCustomer</code> in{" "}
            <code>app/api/auth/mock/route.ts</code> to test different flows.
          </p>
        </div>
      </main>
    </div>
  );
}

// Auth status badge
function AuthStatusBadge({
  isActiveCustomer,
  hasToken,
  userNeedsSync,
  isSyncComplete,
}: {
  isActiveCustomer: boolean;
  hasToken: boolean;
  userNeedsSync: boolean;
  isSyncComplete: boolean;
}) {
  if (!isActiveCustomer) {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
        Free tier
      </span>
    );
  }

  if (!hasToken) {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
        Not connected
      </span>
    );
  }

  if (userNeedsSync) {
    return (
      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
        Sync required
      </span>
    );
  }

  if (!isSyncComplete) {
    return (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
        Syncing...
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
      Connected
    </span>
  );
}

// Status card component
function StatusCard({
  title,
  value,
  status,
}: {
  title: string;
  value: string;
  status: "success" | "warning" | "neutral";
}) {
  const statusColors = {
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    neutral: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
      <div className="mt-1 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[status]}`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
