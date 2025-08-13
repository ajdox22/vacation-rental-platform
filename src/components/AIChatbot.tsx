'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User, HelpCircle } from 'lucide-react'
import { ChatMessage } from '@/types'
import toast from 'react-hot-toast'

interface AIChatbotProps {
  className?: string
}

const FAQ_KNOWLEDGE_BASE = {
  'pricing': {
    question: 'What are your pricing plans?',
    answer: 'We offer several pricing plans: Monthly (25 KM), Quarterly (65 KM), Biannual (110 KM), and Yearly (200 KM). Banner ads cost 100 KM for 2 months.'
  },
  'how to post': {
    question: 'How do I post a listing?',
    answer: 'To post a listing, sign up as a host, choose a pricing plan, and fill out the listing form with photos, description, and pricing details.'
  },
  'renewal': {
    question: 'How do I renew my listing?',
    answer: 'You can renew your listing from your dashboard. You\'ll receive email reminders 5 days before expiration.'
  },
  'payment': {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit cards, bank transfers, and PayPal. All payments are processed securely.'
  },
  'support': {
    question: 'How can I get support?',
    answer: 'You can contact our support team at support@vacationrental.com or use this chat for immediate assistance.'
  }
}

export default function AIChatbot({ className = '' }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! I\'m your AI assistant. How can I help you today? You can ask about pricing, how to post a listing, renewals, or payment methods.',
      is_bot: true,
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findBestMatch = (userMessage: string): string | null => {
    const lowerMessage = userMessage.toLowerCase()
    
    for (const [key, faq] of Object.entries(FAQ_KNOWLEDGE_BASE)) {
      if (lowerMessage.includes(key) || 
          lowerMessage.includes(faq.question.toLowerCase()) ||
          (key === 'pricing' && (lowerMessage.includes('price') || lowerMessage.includes('cost'))) ||
          (key === 'how to post' && (lowerMessage.includes('post') || lowerMessage.includes('create') || lowerMessage.includes('add'))) ||
          (key === 'renewal' && (lowerMessage.includes('renew') || lowerMessage.includes('expire'))) ||
          (key === 'payment' && (lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('transfer'))) ||
          (key === 'support' && (lowerMessage.includes('help') || lowerMessage.includes('contact') || lowerMessage.includes('support')))) {
        return key
      }
    }
    
    return null
  }

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const bestMatch = findBestMatch(userMessage)
    
    if (bestMatch) {
      return FAQ_KNOWLEDGE_BASE[bestMatch as keyof typeof FAQ_KNOWLEDGE_BASE].answer
    }
    
    // If no good match, provide fallback
    return 'I\'m sorry, I couldn\'t find a specific answer to your question. Please contact our support team at support@vacationrental.com for personalized assistance.'
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      message: userMessage,
      is_bot: false,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    try {
      const response = await generateResponse(userMessage)
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response,
        is_bot: true,
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, botMsg])
    } catch (error) {
      console.error('Error generating response:', error)
      toast.error('Failed to get response. Please try again.')
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    'What are your pricing plans?',
    'How do I post a listing?',
    'How do I renew my listing?',
    'What payment methods do you accept?'
  ]

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.is_bot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.is_bot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <div className="flex items-start">
                    {message.is_bot && <Bot className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {!message.is_bot && <User className="w-4 h-4 ml-2 mt-0.5 flex-shrink-0" />}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center">
                    <Bot className="w-4 h-4 mr-2" />
                    <span className="text-sm">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
