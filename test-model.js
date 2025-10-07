import { GoogleGenerativeAI } from '@google/generative-ai';
const ai = new GoogleGenerativeAI(process.env.FREE_TIER_GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
const result = await model.generateContent('Say OK');
console.log(result.response.text());
