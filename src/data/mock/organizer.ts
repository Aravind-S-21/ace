import { OrganizerProfile, OrganizerAnalytics, OrganizerEvent, AIAssistantAction } from '@/types';
import { mockEvents } from './events';

export const mockOrganizerProfile: OrganizerProfile = {
  id: 'org-001',
  name: 'Priya Venkatesh',
  organization: 'FutureTech Labs',
  email: 'priya@futuretech.com',
  eventsCreated: 8,
  totalRegistrations: 2450,
};

const organizerEvents: OrganizerEvent[] = mockEvents.slice(0, 4).map((event, i) => ({
  ...event,
  views: [4200, 2800, 3100, 5600][i],
  clicks: [1850, 1200, 1400, 2300][i],
  saves: [620, 380, 450, 890][i],
  registrations: [480, 120, 250, 850][i],
  conversionRate: [11.4, 4.3, 8.1, 15.2][i],
}));

export const mockOrganizerAnalytics: OrganizerAnalytics = {
  totalViews: 15700,
  totalClicks: 6750,
  totalSaves: 2340,
  totalRegistrations: 1700,
  topEvents: organizerEvents,
  audienceInsights: [
    { label: 'AI/ML Students', value: 42, change: 12 },
    { label: 'Web Development', value: 28, change: 5 },
    { label: 'Data Science', value: 18, change: -3 },
    { label: 'Mobile Development', value: 12, change: 8 },
  ],
  aiInsights: [
    'Your AI/ML Innovation Hackathon receives strong interest from Python and Machine Learning students, but registration conversion drops after viewing the eligibility section. Consider simplifying eligibility requirements.',
    'Events with hybrid mode get 34% more saves than offline-only events. Consider adding online participation options to your upcoming events.',
    'Students from IIT Madras, VIT, and Anna University make up 68% of your event engagement. Consider targeted outreach to these institutions.',
    'Adding team size flexibility (2–6 instead of fixed 4) in similar hackathons has shown 22% higher registration rates across the platform.',
  ],
};

export const mockAIAssistantActions: AIAssistantAction[] = [
  {
    id: 'action-01',
    title: 'Improve Event Description',
    description: 'AI analyzes and suggests improvements for clarity, completeness, and appeal.',
    icon: '✏️',
    category: 'content',
  },
  {
    id: 'action-02',
    title: 'Suggest Relevant Skills',
    description: 'Automatically identify skills that should be listed based on event content.',
    icon: '🎯',
    category: 'content',
  },
  {
    id: 'action-03',
    title: 'Identify Target Audience',
    description: 'AI determines the ideal student segments for your event.',
    icon: '👥',
    category: 'audience',
  },
  {
    id: 'action-04',
    title: 'Check Event Quality',
    description: 'Get an AI quality score and actionable feedback on your event listing.',
    icon: '✅',
    category: 'quality',
  },
  {
    id: 'action-05',
    title: 'Detect Missing Information',
    description: 'Find gaps in your event listing that could reduce student interest.',
    icon: '🔍',
    category: 'quality',
  },
  {
    id: 'action-06',
    title: 'Generate Event Title',
    description: 'Create compelling event titles based on your event description.',
    icon: '💡',
    category: 'content',
  },
  {
    id: 'action-07',
    title: 'Improve Eligibility Description',
    description: 'Make eligibility criteria clear and inclusive.',
    icon: '📋',
    category: 'content',
  },
  {
    id: 'action-08',
    title: 'Generate Promotion Strategy',
    description: 'AI suggests channels, messaging, and timing for event promotion.',
    icon: '📢',
    category: 'promotion',
  },
];
