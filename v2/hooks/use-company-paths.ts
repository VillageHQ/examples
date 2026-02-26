import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchCompanyPaths,
  type VillageTargetPerson,
} from "@/lib/services/village-api";
import { queryKeyFactory } from "@/lib/constants/query-keys";

interface UseCompanyPathsOptions {
  enabled?: boolean;
}

export function useCompanyPaths(
  domain: string | null,
  options?: UseCompanyPathsOptions,
) {
  const query = useInfiniteQuery({
    queryKey: queryKeyFactory.companyPaths(domain ?? ""),
    queryFn: ({ pageParam }) =>
      fetchCompanyPaths(
        { domain: domain! },
        pageParam ? { cursor: pageParam } : undefined,
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next_page
        ? (lastPage.pagination.cursor ?? undefined)
        : undefined,
    enabled: !!domain && (options?.enabled ?? true),
  });

  const firstPage = query.data?.pages[0];

  const targetPeople: VillageTargetPerson[] =
    query.data?.pages.flatMap((page) => page.target_people) ?? [];

  const totalCount = firstPage?.count ?? 0;
  const company = firstPage?.company;
  const summary = firstPage?.summary;

  return {
    ...query,
    targetPeople,
    totalCount,
    company,
    summary,
    isLoadingMore: query.isFetchingNextPage,
    loadMore: query.fetchNextPage,
  };
}

export type UseCompanyPathsReturn = ReturnType<typeof useCompanyPaths>;
