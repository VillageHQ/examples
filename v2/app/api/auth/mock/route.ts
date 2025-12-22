import { NextResponse } from "next/server";
import type { MockAuthResponse, MockUser } from "@/lib/types/auth.types";
import type {
  VillageApiResponse,
  VillageTokenResponse,
} from "@/lib/services/village-api";

const VILLAGE_API_URL = process.env.VILLAGE_API_URL ?? "https://api.village.do";
const VILLAGE_SECRET_KEY = process.env.VILLAGE_SECRET_KEY;

// Mock user data - In production, this comes from your authentication system
// Toggle isActiveCustomer to test different flows
const MOCK_USER: MockUser = {
  id: "demo-user-123",
  email: "demo@example.com",
  name: "Demo User",
  isActiveCustomer: true, // Set to false to test upsell flow
};

export async function POST(): Promise<
  NextResponse<MockAuthResponse | { error: string }>
> {
  // Simulate your auth system returning user data
  const mockUser = MOCK_USER;

  // If not an active customer, return without Village token
  // This demonstrates conditional token generation based on subscription status
  if (!mockUser.isActiveCustomer) {
    return NextResponse.json({
      user: mockUser,
      villageToken: null,
      expiresAt: null,
    });
  }

  // For active customers, fetch Village token using server-to-server auth
  if (!VILLAGE_SECRET_KEY) {
    console.error("VILLAGE_SECRET_KEY not configured");
    return NextResponse.json(
      { error: "Server configuration error: VILLAGE_SECRET_KEY not set" },
      { status: 500 }
    );
  }

  try {
    // Call Village's token generation endpoint with secret-key header
    const response = await fetch(`${VILLAGE_API_URL}/v2/auth/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "secret-key": VILLAGE_SECRET_KEY,
      },
      body: JSON.stringify({
        external_user_id: mockUser.id,
        email: mockUser.email,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Village API error:", response.status, errorText);
      return NextResponse.json(
        { error: `Failed to fetch Village token: ${response.status}` },
        { status: response.status }
      );
    }

    const tokenData: VillageApiResponse<VillageTokenResponse> =
      await response.json();

    return NextResponse.json({
      user: mockUser,
      villageToken: tokenData.data.token,
      expiresAt: tokenData.data.expires_at,
    });
  } catch (error) {
    console.error("Error fetching Village token:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching Village token" },
      { status: 500 }
    );
  }
}
