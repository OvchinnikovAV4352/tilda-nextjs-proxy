export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Простой тест
    return res.status(200).json({ 
      success: true, 
      message: 'Next.js API is working!' 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
}
