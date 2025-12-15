"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type {
  AuthContextValue,
  AuthState,
  MockAuthResponse,
} from "@/lib/types/auth.types";
import type { VillageUser } from "@/lib/types/village-api.types";
import {
  initializeVillageApi,
  fetchVillageUser,
  VillageApiException,
  resetVillageApi,
} from "@/lib/services/village-api";

const initialState: AuthState = {
  isLoading: true,
  error: null,
  mockUser: null,
  villageToken: null,
  villageUser: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);

  // Fetch authentication data
  const fetchAuth = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Step 1: Call mock auth API to get user and token
      const authResponse = await fetch("/api/auth/mock", {
        method: "POST",
      });

      if (!authResponse.ok) {
        throw new Error("Failed to authenticate");
      }

      const authData: MockAuthResponse = await authResponse.json();

      // If no token (non-active customer), set state without Village data
      if (!authData.villageToken) {
        setState({
          isLoading: false,
          error: null,
          mockUser: authData.user,
          villageToken: null,
          villageUser: null,
        });
        return;
      }

      // Step 2: Initialize Village API with token
      initializeVillageApi(authData.villageToken);

      // Step 3: Try to fetch Village user
      let villageUser: VillageUser | null = null;

      try {
        villageUser = await fetchVillageUser();
      } catch (error) {
        // 404 means user doesn't exist in Village yet (needs sync)
        if (error instanceof VillageApiException && error.isNotFound) {
          villageUser = null;
        } else {
          throw error;
        }
      }

      setState({
        isLoading: false,
        error: null,
        mockUser: authData.user,
        villageToken: authData.villageToken,
        villageUser,
      });
    } catch (error) {
      console.error("Auth error:", error);
      setState({
        isLoading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
        mockUser: null,
        villageToken: null,
        villageUser: null,
      });
    }
  }, []);

  // Refresh auth (useful after sync completes)
  const refreshAuth = useCallback(async () => {
    resetVillageApi();
    await fetchAuth();
  }, [fetchAuth]);

  // Fetch auth on mount
  useEffect(() => {
    fetchAuth();
  }, [fetchAuth]);

  // Compute derived state
  const isActiveCustomer = state.mockUser?.isActiveCustomer ?? false;
  const hasToken = state.villageToken !== null;
  const userNeedsSync = hasToken && state.villageUser === null;

  const contextValue: AuthContextValue = {
    ...state,
    isActiveCustomer,
    hasToken,
    userNeedsSync,
    refreshAuth,
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
