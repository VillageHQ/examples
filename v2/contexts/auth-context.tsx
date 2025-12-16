"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useSetAtom } from "jotai";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AuthContextValue,
  MockUser,
  MockAuthResponse,
  TokenState,
} from "@/lib/types/auth.types";
import type { VillageUser } from "@/lib/types/village-api.types";
import {
  initializeVillageApi,
  fetchVillageUser,
  VillageApiException,
  resetVillageApi,
} from "@/lib/services/village-api";
import { widgetTokenAtom } from "@/lib/store/widget-atoms";
import { QueryKeys } from "@/lib/constants/query-keys";

const initialTokenState: TokenState = {
  isLoading: true,
  error: null,
  mockUser: null,
  villageToken: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [tokenState, setTokenState] = useState<TokenState>(initialTokenState);
  const setWidgetToken = useSetAtom(widgetTokenAtom);
  const queryClient = useQueryClient();

  // Fetch token from mock auth API
  const fetchToken = useCallback(async () => {
    setTokenState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const authResponse = await fetch("/api/auth/mock", { method: "POST" });
      if (!authResponse.ok) throw new Error("Failed to authenticate");

      const authData: MockAuthResponse = await authResponse.json();

      // If no token (non-active customer), set state without Village data
      if (!authData.villageToken) {
        setTokenState({
          isLoading: false,
          error: null,
          mockUser: authData.user,
          villageToken: null,
        });
        setWidgetToken(null);
        return;
      }

      // Initialize Village API with token
      initializeVillageApi(authData.villageToken);

      setTokenState({
        isLoading: false,
        error: null,
        mockUser: authData.user,
        villageToken: authData.villageToken,
      });
      setWidgetToken(authData.villageToken);
    } catch (error) {
      console.error("Auth error:", error);
      setTokenState({
        isLoading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
        mockUser: null,
        villageToken: null,
      });
      setWidgetToken(null);
    }
  }, [setWidgetToken]);

  // Fetch Village user via React Query (depends on token)
  // This allows queryClient.invalidateQueries() to trigger a refetch
  const villageUserQuery = useQuery<VillageUser | null>({
    queryKey: [QueryKeys.VILLAGE_USER],
    queryFn: async () => {
      try {
        return await fetchVillageUser();
      } catch (error) {
        // 404 means user doesn't exist in Village yet (needs sync)
        if (error instanceof VillageApiException && error.isNotFound) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!tokenState.villageToken,
    retry: false,
  });

  // Fetch token on mount
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Combined loading state
  const isLoading =
    tokenState.isLoading ||
    (!!tokenState.villageToken && villageUserQuery.isLoading);

  // Computed state
  const isActiveCustomer = tokenState.mockUser?.isActiveCustomer ?? false;
  const hasToken = tokenState.villageToken !== null;
  const userNeedsSync = hasToken && villageUserQuery.data === null;

  const contextValue: AuthContextValue = {
    isLoading,
    error: tokenState.error,
    mockUser: tokenState.mockUser,
    villageToken: tokenState.villageToken,
    villageUser: villageUserQuery.data ?? null,
    isActiveCustomer,
    hasToken,
    userNeedsSync,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
