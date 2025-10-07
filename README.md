# AI Studio Billing Playground

Minimal TypeScript project to test Google AI Studio billing with Gemini API.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Local development**
   
   Create `.env.local` file and add your API key:
   ```bash
   cat > .env.local << EOF
GEMINI_API_KEY=your_actual_key_here
MODEL=gemini-2.0-flash-001
EOF
   ```
   
   Replace `your_actual_key_here` with your real API key.
   
   Get API key: https://aistudio.google.com/app/apikey

3. **Run tests**
   ```bash
   npm test
   ```

## GitHub Actions

Set `GEMINI_API_KEY` in repository secrets:
- Go to Settings → Secrets and variables → Actions
- Add secret: `GEMINI_API_KEY`

Workflow runs automatically on every push.

## Tests

- **positive.spec.ts** - Simple text generation test
- **file.spec.ts** - File upload and processing test

Both tests use minimal prompts to keep token costs low.

## Files

- `.env.local` - Your local API key (not in git)
- `.github/workflows/test.yml` - CI configuration

## Priority

1. `.env.local` (local dev)
2. `process.env` (GitHub Actions)

`.env.local` is in `.gitignore` and never committed.
