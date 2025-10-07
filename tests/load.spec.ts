import { describe, it, expect } from 'vitest';
import { createClient, getModelName, hasApiKey } from '../src/client.js';

describe('Multiple Prompts Test', () => {
  it('should generate responses for multiple prompts', async () => {
    if (!hasApiKey()) {
      console.warn('FREE_TIER_GEMINI_API_KEY not set, skipping');
      return;
    }

    const ai = createClient();
    const model = ai.getGenerativeModel({ model: getModelName() });

    const prompts = [
      'Count from 1 to 5',
      'List 3 colors',
      'Name 2 animals',
      'Say the alphabet until E',
    ];

    for (const prompt of prompts) {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      expect(text).toBeTruthy();
      expect(text.length).toBeGreaterThan(0);
      
      // Delay to manage rate limits: 15 req/min = 1 req per 4 seconds
      await new Promise(resolve => setTimeout(resolve, 4500));
    }
  });

  it('should generate longer text response', async () => {
    if (!hasApiKey()) {
      console.warn('FREE_TIER_GEMINI_API_KEY not set, skipping');
      return;
    }

    // Wait before next test to avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 5000));

    const ai = createClient();
    const model = ai.getGenerativeModel({ model: getModelName() });

    const result = await model.generateContent(
      'Write a short paragraph (3-4 sentences) about the color blue.'
    );
    const text = result.response.text();

    expect(text).toBeTruthy();
    expect(text.length).toBeGreaterThan(50);
  });
});
