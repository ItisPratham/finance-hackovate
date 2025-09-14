import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Send, Bot, User, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { useState } from "react";
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

const sampleConversation: Message[] = [
  {
    id: '1',
    content: "Hi! I'm your AI financial advisor. I can help you understand your spending patterns, suggest savings opportunities, and answer questions about your finances. What would you like to know?",
    sender: 'ai',
    timestamp: new Date(Date.now() - 300000),
    suggestions: [
      "How much did I spend on dining last month?",
      "What's my savings potential?",
      "Show me my biggest expenses"
    ]
  }
];

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>(sampleConversation);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const predefinedResponses: Record<string, string> = {
    'dining': "Based on your transaction history, you spent ₹18,450 on dining last month, which is 18% higher than your average. I notice you ordered food delivery 12 times. Consider meal planning to reduce this expense by ₹5,000-7,000 monthly.",
    'savings': "Great question! Based on your current income and expenses, you have a savings potential of ₹33,000 monthly. You're currently saving ₹28,000 (38.8% rate). To optimize: reduce dining out by ₹5,000 and subscription services by ₹2,000.",
    'expenses': "Your top 3 expense categories are: 1) Rent - ₹25,000 (48%), 2) Groceries - ₹8,500 (16%), 3) Dining - ₹6,200 (12%). Your discretionary spending on entertainment and shopping totals ₹4,800.",
    'default': "I understand you're asking about your finances. Based on your current data permissions, I can see your assets and income patterns. Could you be more specific about what you'd like to know?"
  };

  const getAIResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('dining') || message.includes('food') || message.includes('restaurant')) {
      return {
        content: predefinedResponses.dining,
        suggestions: ["How can I reduce food expenses?", "Show me healthy meal planning tips", "What about last month?"]
      };
    } else if (message.includes('saving') || message.includes('save')) {
      return {
        content: predefinedResponses.savings,
        suggestions: ["How to increase my emergency fund?", "Investment recommendations", "Show my progress this year"]
      };
    } else if (message.includes('expense') || message.includes('spending')) {
      return {
        content: predefinedResponses.expenses,
        suggestions: ["Break down my entertainment spending", "Compare with last year", "Set spending limits"]
      };
    } else {
      return {
        content: predefinedResponses.default,
        suggestions: ["Analyze my spending patterns", "Investment opportunities", "Budget recommendations"]
      };
    }
  };

  // const sendMessage = async () => {
  //   if (!input.trim()) return;

  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     content: input,
  //     sender: 'user',
  //     timestamp: new Date()
  //   };

  //   setMessages(prev => [...prev, userMessage]);
  //   setInput('');
  //   setIsTyping(true);

  //   // Simulate AI thinking time
  //   setTimeout(() => {
  //     const aiResponse = getAIResponse(input);
  //     const aiMessage: Message = {
  //       id: (Date.now() + 1).toString(),
  //       content: aiResponse.content,
  //       sender: 'ai',
  //       timestamp: new Date(),
  //       suggestions: aiResponse.suggestions
  //     };

  //     setMessages(prev => [...prev, aiMessage]);
  //     setIsTyping(false);
  //   }, 1500);
  // };


  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    content: input,
    sender: 'user',
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsTyping(true);

  try {
    const defaultPermissions: Record<string, boolean> = {
      assets: true,
      liabilities: true,
      transactions: false,
      epf: true,
      credit_score: false,
      insurance: true
    };
    let permissions = JSON.parse(localStorage.getItem('permissions') || 'null');

if (!permissions || typeof permissions !== 'object') {
  localStorage.setItem('permissions', JSON.stringify(defaultPermissions));
  permissions = defaultPermissions;
}
const userId = localStorage.getItem("user_id") || "1";
    const response = await axios.post('http://127.0.0.1:5000/query', {
      query: input,
      permissions
    }, {
      headers: {
      'Content-Type': 'application/json',
      "X-User-ID": userId
      }
    });

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response.data?.response || 'No response from server.',
      sender: 'ai',
      timestamp: new Date(),
      suggestions: response.data?.suggestions || []
    };

    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: 'Error communicating with the server.',
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
  } finally {
    setIsTyping(false);
  }
};

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>AI Financial Assistant</h1>
        <p className="text-muted-foreground">Get personalized insights and answers about your finances</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Financial Chat
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.sender === 'ai' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] space-y-2 ${message.sender === 'user' ? 'order-first' : ''}`}>
                    <div className={`p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white ml-auto' 
                        : 'bg-gray-100'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    
                    {message.suggestions && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Lightbulb className="h-3 w-3" />
                          Quick questions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your finances..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
