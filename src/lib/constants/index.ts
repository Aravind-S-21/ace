import { NavItem } from '@/types';

// Public navigation items
export const publicNavItems: NavItem[] = [
  { label: 'Explore', href: '/explore' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'AI Intelligence', href: '/#ai-intelligence' },
];

// Student sidebar navigation items
export const studentNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/student', icon: 'dashboard' },
  { label: 'Recommendations', href: '/student/recommendations', icon: 'recommend', badge: '8' },
  { label: 'AI Search', href: '/student/search', icon: 'search' },
  {
    label: 'Categories',
    href: '#',
    icon: 'category',
    children: [
      { label: 'Hackathons', href: '/student/hackathons', icon: 'hackathon' },
      { label: 'Internships', href: '/student/internships', icon: 'internship' },
      { label: 'Workshops', href: '/student/workshops', icon: 'workshop' },
      { label: 'Projects', href: '/student/projects', icon: 'project' },
    ],
  },
  { label: 'Activities', href: '/student/activities', icon: 'activity' },
  { label: 'Skills', href: '/student/skills', icon: 'skill' },
  { label: 'GitHub', href: '/student/github', icon: 'github' },
  { label: 'Profile', href: '/student/profile', icon: 'profile' },
];

// Organizer sidebar navigation items
export const organizerNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/organizer', icon: 'dashboard' },
  { label: 'Events', href: '/organizer/events', icon: 'events' },
  { label: 'Create Event', href: '/organizer/events/create', icon: 'create' },
  { label: 'Analytics', href: '/organizer/analytics', icon: 'analytics' },
  { label: 'AI Assistant', href: '/organizer/ai-assistant', icon: 'ai' },
];

// Site-wide constants
export const SITE_NAME = 'AllCollegeEvent';
export const SITE_TAGLINE = 'AI Event Intelligence Platform';
export const SITE_DESCRIPTION =
  'AI-powered discovery that connects your skills, interests, career goals and location with the right student opportunities.';
