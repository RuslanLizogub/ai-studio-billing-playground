import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient, getModelName, hasApiKey } from '../src/client.js';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { getApiKey } from '../src/config.js';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

describe('File Upload Test', () => {
  const testFilePath = join(process.cwd(), 'test-fixture.txt');
  let fileManager: GoogleAIFileManager;
  let uploadedFileName: string | null = null;

  beforeAll(() => {
    writeFileSync(testFilePath, 'Test', 'utf-8');
    if (hasApiKey()) {
      fileManager = new GoogleAIFileManager(getApiKey()!);
    }
  });

  afterAll(async () => {
    try {
      unlinkSync(testFilePath);
    } catch {}

    if (uploadedFileName && hasApiKey()) {
      try {
        await fileManager.deleteFile(uploadedFileName);
      } catch {}
    }
  });

  it('should upload file and generate response', async () => {
    if (!hasApiKey()) {
      console.warn('FREE_TIER_GEMINI_API_KEY not set, skipping');
      return;
    }

    // Wait before test to avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 5000));

    const uploadResult = await fileManager.uploadFile(testFilePath, {
      mimeType: 'text/plain',
      displayName: 'Test',
    });

    expect(uploadResult.file.uri).toBeTruthy();
    uploadedFileName = uploadResult.file.name;

    // Wait longer after upload before generating
    await new Promise(resolve => setTimeout(resolve, 3000));

    const ai = createClient();
    const model = ai.getGenerativeModel({ model: getModelName() });
    const result = await model.generateContent([
      { fileData: { fileUri: uploadResult.file.uri, mimeType: 'text/plain' } },
      { text: 'Say "OK"' },
    ]);

    const text = result.response.text();
    expect(text).toBeTruthy();
    expect(text.length).toBeGreaterThan(0);
  });
});
