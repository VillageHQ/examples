import { useQuery } from "@tanstack/react-query";
import {
  checkCompanyPaths,
  isVillageApiInitialized,
} from "@/lib/services/village-api";
import { queryKeyFactory } from "@/lib/constants/query-keys";

interface UseCompanyPathsCheckOptions {
  enabled?: boolean;
}

export function useCompanyPathsCheck(
  domain: string,
  options?: UseCompanyPathsCheckOptions
) {
  const externalEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: queryKeyFactory.companyPathsCheck(domain),
    queryFn: () => checkCompanyPaths({ domain }),
    enabled: isVillageApiInitialized() && externalEnabled,
  });
}
