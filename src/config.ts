import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

function loadEnvLocal(): Record<string, string> {
  const envPath = join(process.cwd(), '.env.local');
  if (!existsSync(envPath)) return {};

  try {
    const content = readFileSync(envPath, 'utf-8');
    const env: Record<string, string> = {};

    content.split('\n').forEach((line: string) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
    });
    return env;
  } catch {
    return {};
  }
}

export function getApiKey(): string | undefined {
  const envLocal = loadEnvLocal();
  return envLocal.FREE_TIER_GEMINI_API_KEY || process.env.FREE_TIER_GEMINI_API_KEY;
}

export function getModel(): string {
  const envLocal = loadEnvLocal();
  return envLocal.MODEL || process.env.MODEL || 'gemini-2.0-flash-001';
}

