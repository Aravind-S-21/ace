export interface EmbeddingProvider {
  /**
   * Generates a vector embedding for the given text.
   * @param text The input string to embed.
   * @returns A promise resolving to an array of numbers representing the embedding.
   */
  generateEmbedding(text: string): Promise<number[]>;
}
