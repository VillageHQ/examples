import type { VillageUser } from "./village-api.types";

// Mock user data from your authentication system
export interface MockUser {
  id: string;
  email: string;
  name: string;
  isActiveCustomer: boolean;
}

// Response from POST /api/auth/mock
export interface MockAuthResponse {
  user: MockUser;
  villageToken: string | null;
  expiresAt: number | null;
}

// State for token and mock user (fetched once, rarely changes)
export interface TokenState {
  isLoading: boolean;
  error: Error | null;
  mockUser: MockUser | null;
  villageToken: string | null;
}

// Auth context state
export interface AuthState {
  isLoading: boolean;
  error: Error | null;
  mockUser: MockUser | null;
  villageToken: string | null;
  villageUser: VillageUser | null;
}

// Computed auth properties
export interface AuthComputedState {
  isActiveCustomer: boolean;
  hasToken: boolean;
  userNeedsSync: boolean;
}

// Full auth context value
export interface AuthContextValue extends AuthState, AuthComputedState {}
