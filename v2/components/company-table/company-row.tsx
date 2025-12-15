"use client";

import { CompanyTableCta } from "./company-table-cta";
import type { SampleCompany } from "@/lib/constants/companies";

interface CompanyRowProps {
  company: SampleCompany;
}

export function CompanyRow({ company }: CompanyRowProps) {
  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
      {/* Company name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Company icon placeholder */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <span className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
              {company.name[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-zinc-900 dark:text-white">
              {company.name}
            </p>
            <p className="text-sm text-zinc-500">{company.description}</p>
          </div>
        </div>
      </td>

      {/* Domain */}
      <td className="px-6 py-4">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {company.domain}
        </span>
      </td>

      {/* Action */}
      <td className="px-6 py-4 text-right">
        <CompanyTableCta companyName={company.name} domain={company.domain} />
      </td>
    </tr>
  );
}
