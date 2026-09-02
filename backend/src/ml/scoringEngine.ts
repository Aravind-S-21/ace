import { RankingConfigService } from '../config/rankingConfig';
import { CandidateEventScore } from '../types/recommendation.types';

export class ScoringEngine {
  public static calculateScore(student: any, event: any, interactions: any[] = []): CandidateEventScore {
    const config = RankingConfigService.getConfig();
    const weights = config.weights;

    const matchingSignals: string[] = [];
    const missingRequirements: string[] = [];

    const intelligence = event.aiAnalysis || event.intelligence || {};

    // 1. Branch & Academic Alignment
    let branchScore = 0.5; // default moderate
    const branch = student.branch || student.department;
    if (branch) {
      const studentBranchLower = branch.toLowerCase();
      const isTechBranch = studentBranchLower.includes('computer') || studentBranchLower.includes('information') || studentBranchLower.includes('data') || studentBranchLower.includes('ai');
      const isTechEvent = (event.category || '').toLowerCase().includes('ai') || (event.category || '').toLowerCase().includes('web') || (event.category || '').toLowerCase().includes('tech') || (event.category || '').toLowerCase().includes('coding');

      if (isTechBranch && isTechEvent) {
        branchScore = 1.0;
        matchingSignals.push(`Strong academic branch match (${branch}) for ${event.category}`);
      } else if ((event.eligibility || '').toLowerCase().includes(studentBranchLower) || (event.eligibility || '').toLowerCase().includes('all')) {
        branchScore = 0.8;
        matchingSignals.push(`Eligible for ${branch} students`);
      }
    }

    // 2. Skill Overlap Score (Jaccard Similarity / Weighted overlap)
    const studentSkillNames = (student.studentSkills || student.skills || []).map((s: any) => (s.skill?.name || s.skillName || s).toLowerCase() || '').filter(Boolean);
    const eventRequiredSkills = typeof event.requiredSkills === 'string' ? event.requiredSkills.split(',') : (event.requiredSkills || []);
    const eventSkillNames = eventRequiredSkills.concat(intelligence.skills || []).map((s: string) => s.toLowerCase());

    let skillScore = 0;
    if (eventSkillNames.length > 0) {
      const matchedSkills = studentSkillNames.filter((s: string) =>
        eventSkillNames.some((es: string) => es.includes(s) || s.includes(es))
      );
      skillScore = matchedSkills.length / Math.max(1, eventSkillNames.length);
      skillScore = Math.min(1.0, skillScore);

      if (matchedSkills.length > 0) {
        matchingSignals.push(`Matches ${matchedSkills.length} required skill(s): ${matchedSkills.join(', ')}`);
      }

      const missing = eventSkillNames.filter((es: string) =>
        !studentSkillNames.some((s: string) => es.includes(s) || s.includes(es))
      );
      if (missing.length > 0) {
        missingRequirements.push(`Missing skill(s): ${missing.slice(0, 3).join(', ')}`);
      }
    } else {
      skillScore = 0.6; // baseline when skills unlisted
    }

    // 3. Interest Match Score
    const studentInterests = (student.interests || []).map((i: any) => (i.interest?.name || i.name || i).toLowerCase() || '').filter(Boolean);
    const eventDomains = (intelligence.domains || []).concat([event.category || '']).map((d: string) => d.toLowerCase());

    let interestScore = 0;
    if (studentInterests.length > 0 && eventDomains.length > 0) {
      const matchedInterests = studentInterests.filter((interest: string) =>
        eventDomains.some((domain: string) => domain.includes(interest) || interest.includes(domain))
      );
      interestScore = matchedInterests.length / Math.max(1, studentInterests.length);
      interestScore = Math.min(1.0, interestScore);

      if (matchedInterests.length > 0) {
        matchingSignals.push(`Aligned with student interest: ${matchedInterests.join(', ')}`);
      }
    } else {
      interestScore = 0.5;
    }

    // 4. Career Goal Relevance Score
    let careerGoalScore = 0.5;
    if (student.careerGoal) {
      const goalLower = student.careerGoal.toLowerCase();
      const careerPaths = (intelligence.careerPaths || []).map((cp: string) => cp.toLowerCase());
      const isGoalMatch = careerPaths.some((cp: string) => cp.includes(goalLower) || goalLower.includes(cp)) ||
        (event.title || '').toLowerCase().includes(goalLower) ||
        (event.category || '').toLowerCase().includes(goalLower);

      if (isGoalMatch) {
        careerGoalScore = 1.0;
        matchingSignals.push(`Directly advances student career goal: "${student.careerGoal}"`);
      }
    }

    // 5. Location & Eligibility Score
    let locationScore = 0.7;
    const location = event.location || '';
    if (location.toLowerCase().includes('online') || location.toLowerCase().includes('remote')) {
      locationScore = 1.0;
      matchingSignals.push('Flexible online / remote participation');
    } else if (student.location && location.toLowerCase().includes(student.location.toLowerCase())) {
      locationScore = 1.0;
      matchingSignals.push(`Located in student region (${student.location})`);
    }

    // 6. Interaction History Penalty / Boost
    let interactionScore = 0.5;
    const eventInteractions = interactions.filter((i) => String(i.eventId) === String(event.eventId || event.id));
    const hasDismissed = eventInteractions.some((i) => i.action === 'DISMISS' || i.interactionType === 'DISMISS');
    const hasSaved = eventInteractions.some((i) => i.action === 'SAVE' || i.interactionType === 'SAVE' || i.action === 'CALENDAR_ADD');
    const hasRegistered = eventInteractions.some((i) => i.action === 'REGISTER' || i.interactionType === 'REGISTER');

    if (hasDismissed) {
      interactionScore = 0.0; // severe penalty for dismissed
    } else if (hasRegistered) {
      interactionScore = 0.2; // already registered, lower priority in recommendation feed
    } else if (hasSaved) {
      interactionScore = 1.0; // boosted
      matchingSignals.push('Previously saved/added to student calendar');
    }

    // 7. Freshness & Urgency Score
    let freshnessScore = 0.5;
    const now = new Date().getTime();
    let daysUntilDeadline = 14;
    if (event.registrationDeadline) {
      const deadline = new Date(event.registrationDeadline).getTime();
      if (!isNaN(deadline)) {
        daysUntilDeadline = (deadline - now) / (1000 * 60 * 60 * 24);
      }
    }

    if (daysUntilDeadline > 0 && daysUntilDeadline <= 3) {
      freshnessScore = 1.0;
      matchingSignals.push(`Registration deadline approaching soon (${Math.ceil(daysUntilDeadline)} day(s) left)`);
    } else if (daysUntilDeadline > 0 && daysUntilDeadline <= 14) {
      freshnessScore = 0.8;
    } else if (daysUntilDeadline < 0) {
      freshnessScore = 0.1; // expired deadline
    }

    // Total Weighted Score Calculation
    const totalScore =
      branchScore * weights.branchMatch +
      skillScore * weights.skillOverlap +
      interestScore * weights.interestMatch +
      careerGoalScore * weights.careerGoalRelevance +
      locationScore * weights.locationEligibility +
      interactionScore * weights.interactionHistory +
      freshnessScore * weights.freshnessAndUrgency;

    const recommendationReason = matchingSignals.length > 0
      ? matchingSignals[0]
      : `Recommended ${event.category} event matching your student profile.`;

    return {
      eventId: String(event.eventId || event.id),
      totalScore: parseFloat(totalScore.toFixed(4)),
      breakdown: {
        branchScore: parseFloat(branchScore.toFixed(2)),
        skillScore: parseFloat(skillScore.toFixed(2)),
        interestScore: parseFloat(interestScore.toFixed(2)),
        careerGoalScore: parseFloat(careerGoalScore.toFixed(2)),
        locationScore: parseFloat(locationScore.toFixed(2)),
        interactionScore: parseFloat(interactionScore.toFixed(2)),
        freshnessScore: parseFloat(freshnessScore.toFixed(2)),
      },
      matchingSignals,
      missingRequirements,
      recommendationReason,
    };
  }
}
