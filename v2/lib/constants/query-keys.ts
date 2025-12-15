// React Query cache keys
// Using enum pattern to avoid magic strings

export const QueryKeys = {
  AUTH: "auth",
  VILLAGE_USER: "village-user",
  COMPANY_PATHS: "company-paths",
  COMPANY_PATHS_CHECK: "company-paths-check",
} as const;

export type QueryKey = (typeof QueryKeys)[keyof typeof QueryKeys];

// Factory functions for parameterized keys
export const queryKeyFactory = {
  auth: () => [QueryKeys.AUTH] as const,
  villageUser: () => [QueryKeys.VILLAGE_USER] as const,
  companyPaths: (domain: string) => [QueryKeys.COMPANY_PATHS, domain] as const,
  companyPathsCheck: (domain: string) =>
    [QueryKeys.COMPANY_PATHS_CHECK, domain] as const,
};
