import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../api';
import { Send, Bot, User, Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Chatbot({ onClose, sector: propSector }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { sector } = useParams();
  const location = useLocation();

  // Domain slug to title map
  const domainMap = {
    'health': 'Healthcare',
    'education': 'Education',
    'transport': 'Transport',
    'agriculture': 'Agriculture',
    'census': 'Census',
    'finance': 'Finance',
    'all': 'ALL'
  };

  // Parse pathname for domain (e.g. /dashboard/domain/health → 'health')
  const getDomainFromPath = (pathname) => {
    const match = pathname.match(/\/domain\/([^\/]+)/);
    return match ? match[1] : 'all';
  };

  const slug = propSector || sector || getDomainFromPath(location.pathname);
  const displayDomain = domainMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/([A-Z])/g, ' $1');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { type: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMessage]);
    const query = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot/query', { query });
      console.log('Bot response:', response.data);
      const botMessage = {
        type: 'bot',
        content: typeof response.data === 'string' ? response.data : (response.data?.content || JSON.stringify(response.data) || 'Insight generated.'),
        chart: response.data?.chart,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = { type: 'bot', content: 'Sorry, something went wrong. Please try again.', timestamp: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="w-full max-h-[85vh] h-full bg-gradient-to-b from-gray-900 via-gray-900/90 to-black rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="glass p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Bot className="w-10 h-10 text-primary p-2 rounded-2xl bg-white/10" />
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Domain AI Assistant
            </h1>
            <div className="flex items-center gap-2 text-sm text-white/80 bg-black/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Current Domain: <strong>{displayDomain}</strong></span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          aria-label="Close chatbot"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-4 py-20">
            <Bot className="w-20 h-20 opacity-50" />
            <h3 className="text-xl font-semibold">Domain Restricted AI Chatbot</h3>
            <p className="max-w-md">Ask questions about {displayDomain} datasets. I'll provide insights, charts, and analysis from official government data.</p>
            <div className="text-sm opacity-75 space-y-1">
              <p>• State-wise production trends</p>
              <p>• Year-over-year comparisons</p>
              <p>• Dataset summaries & downloads</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-2xl p-6 rounded-3xl shadow-lg ${message.type === 'user' ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm' : 'glass bg-white/30 dark:bg-gray-900/50 text-white rounded-bl-sm border border-white/20'}`}>
                <div className="prose prose-invert max-w-none [&_p]:mb-0">
                  <p>{message.content}</p>
                  {message.chart && (
                    <div className="mt-4 p-4 bg-black/20 rounded-2xl">
                      <p className="text-xs opacity-75 mb-2">📊 Visualization</p>
                      <div className="h-48 bg-gradient-to-br from-white/10 to-transparent rounded-xl animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="text-xs opacity-75 mt-2 flex items-center gap-1">
                  {message.type === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  {message.timestamp}
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass p-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex items-end gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Ask about ${displayDomain} data... (e.g. "Telangana agriculture 2023", "production trends")`}
            className="flex-1 max-h-32 min-h-[44px] p-4 rounded-3xl bg-white/20 dark:bg-gray-900/50 backdrop-blur-sm border border-white/30 focus:border-primary focus:ring-4 focus:ring-primary/20 resize-none text-white placeholder-white/70 transition-all"
            rows="1"
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-3xl shadow-xl hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            )}
          </motion.button>
        </div>
        <div className="text-xs text-white/60 mt-3 text-center">
          Powered by domain data analysis • Secure & accurate insights
        </div>
      </div>
    </motion.div>
  );
}
