export default async function handler(request, response) {
  // Разрешаем CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message } = request.body;

    // Проверяем обязательные поля
    if (!name || !email) {
      return response.status(400).json({ 
        success: false, 
        error: 'Name and email are required' 
      });
    }

    // Отправляем в Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            "Name": name || '',
            "Email": email || '',
            "Phone": phone || '',
            "Message": message || '',
            "Date": new Date().toISOString(),
            "Source": "Tilda Form"
          }
        })
      }
    );

    const result = await airtableResponse.json();

    if (!airtableResponse.ok) {
      throw new Error(result.error?.message || 'Airtable error');
    }

    // Успешный ответ
    response.status(200).json({
      success: true,
      message: 'Data saved to Airtable',
      id: result.id
    });

  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({
      success: false,
      error: error.message
    });
  }
}
