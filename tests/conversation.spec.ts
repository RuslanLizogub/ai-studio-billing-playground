import { describe, it, expect } from 'vitest';
import { createClient, getModelName, hasApiKey } from '../src/client.js';

describe('Conversation Test', () => {
  it('should handle multi-turn conversation', async () => {
    if (!hasApiKey()) {
      console.warn('FREE_TIER_GEMINI_API_KEY not set, skipping');
      return;
    }

    const ai = createClient();
    const model = ai.getGenerativeModel({ model: getModelName() });

    const chat = model.startChat({
      history: [],
    });

    // Turn 1
    const result1 = await chat.sendMessage('My name is Alex');
    expect(result1.response.text()).toBeTruthy();

    // Turn 2
    const result2 = await chat.sendMessage('What is my name?');
    const response2 = result2.response.text();
    expect(response2).toBeTruthy();
    expect(response2.toLowerCase()).toContain('alex');

    // Turn 3
    const result3 = await chat.sendMessage('Count to 3');
    expect(result3.response.text()).toBeTruthy();
  });

  it('should generate structured data', async () => {
    if (!hasApiKey()) {
      console.warn('FREE_TIER_GEMINI_API_KEY not set, skipping');
      return;
    }

    const ai = createClient();
    const model = ai.getGenerativeModel({ model: getModelName() });

    const result = await model.generateContent(
      'List 5 programming languages as a comma-separated list'
    );
    const text = result.response.text();

    expect(text).toBeTruthy();
    expect(text).toContain(',');
  });
});
