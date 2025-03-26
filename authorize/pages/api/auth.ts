import { NextApiRequest, NextApiResponse } from "next";

const VILLAGE_SECRET_KEY = "sk_DonutsgDrM5KcZl10ZxvU4HGFIn8Zjdx6GJf"; // Replace with actual secret key

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession(req);

  try {
    const response = await fetch(
      "https://api.village.do/v1/users/authorization",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "secret-key": VILLAGE_SECRET_KEY,
          "user-identifier": session.user.id,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Village API error:", errorData);
      return res
        .status(response.status)
        .json({ error: "Failed to fetch token from Village API" });
    }

    const data = await response.json();
    return res.status(200).json({ token: data.token });
  } catch (error) {
    console.error("API route error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function getSession(
  req: NextApiRequest
): Promise<{ user: { id: string; email: string; name: string } }> {
  return Promise.resolve({
    user: {
      id: "123",
      email: "test@test.com",
      name: "Test User",
    },
  });
}
