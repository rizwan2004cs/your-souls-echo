# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/39bfe49d-f0e5-4dd5-b829-108d97276dce

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/39bfe49d-f0e5-4dd5-b829-108d97276dce) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/39bfe49d-f0e5-4dd5-b829-108d97276dce) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Language options & testing

This project now supports additional language options (including native-script replies) for the poetry responses. New options added to the language selector include:

- `hindi_urdu` — Hindi/Urdu blend (Roman)
- `roman_urdu` — Roman Urdu (Latin script)
- `urdu_native` — Urdu (اُردُو) in native script
- `tamil` — Roman Tamil (Latin script)
- `telugu_roman` — Telugu (Roman transliteration)
- `telugu_native` — Telugu (తెలుగు) in native script
- `bengali`, `punjabi`, `marathi` — Roman transliterations

How it works
- The UI selector (`src/components/LanguageSelector.tsx`) lets users pick Roman or native-script variants where applicable.
- The server function at `supabase/functions/generate-verse/index.ts` reads the selected language and adapts the prompt instructions so responses are produced in the requested script/voice. For native-script options (e.g. `urdu_native`, `telugu_native`) the model is instructed to return native script; for Roman options it will return transliteration.
- The function will also automatically generate an English translation when the response is non-English or in native script.

Quick local test (frontend)

1. Start the dev server in the project root:

```bash
npm i
npm run dev
```

2. Open the app in the browser, select a language from the language selector, and submit an emotional input. Observe the verse output and the English translation.

Quick function test (Supabase function)

1. Deploy or run the function in your Supabase functions environment. Ensure the `LOVABLE_API_KEY` environment variable is set for the function.

2. You can test by calling the function from the frontend (the app already invokes it) or by making a direct HTTP POST to the function endpoint with a JSON body like:

```json
{
	"emotionalInput": "I feel so tired and alone",
	"sTags": ["S"],
	"language": "urdu_native",
	"conversationHistory": []
}
```

3. The function will respond with `{ verse, translation, detectedMode }`. When `language` is a native-script option, `verse` should be in native script and `translation` should contain an English translation.

Notes
- Translation quality and script fidelity depend on the backend LLM (the prompts provide guidance). If you’d like different tone or stricter classical poetry style for any language (e.g., ghazal-style Urdu vs conversational Urdu), say which language and I’ll tighten the prompts.

