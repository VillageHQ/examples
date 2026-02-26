// Village API client using openapi-fetch
// Types are generated from: npm run generate:village-types

import createClient, { type Client } from "openapi-fetch";
import type { paths } from "@/lib/village-api";

const VILLAGE_API_URL =
  process.env.NEXT_PUBLIC_VILLAGE_API_URL ?? "https://api.village.do";

// Re-export response types from generated schema
export type VillageUser = paths["/v2/user/me"]["get"]["responses"]["200"]["content"]["application/json"]["data"];
export type VillageCompanyPathsResponse = paths["/v2/companies/paths"]["post"]["responses"]["200"]["content"]["application/json"]["data"];
export type VillageCompanyCheckResponse = paths["/v2/companies/paths/check"]["post"]["responses"]["200"]["content"]["application/json"]["data"];

// Nested types extracted from VillageCompanyPathsResponse
export type VillageTargetPerson = VillageCompanyPathsResponse["target_people"][number];
export type VillagePath = VillageTargetPerson["paths"][number];
export type VillagePathSummary = VillageTargetPerson["summary"];

// Request body types
export type CompanyIdentifier = paths["/v2/companies/paths"]["post"]["requestBody"]["content"]["application/json"];

// API envelope type (for server-side use)
export type VillageApiResponse<T> = { data: T; metadata: { request_id: string } };
export type VillageTokenResponse = paths["/v2/auth/tokens"]["post"]["responses"]["200"]["content"]["application/json"]["data"];

// Error class for Village API errors
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

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

// Singleton client instance
let villageClient: Client<paths> | null = null;

// Create and configure the openapi-fetch client with auth token
export function initializeVillageApi(token: string): Client<paths> {
  villageClient = createClient<paths>({
    baseUrl: VILLAGE_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return villageClient;
}

// Get the configured client (throws if not initialized)
export function getVillageClient(): Client<paths> {
  if (!villageClient) {
    throw new Error(
      "Village API not initialized. Call initializeVillageApi first."
    );
  }
  return villageClient;
}

// Check if API is initialized
export function isVillageApiInitialized(): boolean {
  return villageClient !== null;
}

// Reset the API client (useful for logout)
export function resetVillageApi(): void {
  villageClient = null;
}

// Helper to handle errors from openapi-fetch responses
function handleError(response: { status: number; error?: unknown }): never {
  const error = response.error as { type?: string; detail?: string; trace_id?: string } | undefined;
  throw new VillageApiException(
    error?.type ?? "unknown_error",
    response.status,
    error?.detail ?? "Unknown error",
    error?.trace_id ?? "unknown"
  );
}

// API Methods

// GET /v2/user/me - Get current user info
export async function fetchVillageUser(): Promise<VillageUser> {
  const client = getVillageClient();
  const { data, error, response } = await client.GET("/v2/user/me");

  if (error || !data) {
    handleError({ status: response.status, error });
  }

  return data.data;
}

// POST /v2/companies/paths - Get full company paths
export async function fetchCompanyPaths(
  identifier: CompanyIdentifier,
  pagination?: { cursor?: string; limit?: number }
): Promise<VillageCompanyPathsResponse> {
  const client = getVillageClient();
  const { data, error, response } = await client.POST("/v2/companies/paths", {
    body: { ...identifier, ...pagination },
  });

  if (error || !data) {
    handleError({ status: response.status, error });
  }

  return data.data;
}

// POST /v2/companies/paths/check - Quick check for paths
export async function checkCompanyPaths(
  identifier: CompanyIdentifier
): Promise<VillageCompanyCheckResponse> {
  const client = getVillageClient();
  const { data, error, response } = await client.POST("/v2/companies/paths/check", {
    body: identifier,
  });

  if (error || !data) {
    handleError({ status: response.status, error });
  }

  return data.data;
}
