import React, { useState } from 'react';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { generateChartRecommendations } from '../../config/gemini';

const ChartRecommendationBot = ({ xAxis, yAxis, data }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const formatBotResponse = (content) => {
    // Split the content into sections based on numbered recommendations
    const sections = content.split(/\d+\.\s*Chart Type:/);
    
    if (sections.length <= 1) {
      // If no sections found, return the content as is
      return content;
    }

    // Remove the first empty section and process the rest
    return sections.slice(1).map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim());
      const chartType = lines[0].trim();
      const reason = lines.find(line => line.includes('Reason:'))?.replace('Reason:', '').trim() || '';
      const bestFor = lines.find(line => line.includes('Best for:'))?.replace('Best for:', '').trim() || '';

      return (
        <div key={index} className="mb-4 p-3 bg-white rounded-lg border border-orange-100 shadow-sm">
          <h3 className="font-semibold text-orange-600 mb-2">Chart Type: {chartType}</h3>
          {reason && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">Reason: </span>
              <span className="text-gray-600">{reason}</span>
            </div>
          )}
          {bestFor && (
            <div>
              <span className="font-medium text-gray-700">Best for: </span>
              <span className="text-gray-600">{bestFor}</span>
            </div>
          )}
        </div>
      );
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      let botResponse;

      if (inputMessage.toLowerCase().includes('recommend') || 
          inputMessage.toLowerCase().includes('suggest') ||
          inputMessage.toLowerCase().includes('chart type')) {
        
        if (!xAxis || !yAxis || !data) {
          botResponse = {
            type: 'bot',
            content: 'I need more information about your data to make recommendations. Please select both X and Y axes.'
          };
        } else {
          const recommendations = await generateChartRecommendations(data, xAxis, yAxis);
          botResponse = {
            type: 'bot',
            content: recommendations
          };
        }
      } else {
        botResponse = {
          type: 'bot',
          content: 'I can help you choose the best chart type for your data. Try asking "What chart type do you recommend?" or "Can you suggest a chart type?"'
        };
      }

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, I encountered an error while generating recommendations. Please try again.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button with Name */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2 z-50">
        <div className="bg-white px-3 py-1 rounded-full shadow-md border border-orange-200 text-sm font-medium text-gray-700">
          Ask Balie
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center animate-bounce-subtle"
        >
          <FaRobot className="text-2xl" />
        </button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-xl shadow-2xl border border-orange-200 z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-orange-200">
            <div className="flex items-center space-x-2">
              <FaRobot className="text-orange-500 text-xl" />
              <h2 className="text-lg font-semibold text-gray-800">Ask Balie</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  {message.type === 'bot' ? (
                    formatBotResponse(message.content)
                  ) : (
                    message.content.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 text-gray-800 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-orange-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about chart recommendations..."
                className="flex-1 bg-white border border-orange-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-orange-500 text-white rounded-lg px-4 py-2 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }
      `}</style>
    </>
  );
};

export default ChartRecommendationBot; 