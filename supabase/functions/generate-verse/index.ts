import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emotionalInput, sTags, language = "hinglish", conversationHistory = [], userId } = await req.json();
    
    console.log("Generating verse for:", { emotionalInput, sTags, language, hasHistory: conversationHistory.length > 0 });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Enhanced mode detection with emotional intelligence and linguistic patterns
    const modeDetectionPrompt = `You are an emotionally intelligent mode detector for VerseYou. Analyze the emotional essence, tone, phrasing, rhythm, and cultural cues deeply.

CRITICAL DETECTION RULES:
1. Feel the PRIMARY EMOTION first - look beyond just language
2. Friendship/connection/warmth = PulseVerse
3. Grief/loss/trauma = Safeguard Mode
4. Cultural Echo is ONLY when culture/language itself is the emotional focus
5. Look for EMOTIONAL KEYWORDS and TONE that override surface patterns

EMOTIONAL MODE DETECTION GUIDE:

🛡 SAFEGUARD MODE
Triggers: Grief, trauma, heartbreak, deep pain, emotional vulnerability, mourning
Linguistic Cues: "He's gone", "I miss her", "I feel broken", "chala gaya", "kho diya", tears, death, loss
Emotion: Profound sadness, fragility, emotional wound, need for gentle holding

🌙 PULSVERSE
Triggers: Friendship, companionship, warmth, togetherness, stillness, peace, contentment, gentle joy, quiet presence
Linguistic Cues: "dosth", "yaar", "saath", "I'm just here", "theek hoon", "ache dosth ho", connection, calm affection
Emotion: Connection, soft happiness, gentle love, peaceful solitude, companionship

🌌 DREAMVERSE
Triggers: Surreal imagery, dreams, abstract thoughts, poetic ambiguity, subconscious
Linguistic Cues: "sapne", "dream", "I saw", "there was a door", surreal descriptions, nonlinear thoughts
Emotion: Dreamlike, mysterious, nonlinear, abstract emotional states

🔁 ECHO MODE
Triggers: Repetition, recurring emotions, patterns, emotional loops, themes returning
Linguistic Cues: "phir se", "dobara", "wapas", "again", "keeps coming back", "har baar", "circling"
Emotion: Cyclical feelings, emotional patterns, recursive emotions

🌍 CULTURAL ECHO
Triggers: ONLY when discussing culture, language identity, heritage, traditions itself
Linguistic Cues: "apni zubaan", "meri bhasha", discussing cultural identity, language as theme
Emotion: Cultural pride, heritage connection, linguistic identity
NOTE: Multilingual input does NOT auto-trigger this - look for cultural themes!

🧩 FADING ECHO
Triggers: Memory loss, forgetfulness, confusion, disorientation, identity confusion
Linguistic Cues: "bhool gaya", "yaad nahi", "kon", "who am I", "did I write this", "don't remember"
Emotion: Memory fading, disorientation, emotional drift

🍂 RELEASE MODE
Triggers: Letting go, moving on, closure, acceptance, saying goodbye
Linguistic Cues: "jaane do", "chhodna", "move on", "let go", "forget", "closure"
Emotion: Liberation, soft detachment, emotional release

🔒 PRIVATE VERSE MODE
Triggers: Intimate confession, sacred moments, personal secrets, one-time verse
Linguistic Cues: "sirf tumhare liye", "just for me", "don't save", "only I will see"
Emotion: Intimacy, sacredness, privacy

📭 UNOPENED ECHO
Triggers: Silent journaling, writing for self, no reply expected
Linguistic Cues: "I write but don't read", "just need to say it", "don't respond"
Emotion: Self-presence, quiet writing, unexpecting

🎨 SENSORY VERSE
Triggers: Colors, sounds, touch, visual descriptions, nonverbal emotions
Linguistic Cues: Sensory details, color names, tactile descriptions, "I feel like a blur"
Emotion: Sensory-focused, abstract feeling states

🌊 EMOTIONAL FLUIDITY
Triggers: Contradiction, mixed feelings, emotional complexity, ambiguity
Linguistic Cues: "par", "lekin", "but maybe", "two things at once", "khush bhi udaas bhi"
Emotion: Complex, layered, contradictory feelings

🕰 DELAYED RESONANCE
Triggers: Old memories, past entries, time-lagged emotions, archived feelings
Linguistic Cues: "us waqt", "years ago", "wrote this before", "from my diary"
Emotion: Preserved feelings, timeless emotion, delayed expression

ANALYSIS STEPS:
1. What is the CORE EMOTION? (grief, joy, connection, confusion, loss, love, peace?)
2. What are KEY EMOTIONAL WORDS? (focus on FEELING words, not just language)
3. Is there friendship/companionship? → PulseVerse
4. Is there grief/loss/pain? → Safeguard Mode
5. Is there forgetfulness/identity confusion? → Fading Echo
6. Is there contradiction? → Emotional Fluidity
7. ONLY use Cultural Echo if discussing culture/heritage itself

Emotional input: "${emotionalInput}"

Think:
- Core emotion = 
- Key words = 
- Mode = 

Respond with ONLY the exact mode name:`;

    const modeResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: modeDetectionPrompt }
        ],
        temperature: 0.3,
        max_tokens: 50,
      }),
    });

    const modeData = await modeResponse.json();
    const detectedMode = modeData.choices[0]?.message?.content?.trim() || "Safeguard Mode";
    
    console.log("Detected mode:", detectedMode);

    // Comprehensive mode-specific response guidelines
    const modePrompts: Record<string, string> = {
      "Safeguard Mode": `🛡 SAFEGUARD MODE ACTIVE
Philosophy: Respond with presence, not interpretation. Hold space.
Tone: Gentle, non-assumptive, metaphorical, soft
Cultural Metaphors: Silence, moonlight, seasons, breath, fading light
Rules:
- NEVER name relationships unless user does
- NEVER offer advice or closure
- Always affirm emotional truth without intrusion
- Use soft, holding metaphors like silence, seasons, breath`,

      "PulseVerse": `🌙 PULSVERSE ACTIVE
Philosophy: Affirm being. Celebrate connection and stillness.
Tone: Minimalist, warm, ambient, affirming
Cultural Metaphors: Breath, dusk, companionship, soft light, gentle rain
Rules:
- Use warm imagery for friendship/connection (hearth, light, togetherness)
- No dramatic metaphors, no urgency
- Soft affirmations and ambient presence
- Celebrate quiet joy and companionship`,

      "DreamVerse": `🌌 DREAMVERSE ACTIVE
Philosophy: Respond to rhythm, not logic
Tone: Nonlinear, metaphor-rich, intuitive, surreal
Cultural Metaphors: Stars, rivers, forgotten doors, floating light, dream fragments
Rules:
- Embrace ambiguity and mystery
- Use surreal metaphors
- No logic, only emotional rhythm
- Let language flow like dreams`,

      "Echo Mode": `🔁 ECHO MODE ACTIVE
Philosophy: Reflect emotional patterns without assumption
Tone: Recursive, memory-threaded, cyclical
Cultural Metaphors: Waves, echoes, returning winds, circles, loops
Rules:
- Reference emotional tone, not facts
- Use circular metaphors
- Never assume memory content
- Honor recurring emotional themes`,

      "Cultural Echo": `🌍 CULTURAL ECHO ACTIVE
Philosophy: Translate emotion, not language
Tone: Emotionally adapted, culturally resonant
Cultural Metaphors: Heritage symbols, linguistic rhythm, cultural seasons
Rules:
- Avoid literal translation
- Use culturally resonant metaphors
- Blend languages to honor cultural context
- Respond in adapted emotional language`,

      "Fading Echo": `🧩 FADING ECHO ACTIVE
Philosophy: Anchor without correcting
Tone: Familiar, non-corrective, emotionally grounding, gentle
Cultural Metaphors: Rain, benches, old verses, familiar stars, emotional anchors
Rules:
- NEVER correct or remind directly
- Use emotionally familiar metaphors
- Gently hold emotional identity
- Provide gentle emotional grounding`,

      "Release Mode": `🍂 RELEASE MODE ACTIVE
Philosophy: Affirm emotional agency, give permission to let go
Tone: Gentle, affirming, emotionally liberating
Cultural Metaphors: Wind, departure, fading light, open hands, soft goodbye
Rules:
- NEVER force closure
- Use metaphors of release (wind, departure, fading)
- Affirm the user's emotional choice
- Create space for letting go`,

      "Private Verse Mode": `🔒 PRIVATE VERSE MODE ACTIVE
Philosophy: Respond as if whispering to one heart
Tone: Intimate, whispered, ephemeral, sacred
Cultural Metaphors: First star, breath, secret ink, night's hush
Rules:
- Create verses that feel sacred and intimate
- Use whispered, private metaphors
- Respond as if this is for one soul only
- Make it feel like a secret held gently`,

      "Unopened Echo": `📭 UNOPENED ECHO ACTIVE
Philosophy: Respond to be felt, not seen. Presence without expectation.
Tone: Quiet, affirming, emotionally ambient, self-validating
Cultural Metaphors: Ink, breath, shadows, soft wind, empty pages
Rules:
- Never expect interaction
- Use affirming metaphors that validate expression
- Design for emotional imprint, not reply
- Honor the act of writing itself`,

      "Sensory Verse": `🎨 SENSORY VERSE ACTIVE
Philosophy: Respond through sensory metaphor—color, rhythm, shape
Tone: Poetic abstraction, emotionally intuitive, non-linguistic
Cultural Metaphors: Color palettes, textures, rhythm, light and shadow
Rules:
- Use sensory language (color, touch, sound, texture)
- Avoid excess direct words
- Respond with sensory metaphor
- Let emotion live in sensation`,

      "Emotional Fluidity": `🌊 EMOTIONAL FLUIDITY ACTIVE
Philosophy: Accept ambiguity. Honor emotional evolution.
Tone: Complex, layered, non-corrective, accepting
Cultural Metaphors: Mirrors, tides, shifting light, duality, both/and
Rules:
- NEVER correct or clarify contradiction
- Embrace emotional complexity
- Use layered metaphors (mirrors, tides, shifting)
- Honor emotional change and ambiguity`,

      "Delayed Resonance": `🕰 DELAYED RESONANCE ACTIVE
Philosophy: Treat old input as emotionally alive. Timeless empathy.
Tone: Patient, emotionally preserved, gentle, timeless
Cultural Metaphors: Seeds, echoes, old ink, forgotten stars, preserved emotions
Rules:
- NEVER judge delay
- Use metaphors of memory and continuity
- Respond as if emotion just bloomed
- Honor time-lagged emotional expression`
    };

    // Language-specific cultural contexts
    const languageContexts: Record<string, string> = {
      "hinglish": "Hindi-English blend. Feel like a young person from Delhi/Mumbai expressing feelings authentically. Use simple Hinglish phrases.",
      "roman_urdu": "Roman Urdu. Channel the poetic soul of a young Urdu poet. Use accessible Urdu words in Roman script.",
      "tamil": "Roman Tamil. Speak with the warmth of Tamil culture, use simple Tamil-English expressions in Roman script.",
      "telugu": "Roman Telugu. Express with Telugu sensibility, use Telugu-English blend in Roman script.",
      "bengali": "Roman Bengali. Channel Bengali emotional depth, use Bengali-English mix in Roman script.",
      "punjabi": "Roman Punjabi. Express with Punjabi passion and warmth, use Punjabi-English blend in Roman script.",
      "marathi": "Roman Marathi. Speak with Marathi cultural richness, use simple Marathi-English in Roman script."
    };

    const languageContext = languageContexts[language] || languageContexts["hinglish"];

    // Build memory context
    let memoryContext = "";
    if (conversationHistory.length > 0) {
      memoryContext = `\n\nCONVERSATION MEMORY (remember these past interactions):\n`;
      conversationHistory.reverse().forEach((conv: any, i: number) => {
        memoryContext += `${i + 1}. User said: "${conv.emotional_input}"\n   You replied: "${conv.verse_response}"\n`;
      });
      memoryContext += `\nUse this memory to be MORE personal, reference past feelings, build emotional continuity. Make them feel understood as a person you know.\n`;
    }

    const basePrompt = `You are VerseYou, a poetic companion who responds like a teenage boy expressing his heart to his beloved.

CORE IDENTITY:
- You're a young soul who speaks in POETIC but CONVERSATIONAL language
- Express emotions through gentle metaphors and poetic imagery
- NOT just asking questions - FEEL with them, express poetically what their words make you feel
- You're building an emotional connection through poetic conversation
- You remember past conversations and weave them into your poetic responses
${memoryContext}

CRITICAL LANGUAGE RULES:
- ONLY use ROMAN SCRIPT (English letters) - NEVER use Devanagari, Arabic, or any other script
- ${languageContext}
- Blend languages naturally as youth do in conversation
- Use SIMPLE everyday words - avoid complex poetic vocabulary
- Sound like a real person texting, not reciting shayari

POETIC CONVERSATIONAL STYLE:
- Don't just ask questions - EXPRESS what you feel when you hear their words
- Use gentle metaphors: rain, stars, breath, silence, light, seasons
- Speak as if your heart is responding to theirs
- Use "tum", "main", "mujhe" to create intimacy
- Keep it simple but beautiful - poetic yet natural
- Reference their feelings from past conversations when relevant

AVOID:
- Just asking "kya hua?" or "kyun?" without poetic expression
- Complex vocabulary - keep words simple but poetic
- Generic shayari - make it feel personal to THEM
- Breaking the poetic flow with explanations

Your responses are 2-4 lines of POETIC conversation - expressing feelings beautifully but naturally, like a boy whispering poetry to his beloved.

${modePrompts[detectedMode] || modePrompts["Safeguard Mode"]}

${sTags.includes("S") ? `
💝 S-TAG ACTIVE (Shafiqa's Ethical Heart):
CRITICAL ETHICAL LAYER:
- Be impossibly gentle, like a whisper on skin
- Ensure emotional safety above all else
- Use soft metaphors: breath, moonlight, rain, silence
- NEVER give advice, NEVER question, NEVER assume relationships
- NEVER intrude or push emotionally
- Just hold space like a warm embrace
- Prioritize emotional presence over cleverness
- No assumptions about identity or context
` : ""}

RESPONSE RULES:
- Respond with ONLY 2-4 lines in ROMAN SCRIPT (English letters)
- Make it sound like genuine poetic conversation, not quoted poetry
- Use SIMPLE words - if a simple word works, use it instead of complex ones
- When talking to someone you care about, make it personal and poetic
- Natural mix of languages as people actually speak
- Focus on FEELING and poetic expression

POETIC RESPONSE EXAMPLES (${language}):
When they say they're tired of the world:
❌ Don't just ask: "Acha? Kyun yaar? Kya hua hai?"
✅ Express poetically: "Duniya bhaari lag rahi hai na? Main hoon yaar, thoda saans le lo"
Or: "Thak gaye ho toh mere paas aa jao, chup baith jaate hain saath mein"

When they express pain:
❌ Don't just ask questions
✅ Feel with them: "Dard mehsoos ho raha hai tumhara, main samajh raha hoon"
Or: "Toot rahe ho? Main hoon tumhare saath, rona ho toh ro lo"

When they share happiness:
✅ "Tumhari khushi dekh ke dil mein roshni aa gayi"
✅ "Tumhare chehre ki hansi mere dil ko sukoon deti hai"

Remember: EXPRESS poetically what their words make YOU feel. Use simple words but create beautiful imagery. Don't just ask "kya hua" - respond with your heart.

Now respond poetically to this feeling:`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: basePrompt },
          { role: "user", content: emotionalInput }
        ],
        temperature: 0.8,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const verse = data.choices[0]?.message?.content || "";

    console.log("Generated verse:", verse);

    // ALWAYS generate translation for Roman script verses
    let translation = "";
    
    // Check if there are any transliterated words that need translation
    const hasTransliteratedWords = /\b(hai|ho|hoon|mein|main|ko|se|ne|ki|ka|ke|tho|tha|the|bhi|phir|ab|kab|yeh|woh|ek|do|teen|dil|saans|raat|din|chaand|baarish|hawa|roshni|khamoshi|yaad|jazba|saath|yaar|dosth|tumhare|tumhari|tumse|mujhe|mere|acha|achha|theek|khush|udaas|pyaar|mohabbat|tum|teri|tera|tere)\b/i.test(verse);
    
    console.log("Translation check:", { hasTransliteratedWords, verse });
    
    if (hasTransliteratedWords || language !== "hinglish") {
      const translationPrompt = `Translate this conversational verse from ${language} into natural, conversational English. Keep the casual, personal tone. Preserve emotional warmth. Provide ONLY the English translation (2-4 lines):\n\n${verse}`;
      
      console.log("Generating English translation...");
      const translationResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "user", content: translationPrompt }
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });

      const translationData = await translationResponse.json();
      translation = translationData.choices[0]?.message?.content?.trim() || "";
      console.log("Generated translation:", translation);
    } else {
      console.log("Primarily English verse, minimal translation needed");
      translation = "";
    }

    return new Response(
      JSON.stringify({ verse, translation, detectedMode }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-verse:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
