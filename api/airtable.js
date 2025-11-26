const axios = require('axios');

module.exports = async (request, response) => {
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
    const airtableResponse = await axios.post(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`,
      {
        fields: {
          "Name": name || '',
          "Email": email || '',
          "Phone": phone || '',
          "Message": message || '',
          "Date": new Date().toISOString(),
          "Source": "Tilda Form"
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Успешный ответ
    response.status(200).json({
      success: true,
      message: 'Data saved to Airtable',
      id: airtableResponse.data.id
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    response.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || error.message
    });
  }
};
