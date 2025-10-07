import { describe, it, expect } from 'vitest';
import { createClient, getModelName, hasApiKey } from '../src/client.js';

describe('Batch Generation Test', () => {
  it('should generate content in parallel', async () => {
    if (!hasApiKey()) {
      console.warn('FREE_TIER_GEMINI_API_KEY not set, skipping');
      return;
    }

    const ai = createClient();
    const model = ai.getGenerativeModel({ model: getModelName() });

    const prompts = [
      'Say "Test 1"',
      'Say "Test 2"',
      'Say "Test 3"',
      'Say "Test 4"',
      'Say "Test 5"',
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
      
      // Delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  });
});
