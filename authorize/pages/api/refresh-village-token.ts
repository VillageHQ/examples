import { NextApiRequest, NextApiResponse } from "next";

const VILLAGE_API_URL = process.env.VILLAGE_API_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession(req);

  if (!session) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const secretKey = process.env.VILLAGE_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({ error: "VILLAGE_SECRET_KEY is not set" });
  }

  try {
    // Call Village API to get a fresh token using GET request
    const response = await fetch(`${VILLAGE_API_URL}/v1/users/authorization`, {
      method: "GET",
      headers: {
        "secret-key": secretKey,
        "user-identifier": session.user.id,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Village API error during refresh:", errorData);
      return res
        .status(response.status)
        .json({ error: "Failed to refresh token from Village API" });
    }

    const data = await response.json();
    return res.status(200).json({ token: data.token });
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(500).json({ error: "Token refresh failed" });
  }
}

function getSession(
  _req: NextApiRequest
): Promise<{ user: { id: string } } | null> {
  // In a real app, this would validate the user's session/JWT
  return Promise.resolve({
    user: {
      id: "156",
    },
  });
}