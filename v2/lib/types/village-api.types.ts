// V2 API Response Types
// All responses from Village V2 API use snake_case

// Standard API envelope
export interface VillageApiResponse<T> {
  data: T;
  metadata: {
    request_id: string;
  };
}

// Token response from POST /v2/auth/tokens
export interface VillageTokenResponse {
  token: string;
  expires_in: number;
  expires_at: number;
  token_type: "Bearer";
}

// User response from GET /v2/user/me
export interface VillageUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  is_sync_complete: boolean;
  is_active: boolean;
}

// Profile in paths
export interface VillageProfile {
  first_name: string;
  last_name: string;
  linkedin_url: string;
  headline: string;
}

// Score metadata
export interface VillageScoreMeta {
  title: string;
  description: string;
}

// Path summary
export interface VillagePathSummary {
  score: number | null;
  score_label: string | null;
  description?: string;
}

// Path starter (for intro paths)
export interface VillagePathStarter {
  profile: VillageProfile;
  score: number;
  score_label: string;
  score_description: string;
  score_meta: VillageScoreMeta[];
}

// Path introducer (for intro paths)
export interface VillagePathIntroducer {
  profile: VillageProfile;
  score: number;
  score_label: string;
  score_meta: VillageScoreMeta[];
}

// Direct connection path
export interface VillageDirectPath {
  type: "direct";
  summary: VillagePathSummary;
  score_meta: VillageScoreMeta[];
}

// Introduction path (through someone)
export interface VillageIntroPath {
  type: "intro";
  summary: VillagePathSummary;
  score_meta: VillageScoreMeta[];
  starters: VillagePathStarter[];
  introducer: VillagePathIntroducer;
}

export type VillagePath = VillageDirectPath | VillageIntroPath;

// Target person info
export interface VillageTarget {
  avatar?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  id: string;
  identity_id: string;
  linkedin_identifier?: string;
  linkedin_url?: string;
  title: string | null;
  village_person_url?: string;
}

// Target person with paths
export interface VillageTargetPerson {
  target: VillageTarget;
  paths: VillagePath[];
  summary: VillagePathSummary;
  count: number;
}

// Company info in paths response
export interface VillageCompanyInfo {
  name: string;
  domain: string;
  linkedin_url: string;
  village_url: string;
}

// Response from POST /v2/companies/paths
export interface VillageCompanyPathsResponse {
  company: VillageCompanyInfo;
  summary: VillagePathSummary;
  target_people: VillageTargetPerson[];
  count: number;
}

// Response from POST /v2/companies/paths/check
export interface VillageCompanyCheckResponse {
  has_paths: boolean;
  score: number | null;
  score_label: string | null;
  count: number;
  avatars: string[];
}

// Company identifier options for API calls
export interface CompanyIdentifier {
  domain?: string;
  linkedin_url?: string;
  url?: string;
}

// API Error response (RFC 7807)
export interface VillageApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  trace_id: string;
  errors?: VillageFieldError[];
}

export interface VillageFieldError {
  field: string;
  message: string;
  code: string;
}
