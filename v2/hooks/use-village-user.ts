import { useQuery } from "@tanstack/react-query";
import {
  fetchVillageUser,
  isVillageApiInitialized,
  VillageApiException,
} from "@/lib/services/village-api";
import { queryKeyFactory } from "@/lib/constants/query-keys";

export function useVillageUser() {
  return useQuery({
    queryKey: queryKeyFactory.villageUser(),
    queryFn: fetchVillageUser,
    // Only run if API is initialized (has token)
    enabled: isVillageApiInitialized(),
    // Handle 404 as "user not found" state
    retry: (failureCount, error) => {
      if (error instanceof VillageApiException && error.isNotFound) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
