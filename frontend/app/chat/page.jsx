"use client";
import { useState, useRef, useEffect } from "react";

// Markdown renderer component
const SafeMarkdownMessage = ({ text }) => {
  const renderFormattedText = (text) => {
    if (!text) return null;

    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Bold text
        return (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      } else {
        // Regular text with line breaks
        return part.split('\n').map((line, lineIndex) => (
          <span key={`${index}-${lineIndex}`}>
            {lineIndex > 0 && <br />}
            {line}
          </span>
        ));
      }
    });
  };

  return (
    <div className="whitespace-pre-line">
      {renderFormattedText(text)}
    </div>
  );
};

export default function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { from: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Sorry, I'm having trouble responding. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Enhanced quick suggestions
  const quickSuggestions = [
    "Room types and prices",
    "Check-in & check-out times",
    "Hotel location & address",
    "Contact information",
    "Restaurant details",
    "Spa & wellness services",
    "Pool facilities",
    "WiFi & business center",
    "Parking information",
    "Pet policies",
    "Nearby attractions",
    "Transportation options",
    "Hotel amenities",
    "Booking information",
    "Special offers"
  ];

  // Function to handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-yellow-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors z-40 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="font-medium">Get Help AI</span>
      </button>

      {/* Popup Modal with Blurred Background */}
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex h-[700px] border border-gray-200">
            
            {/* Left Side - Quick Suggestions */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Questions</h3>
                  <p className="text-xs text-gray-500">Click any question to ask</p>
                </div>
              </div>
              
              {/* Suggestions List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-colors duration-200 shadow-sm"
                    >
                      <span className="text-sm font-medium">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Chat Area */}
            <div className="w-2/3 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">Hotel Assistant</h3>
                  <p className="text-xs text-gray-500">Ask me anything about your stay</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <p className="text-sm">Select a question from the left or type your own</p>
                    <p className="text-xs text-gray-400 mt-1">I can help with rooms, amenities, services, and more</p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md px-3 py-2 rounded-lg text-sm ${
                          msg.from === "user"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {msg.from === "bot" ? (
                          <SafeMarkdownMessage text={msg.text} />
                        ) : (
                          msg.text
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-3">
                <div className="flex space-x-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message or select a question from the left..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}