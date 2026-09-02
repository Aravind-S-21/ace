import { RecommendedEvent } from '@/types';
import { mockEvents } from './events';

export const mockRecommendations: RecommendedEvent[] = [
  {
    event: mockEvents[0], // AI/ML Innovation Hackathon
    match: {
      overall: 94,
      skillMatch: 96,
      interestMatch: 91,
      careerFit: 95,
      locationFit: 92,
      eligibility: 100,
      reasoning:
        'This hackathon is an excellent match. Your Python and Machine Learning skills directly align with the required technologies. Your recent internship at AnalyticsCorp and 2nd place finish at a previous AI hackathon demonstrate strong readiness. The hybrid format in Chennai is convenient for your location.',
      strengths: [
        'Python & ML skills match perfectly',
        'Previous hackathon experience gives you an edge',
        'Located in your city (Chennai)',
        'Aligns with your AI engineering career goal',
      ],
    },
    category: 'top-match',
  },
  {
    event: mockEvents[9], // ML Research Intern at IIT Madras
    match: {
      overall: 92,
      skillMatch: 90,
      interestMatch: 94,
      careerFit: 96,
      locationFit: 100,
      eligibility: 95,
      reasoning:
        'This research internship at IIT Madras is strongly aligned with your career trajectory. Your growing Machine Learning proficiency (84) and recent hackathon performance suggest strong readiness for research work. Being at IIT Madras makes this especially convenient.',
      strengths: [
        'Located at your own college',
        'Strong career alignment for ML engineering',
        'Your ML proficiency is growing steadily',
        'Research experience will strengthen your profile',
      ],
    },
    category: 'top-match',
  },
  {
    event: mockEvents[7], // National Coding Championship
    match: {
      overall: 87,
      skillMatch: 85,
      interestMatch: 82,
      careerFit: 88,
      locationFit: 100,
      eligibility: 100,
      reasoning:
        'Your strong problem-solving skills (88) and competitive programming background make this a natural fit. The online format means no location constraints. Winning can lead to direct job offers.',
      strengths: [
        'Strong problem-solving proficiency',
        '350+ LeetCode problems solved',
        'Online format — no travel needed',
        'Direct job offer opportunity',
      ],
    },
    category: 'career-aligned',
  },
  {
    event: mockEvents[1], // Data Science Internship
    match: {
      overall: 89,
      skillMatch: 92,
      interestMatch: 86,
      careerFit: 91,
      locationFit: 78,
      eligibility: 100,
      reasoning:
        'Your recent internship at AnalyticsCorp demonstrated strong data science capabilities. Your Python and SQL skills exceed the requirements. Bangalore is a short distance from Chennai, and the hands-on ML experience will further strengthen your profile.',
      strengths: [
        'Previous data science internship experience',
        'Python & SQL skills exceed requirements',
        'Builds on your existing data science path',
        'Pre-placement opportunity',
      ],
    },
    category: 'skill-building',
  },
  {
    event: mockEvents[5], // Generative AI Workshop
    match: {
      overall: 86,
      skillMatch: 82,
      interestMatch: 93,
      careerFit: 88,
      locationFit: 72,
      eligibility: 100,
      reasoning:
        'Your interest in AI technologies and strong Python foundation make this workshop highly relevant. Learning Generative AI and the Gemini API will expand your skill set into one of the fastest-growing areas of technology.',
      strengths: [
        'Expands your AI skill set',
        'Strong Python foundation is a prerequisite',
        'Generative AI is in high demand',
        'Hands-on Gemini API experience',
      ],
    },
    category: 'skill-building',
  },
  {
    event: mockEvents[11], // AI for Social Good
    match: {
      overall: 83,
      skillMatch: 86,
      interestMatch: 80,
      careerFit: 82,
      locationFit: 100,
      eligibility: 90,
      reasoning:
        'Your Python and ML skills position you well for this incubator. The remote format is flexible, and the social impact focus could add a meaningful dimension to your portfolio.',
      strengths: [
        'Python & ML skills match project requirements',
        'Remote format — fully flexible',
        'Adds social impact to your portfolio',
        'Seed funding available',
      ],
    },
    category: 'recently-relevant',
  },
  {
    event: mockEvents[4], // Frontend Engineering Intern at Razorpay
    match: {
      overall: 85,
      skillMatch: 88,
      interestMatch: 78,
      careerFit: 84,
      locationFit: 78,
      eligibility: 100,
      reasoning:
        'Your React (88) and TypeScript (82) proficiency matches Razorpay\'s requirements well. This would provide industry-scale frontend experience at one of India\'s top fintech companies.',
      strengths: [
        'Strong React & TypeScript skills',
        'Experience at a top-tier company',
        'Pre-placement offer possibility',
        'Monthly stipend of ₹50,000',
      ],
    },
    category: 'career-aligned',
  },
  {
    event: mockEvents[6], // Open Source Contribution Sprint
    match: {
      overall: 80,
      skillMatch: 84,
      interestMatch: 82,
      careerFit: 76,
      locationFit: 100,
      eligibility: 100,
      reasoning:
        'Your active GitHub presence and interest in open source make this a good match. Contributing to real projects will strengthen your profile and expand your professional network.',
      strengths: [
        'Active GitHub user already',
        'Git proficiency established',
        'Remote & flexible schedule',
        'Builds professional network',
      ],
    },
    category: 'recently-relevant',
  },
];
