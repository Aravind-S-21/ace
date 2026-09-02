import { ScoringEngine } from '../src/ranking/ranking.engine';
import { RankingConfigService } from '../src/config/rankingConfig';

describe('Deterministic Recommendation Ranking Engine Test Suite', () => {
  const mockStudent = {
    id: 'student-123',
    fullName: 'Aarav Sharma',
    branch: 'Computer Science',
    yearOfStudy: 3,
    location: 'Bengaluru, India',
    careerGoal: 'AI Research Engineer',
    skills: [
      { skill: { name: 'Python' } },
      { skill: { name: 'PyTorch' } },
      { skill: { name: 'TypeScript' } },
    ],
    interests: [
      { interest: { name: 'Generative AI' } },
      { interest: { name: 'Machine Learning' } },
    ],
  };

  const mockAIEvent = {
    id: 'event-ai-1',
    title: 'HackGURU AI Hackathon 2026',
    category: 'AI & ML',
    eligibility: 'All Engineering Students',
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow'],
    location: 'Bengaluru / Online',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    registrationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    intelligence: {
      domains: ['Artificial Intelligence', 'Generative AI'],
      skills: ['Python', 'PyTorch'],
      targetAudience: ['Undergraduate Students'],
      difficulty: 'INTERMEDIATE',
      careerPaths: ['AI Research Engineer', 'Data Scientist'],
    },
  };

  const mockUnrelatedEvent = {
    id: 'event-bio-2',
    title: 'BioTech Lab Seminar',
    category: 'Biology',
    eligibility: 'Medical Undergraduates Only',
    requiredSkills: ['Chemistry', 'Microbiology'],
    location: 'Kolkata, India',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    registrationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    intelligence: {
      domains: ['Biology', 'Medicine'],
      skills: ['Chemistry'],
      careerPaths: ['Microbiologist'],
    },
  };

  it('should rank AI event significantly higher than unrelated biology event', () => {
    const scoreAI = ScoringEngine.calculateScore(mockStudent, mockAIEvent);
    const scoreBio = ScoringEngine.calculateScore(mockStudent, mockUnrelatedEvent);

    expect(scoreAI.totalScore).toBeGreaterThan(scoreBio.totalScore);
    expect(scoreAI.matchingSignals.length).toBeGreaterThan(0);
    expect(scoreAI.breakdown.skillScore).toBeGreaterThanOrEqual(0.4);
  });

  it('should dynamically update weights via RankingConfigService without code changes', () => {
    const defaultConfig = RankingConfigService.getConfig();
    expect(defaultConfig.weights.skillOverlap).toBe(0.25);

    RankingConfigService.updateWeights({ skillOverlap: 0.50, branchMatch: 0.05 });
    const updatedConfig = RankingConfigService.getConfig();

    expect(updatedConfig.weights.skillOverlap).toBe(0.50);
    expect(updatedConfig.weights.branchMatch).toBe(0.05);

    // Reset back to default
    RankingConfigService.resetToDefault();
  });
});
