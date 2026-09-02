import { CategoryMeta } from '@/types';

export const mockCategories: CategoryMeta[] = [
  {
    id: 'hackathon',
    label: 'Hackathons',
    description: 'Build innovative solutions in time-bound team challenges.',
    icon: '⚡',
    color: '#6366f1',
    count: 24,
  },
  {
    id: 'internship',
    label: 'Internships',
    description: 'Gain hands-on industry experience with leading companies.',
    icon: '💼',
    color: '#10b981',
    count: 18,
  },
  {
    id: 'workshop',
    label: 'Workshops',
    description: 'Learn new skills through expert-led hands-on sessions.',
    icon: '🛠️',
    color: '#f59e0b',
    count: 32,
  },
  {
    id: 'conference',
    label: 'Conferences',
    description: 'Connect with industry leaders and explore cutting-edge topics.',
    icon: '🎤',
    color: '#3b82f6',
    count: 12,
  },
  {
    id: 'competition',
    label: 'Competitions',
    description: 'Test your skills against the best and win recognition.',
    icon: '🏆',
    color: '#ef4444',
    count: 15,
  },
  {
    id: 'project',
    label: 'Projects',
    description: 'Collaborate on real-world projects with mentorship.',
    icon: '🚀',
    color: '#8b5cf6',
    count: 10,
  },
];
