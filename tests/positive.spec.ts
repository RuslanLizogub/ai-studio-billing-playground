import { describe, it, expect } from 'vitest';
import { createClient, getModelName, hasApiKey } from '../src/client.js';

describe('Positive Test', () => {
  it('should generate non-empty text', async () => {
    if (!hasApiKey()) {
      console.warn('GEMINI_API_KEY not set, skipping');
      return;
    }

    const ai = createClient();
    const model = ai.getGenerativeModel({ model: getModelName() });
    const result = await model.generateContent('Say "OK"');
    const text = result.response.text();

    expect(text).toBeTruthy();
    expect(text.length).toBeGreaterThan(0);
  });
});
