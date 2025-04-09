import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession(req);

  const secretKey = process.env.VILLAGE_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({ error: "VILLAGE_SECRET_KEY is not set" });
  }

  try {
    const response = await fetch(
      "https://api.village.do/v1/users/authorization",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "secret-key": secretKey,
          "user-identifier": session.user.id,
        },
        body: JSON.stringify({
          email: session.user.email,
        }),
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
      id: "abc123",
      email: "example-authorization-test@village.do",
      name: "Example Authorization Test",
    },
  });
}
