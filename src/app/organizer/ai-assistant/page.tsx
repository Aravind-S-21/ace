'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockAIAssistantActions } from '@/data/mock/organizer';
import { AIAssistantMessage } from '@/types';

const initialMessages: AIAssistantMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hello! I\'m your AI event assistant. I can help you improve your event listings, identify target audiences, check event quality, and generate promotion strategies. Select an action below or tell me what you need.',
    timestamp: new Date().toISOString(),
  },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<AIAssistantMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionTitle: string) => {
    const userMsg: AIAssistantMessage = {
      id: `msg-${messages.length + 1}`,
      role: 'user',
      content: actionTitle,
      timestamp: new Date().toISOString(),
      action: actionTitle,
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000));

    const responses: Record<string, string> = {
      'Improve Event Description': 'Based on my analysis of your "AI/ML Innovation Hackathon" listing:\n\n✅ Strengths: Clear timeline, specific prizes, well-defined team size.\n\n⚠️ Suggestions:\n1. Add a specific problem statement preview to increase engagement.\n2. Mention the mentorship format (1-on-1 vs group sessions).\n3. Include testimonials from previous participants.\n4. Specify the judging criteria to help students prepare.\n\nThese changes could improve your registration conversion by approximately 18% based on similar events.',
      'Suggest Relevant Skills': 'For your AI/ML Innovation Hackathon, I recommend listing these skills:\n\n🎯 Primary: Python, Machine Learning, TensorFlow, Data Science\n🔧 Secondary: Git, Problem Solving, Team Collaboration, Presentation\n💡 Emerging: Generative AI, Prompt Engineering, LangChain\n\nAdding "Generative AI" and "Prompt Engineering" would attract 23% more applicants based on current skill trends.',
      'Identify Target Audience': 'Ideal audience for your AI/ML Innovation Hackathon:\n\n👥 Primary: 3rd-4th year CS/IT students with Python and ML experience\n📊 Profile: 68% from top-tier engineering colleges, 42% have prior hackathon experience\n📍 Location: Chennai metro area (55%), Other Tamil Nadu (25%), Rest of India (20%)\n\n💡 Recommendation: Consider targeted outreach to IIT Madras, Anna University, and VIT Vellore GDSC chapters.',
      'Check Event Quality': 'Event Quality Score: 82/100\n\n✅ Title clarity: 9/10\n✅ Description completeness: 8/10\n✅ Skills relevance: 9/10\n⚠️ Eligibility clarity: 7/10 — Consider being more specific about accepted branches\n⚠️ Benefits: 7/10 — Add networking opportunity details\n✅ Timeline: 9/10\n⚠️ Missing: Judging criteria, FAQ section',
    };

    const aiMsg: AIAssistantMessage = {
      id: `msg-${messages.length + 2}`,
      role: 'assistant',
      content: responses[actionTitle] || `I've analyzed your request for "${actionTitle}". This feature will provide detailed insights once connected to the AI backend. For now, I can help you with event description improvement, skill suggestions, audience identification, and quality checks.`,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: AIAssistantMessage = {
      id: `msg-${messages.length + 1}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const aiMsg: AIAssistantMessage = {
      id: `msg-${messages.length + 2}`,
      role: 'assistant',
      content: `Thank you for your question. Based on my analysis of your events and audience data, I'd recommend focusing on improving your event descriptions and targeting students with specific skill profiles. Select one of the actions above for detailed AI-powered insights.`,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="p-4 lg:p-6 max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
          </svg>
          <h1 className="text-xl font-bold text-text-primary">AI Event Assistant</h1>
        </div>
        <p className="text-sm text-text-secondary">Get AI-powered insights and suggestions for your events.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Actions sidebar */}
        <div className="lg:col-span-1">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Actions</h3>
          <div className="space-y-2">
            {mockAIAssistantActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleAction(action.title)}
                className="w-full text-left p-3 rounded-lg border border-border bg-white hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{action.icon}</span>
                  <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{action.title}</span>
                </div>
                <p className="text-xs text-text-tertiary leading-relaxed">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-3">
          <Card padding="none" className="flex flex-col h-[600px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-bg-secondary border border-border'
                  }`}>
                    {msg.action && (
                      <Badge size="sm" variant={msg.role === 'user' ? 'default' : 'primary'} className="mb-2">
                        {msg.action}
                      </Badge>
                    )}
                    <p className={`text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user' ? 'text-white' : 'text-text-primary'
                    }`}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-bg-secondary border border-border rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask the AI assistant..."
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <Button size="sm" onClick={handleSend} loading={loading}>Send</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
