import { NextApiRequest, NextApiResponse } from 'next';

const VILLAGE_API_URL = 'https://api.village.do/v1/users/authorization';
const SECRET_KEY = 'sk_DonutsgDrM5KcZl10ZxvU4HGFIn8Zjdx6GJf'; // Replace with actual secret key
const USER_IDENTIFIER = 'user123'; // Replace with actual user identifier

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(VILLAGE_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'secret-key': SECRET_KEY,
        'user-identifier': USER_IDENTIFIER,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Village API error:', errorData);
      return res.status(response.status).json({ error: 'Failed to fetch token from Village API' });
    }

    const data = await response.json();
    return res.status(200).json({ token: data.token });
  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}