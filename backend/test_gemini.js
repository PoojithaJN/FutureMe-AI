const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);

async function run() {
  console.log('Testing gemini-2.5-flash...');
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });
    const result = await model.generateContent("Give a JSON response matching: { \"hello\": \"world\" }");
    const response = await result.response;
    console.log('✅ SUCCESS! Response:', response.text().trim());
  } catch (err) {
    console.error('❌ FAILED:', err.message);
  }
}

run();
