// Gemini API Configuration
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Debug log (remove this after confirming it works)
console.log('API Key loaded:', GEMINI_API_KEY ? 'Yes' : 'No');

// Validate API key
if (!GEMINI_API_KEY) {
  console.error('Gemini API key is not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file');
}

// Gemini API endpoint for gemini-2.0-flash model
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Function to generate chart recommendations using Gemini
export const generateChartRecommendations = async (data, xAxis, yAxis) => {
  if (!GEMINI_API_KEY) {
    throw new Error('API key not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a data visualization expert. Analyze this data and recommend the best chart types for visualization:

Data Sample:
${JSON.stringify(data.slice(0, 5))}

X-Axis: ${xAxis}
Y-Axis: ${yAxis}

Please provide recommendations in the following format:
1. Chart Type: [type]
   Reason: [explanation]
   Best for: [use case]

Consider these factors:
- Data types (numeric vs categorical)
- Number of data points
- Relationships between variables
- Purpose of visualization
- Data distribution and patterns

Provide 3-4 most suitable chart types with detailed explanations. Focus on clarity and effectiveness of visualization.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate recommendations');
    }

    const result = await response.json();
    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return `Sorry, I encountered an error: ${error.message}. Please try again.`;
  }
}; 