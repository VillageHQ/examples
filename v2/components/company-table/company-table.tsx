"use client";

import { CompanyRow } from "./company-row";
import { SAMPLE_COMPANIES } from "@/lib/constants/companies";

export function CompanyTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
            <th className="px-6 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Company
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Domain
            </th>
            <th className="px-6 py-3 text-right text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {SAMPLE_COMPANIES.map((company) => (
            <CompanyRow key={company.domain} company={company} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
