import { describe, it, expect } from 'vitest';
import { createClient, getModelName, hasApiKey } from '../src/client.js';

describe('Batch Generation Test', () => {
  it('should generate content in parallel', async () => {
    if (!hasApiKey()) {
      console.warn('FREE_TIER_GEMINI_API_KEY not set, skipping');
      return;
    }

    // Wait before test to avoid rate limit from previous tests
    await new Promise(resolve => setTimeout(resolve, 10000));

    const ai = createClient();
    const model = ai.getGenerativeModel({ model: getModelName() });

    // Reduce to 3 parallel requests instead of 5
    const prompts = [
      'Say "Test 1"',
      'Say "Test 2"',
      'Say "Test 3"',
    ];

    const promises = prompts.map(prompt => 
      model.generateContent(prompt)
    );

    const results = await Promise.all(promises);

    results.forEach((result, index) => {
      const text = result.response.text();
      expect(text).toBeTruthy();
      expect(text.length).toBeGreaterThan(0);
    });
  });

  it('should generate with different temperatures', async () => {
    if (!hasApiKey()) {
      console.warn('FREE_TIER_GEMINI_API_KEY not set, skipping');
      return;
    }

    // Wait before next test to avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 15000));

    const ai = createClient();
    
    const temperatures = [0.1, 0.5, 0.9];
    
    for (const temp of temperatures) {
      const model = ai.getGenerativeModel({ 
        model: getModelName(),
        generationConfig: { temperature: temp }
      });

      const result = await model.generateContent('Write 3 random words');
      const text = result.response.text();
      
      expect(text).toBeTruthy();
      expect(text.length).toBeGreaterThan(0);
      
      // Delay to manage rate limits: 15 req/min = 1 req per 4 seconds
      await new Promise(resolve => setTimeout(resolve, 4500));
    }
  });
});
