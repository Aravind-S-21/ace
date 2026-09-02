export interface LLMProvider {
  /**
   * Generates an explanation for a recommendation based on provided structured evidence.
   * @param evidence Structured text representing the features (e.g. skillMatch: 95, careerFit: 90)
   * @returns A natural language explanation grounding the recommendation.
   */
  generateExplanation(evidence: string): Promise<string>;
}
