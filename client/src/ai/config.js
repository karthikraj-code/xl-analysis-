import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI model
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_AI_KEY);

// Get the model
export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Helper function to generate insights
export async function generateInsights(data) {
  try {
    const prompt = `You are an AI assistant specialized in analyzing data and generating key insights.
    Given the following data, please provide a summary of key trends and anomalies.
    Data: ${JSON.stringify(data)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating insights:', error);
    throw new Error('Failed to generate insights');
  }
} 