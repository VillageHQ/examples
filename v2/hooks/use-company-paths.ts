import { useMutation } from "@tanstack/react-query";
import {
  fetchCompanyPaths,
  VillageApiException,
} from "@/lib/services/village-api";
import type { VillageCompanyPathsResponse } from "@/lib/types/village-api.types";

interface UseCompanyPathsOptions {
  onSuccess?: (data: VillageCompanyPathsResponse) => void;
  onError?: (error: VillageApiException) => void;
}

export function useCompanyPaths(options?: UseCompanyPathsOptions) {
  return useMutation({
    mutationFn: (domain: string) => fetchCompanyPaths({ domain }),
    onSuccess: options?.onSuccess,
    onError: (error) => {
      if (error instanceof VillageApiException) {
        options?.onError?.(error);
      }
    },
  });
}
