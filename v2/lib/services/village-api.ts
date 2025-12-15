import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  VillageApiResponse,
  VillageUser,
  VillageCompanyPathsResponse,
  VillageCompanyCheckResponse,
  VillageApiError,
  CompanyIdentifier,
} from "@/lib/types/village-api.types";

const VILLAGE_API_URL =
  process.env.NEXT_PUBLIC_VILLAGE_API_URL ?? "https://api.village.do";

// Custom error class for Village API errors
export class VillageApiException extends Error {
  constructor(
    public readonly type: string,
    public readonly status: number,
    public readonly detail: string,
    public readonly traceId: string
  ) {
    super(detail);
    this.name = "VillageApiException";
  }

  static fromAxiosError(
    error: AxiosError<{ error: VillageApiError }>
  ): VillageApiException {
    const apiError = error.response?.data?.error;
    if (apiError) {
      return new VillageApiException(
        apiError.type,
        apiError.status,
        apiError.detail,
        apiError.trace_id
      );
    }
    return new VillageApiException(
      "unknown_error",
      error.response?.status ?? 500,
      error.message,
      "unknown"
    );
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

// Singleton axios instance
let villageApiInstance: AxiosInstance | null = null;

// Create and configure the axios instance with auth token
export function initializeVillageApi(token: string): AxiosInstance {
  villageApiInstance = axios.create({
    baseURL: VILLAGE_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Add error interceptor to transform errors
  villageApiInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ error: VillageApiError }>) => {
      throw VillageApiException.fromAxiosError(error);
    }
  );

  return villageApiInstance;
}

// Get the configured instance (throws if not initialized)
export function getVillageApi(): AxiosInstance {
  if (!villageApiInstance) {
    throw new Error(
      "Village API not initialized. Call initializeVillageApi first."
    );
  }
  return villageApiInstance;
}

// Check if API is initialized
export function isVillageApiInitialized(): boolean {
  return villageApiInstance !== null;
}

// Reset the API instance (useful for logout)
export function resetVillageApi(): void {
  villageApiInstance = null;
}

// API Methods

// GET /v2/user/me - Get current user info
export async function fetchVillageUser(): Promise<VillageUser> {
  const api = getVillageApi();
  const response =
    await api.get<VillageApiResponse<VillageUser>>("/v2/user/me");
  return response.data.data;
}

// POST /v2/companies/paths - Get full company paths
export async function fetchCompanyPaths(
  identifier: CompanyIdentifier
): Promise<VillageCompanyPathsResponse> {
  const api = getVillageApi();
  const response = await api.post<
    VillageApiResponse<VillageCompanyPathsResponse>
  >("/v2/companies/paths", identifier);
  return response.data.data;
}

// POST /v2/companies/paths/check - Quick check for paths
export async function checkCompanyPaths(
  identifier: CompanyIdentifier
): Promise<VillageCompanyCheckResponse> {
  const api = getVillageApi();
  const response = await api.post<
    VillageApiResponse<VillageCompanyCheckResponse>
  >("/v2/companies/paths/check", identifier);
  return response.data.data;
}
