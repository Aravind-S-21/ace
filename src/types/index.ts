// ============================================================
// AllCollegeEvent — Core Type Definitions
// ============================================================

// --- Event Types ---

export type EventCategory =
  | 'hackathon'
  | 'internship'
  | 'workshop'
  | 'conference'
  | 'competition'
  | 'project';

export type EventMode = 'online' | 'offline' | 'hybrid';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  organization: string;
  organizationLogo?: string;
  category: EventCategory;
  description: string;
  shortDescription: string;
  location: string;
  mode: EventMode;
  status: EventStatus;
  startDate: string;
  endDate: string;
  deadline: string;
  skills: string[];
  eligibility: string[];
  requirements: string[];
  benefits: string[];
  timeline?: EventTimelineItem[];
  teamSize?: string;
  prize?: string;
  registrationUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  participantCount?: number;
}

export interface EventTimelineItem {
  date: string;
  title: string;
  description?: string;
}

// --- AI Match Types ---

export interface AIMatch {
  overall: number;
  skillMatch: number;
  interestMatch: number;
  careerFit: number;
  locationFit: number;
  eligibility: number;
  reasoning: string;
  strengths: string[];
}

export interface RecommendedEvent {
  event: Event;
  match: AIMatch;
  category: RecommendationCategory;
}

export type RecommendationCategory =
  | 'top-match'
  | 'recently-relevant'
  | 'skill-building'
  | 'career-aligned';

// --- Student Types ---

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  college: string;
  branch: string;
  year: number;
  location: string;
  bio: string;
  interests: string[];
  skills: string[];
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  profileCompletion: number;
  joinedDate: string;
}

// --- Skill Types ---

export interface Skill {
  id: string;
  name: string;
  proficiency: number; // 0-100
  confidence: number; // 0-100
  category: SkillCategory;
  evidence: SkillEvidence[];
  growth: SkillGrowthEntry[];
  lastActive: string;
}

export type SkillCategory =
  | 'programming'
  | 'data-science'
  | 'web-development'
  | 'design'
  | 'soft-skills'
  | 'tools'
  | 'other';

export interface SkillEvidence {
  type: 'hackathon' | 'project' | 'github' | 'internship' | 'workshop' | 'course';
  title: string;
  date: string;
  impact: string;
}

export interface SkillGrowthEntry {
  date: string;
  proficiency: number;
}

// --- Activity / Journey Types ---

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  category?: EventCategory;
  relatedSkills?: string[];
  icon?: string;
}

export type ActivityType =
  | 'event-joined'
  | 'event-completed'
  | 'project-built'
  | 'skill-detected'
  | 'profile-updated'
  | 'github-connected'
  | 'recommendation-received'
  | 'achievement';

// --- GitHub Types ---

export interface GitHubProfile {
  username: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  contributions: number;
  topLanguages: GitHubLanguage[];
  detectedSkills: string[];
  repositories: GitHubRepo[];
  recentActivity: GitHubActivity[];
  connected: boolean;
}

export interface GitHubLanguage {
  name: string;
  percentage: number;
  color: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
}

export interface GitHubActivity {
  type: string;
  repo: string;
  date: string;
  message: string;
}

// --- Organizer Types ---

export interface OrganizerProfile {
  id: string;
  name: string;
  organization: string;
  logo?: string;
  email: string;
  eventsCreated: number;
  totalRegistrations: number;
}

export interface OrganizerEvent extends Event {
  views: number;
  clicks: number;
  saves: number;
  registrations: number;
  conversionRate: number;
}

export interface OrganizerAnalytics {
  totalViews: number;
  totalClicks: number;
  totalSaves: number;
  totalRegistrations: number;
  topEvents: OrganizerEvent[];
  audienceInsights: AudienceInsight[];
  aiInsights: string[];
}

export interface AudienceInsight {
  label: string;
  value: number;
  change: number;
}

// --- AI Assistant Types ---

export interface AIAssistantAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'content' | 'audience' | 'quality' | 'promotion';
}

export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  action?: string;
}

// --- Search Types ---

export interface SearchResult {
  event: Event;
  match: AIMatch;
  aiReasoning: string;
}

export interface SearchSuggestion {
  text: string;
  category: string;
}

// --- Navigation Types ---

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  badge?: string;
}

// --- Category Metadata ---

export interface CategoryMeta {
  id: EventCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}
