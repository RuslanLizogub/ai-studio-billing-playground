import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiKey, getModel } from './config.js';

export function getModelName(): string {
  return getModel();
}

export function createClient(): GoogleGenerativeAI {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('FREE_TIER_GEMINI_API_KEY is required');
  }
  return new GoogleGenerativeAI(apiKey);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}
