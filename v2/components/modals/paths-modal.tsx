"use client";

import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import type {
  VillageCompanyPathsResponse,
  VillageTargetPerson,
  VillagePath,
} from "@/lib/services/village-api";

interface PathsModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  isLoading: boolean;
  error: Error | null;
  data: VillageCompanyPathsResponse | undefined;
  onRetry: () => void;
}

export function PathsModal({
  isOpen,
  onClose,
  companyName,
  isLoading,
  error,
  data,
  onRetry,
}: PathsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Connections at ${companyName}`}
      size="xl"
    >
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-zinc-500">
            Finding your connections...
          </p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
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
          <p className="text-zinc-600 dark:text-zinc-400">{error.message}</p>
          <Button onClick={onRetry}>Try again</Button>
        </div>
      )}

      {data && !isLoading && (
        <div className="space-y-6">
          {/* Company summary */}
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {data.company.name}
                </h3>
                <p className="text-sm text-zinc-500">{data.company.domain}</p>
              </div>
              {data.summary.score != null && (
                <div className="text-right">
                  <ScoreBadge
                    score={data.summary.score}
                    label={data.summary.score_label ?? null}
                  />
                </div>
              )}
            </div>
          </div>

          {/* No connections state */}
          {data.count === 0 && (
            <div className="py-8 text-center">
              <p className="text-zinc-500">
                No connections found at this company.
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Try syncing more contacts to expand your network.
              </p>
            </div>
          )}

          {/* Target people list */}
          {data.count > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {data.count} {data.count === 1 ? "person" : "people"} you can
                reach
              </h4>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {data.target_people.map((targetPerson) => (
                  <TargetPersonCard
                    key={targetPerson.target.id}
                    targetPerson={targetPerson}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Village link */}
          {data.company.village_url && (
            <div className="border-t border-zinc-200 pt-4 dark:border-zinc-700">
              <a
                href={data.company.village_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                View full details on Village →
              </a>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

// Score badge component
function ScoreBadge({
  score,
  label,
}: {
  score: number;
  label: string | null;
}) {
  const colorClasses = getScoreColor(score);

  return (
    <div className="flex flex-col items-end">
      <span className={`text-2xl font-bold ${colorClasses.text}`}>{score}</span>
      {label && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function getScoreColor(score: number): {
  text: string;
  bg: string;
} {
  if (score >= 80) {
    return {
      text: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    };
  }
  if (score >= 60) {
    return {
      text: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
    };
  }
  if (score >= 40) {
    return {
      text: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    };
  }
  return {
    text: "text-zinc-600 dark:text-zinc-400",
    bg: "bg-zinc-100 dark:bg-zinc-800",
  };
}

// Target person card
function TargetPersonCard({
  targetPerson,
}: {
  targetPerson: VillageTargetPerson;
}) {
  const { target, paths, summary } = targetPerson;

  return (
    <div className="py-4">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          {target.avatar ? (
            <img
              src={target.avatar}
              alt={target.full_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-medium text-zinc-500">
              {target.first_name[0]}
              {target.last_name[0]}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-zinc-900 dark:text-white truncate">
              {target.full_name}
            </h4>
            {summary.score != null && (
              <span
                className={`text-xs font-medium ${getScoreColor(summary.score).text}`}
              >
                {summary.score_label}
              </span>
            )}
          </div>
          {target.title && (
            <p className="text-sm text-zinc-500 truncate">{target.title}</p>
          )}

          {/* Paths summary */}
          <div className="mt-2 flex flex-wrap gap-2">
            {paths.slice(0, 3).map((path, index) => (
              <PathBadge key={index} path={path} />
            ))}
            {paths.length > 3 && (
              <span className="text-xs text-zinc-400">
                +{paths.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* LinkedIn link */}
        {target.linkedin_url && (
          <a
            href={target.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label={`View ${target.full_name} on LinkedIn`}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

// Path type badge
function PathBadge({ path }: { path: VillagePath }) {
  const isIntro = path.type === "intro";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        isIntro
          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      }`}
    >
      {isIntro ? (
        <>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Intro
        </>
      ) : (
        <>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Direct
        </>
      )}
    </span>
  );
}
