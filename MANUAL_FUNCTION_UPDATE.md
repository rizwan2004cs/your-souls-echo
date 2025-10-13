# Manual Function Update Instructions

Since automated deployment is not working, please follow these steps to manually update your Supabase function:

## Option 1: Update via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/bcpuuuqopgdjzhfrgppj/functions

2. Click on the `generate-verse` function

3. Click "Edit" or "Manage Function"

4. Find the section with `languageContexts` (around line 266-279)

5. Replace this code:
```typescript
const languageContexts: Record<string, string> = {
  "hindi_urdu": "Hindi-Urdu blend. Mix Hindi and Urdu words naturally in Roman script. Use poetic Urdu words (dard, sukoon, safar, roshan) with Hindi grammar. Sound authentic and deeply poetic.",
  "roman_urdu": "Roman Urdu. Channel the poetic soul of a young Urdu poet. Use accessible Urdu words in Roman script.",
  "urdu_native": `Urdu (اُردُو script). Write like a native Urdu poet — lyrical, emotional, and rooted in Urdu poetic traditions.\n\nCRITICAL STYLE GUIDE:\n- Use NATURAL Urdu script (اُردُو). Do NOT transliterate into Roman letters when this language is selected.\n- Channel classical Urdu poetry (ghazal/ nazm) sensibilities but remain conversational and accessible.\n- Use common poetic metaphors: چاند (moon), بارش (rain), دل (heart), خاموشی (silence), سفر (journey)\n- Keep verses concise (2-3 short lines) and emotionally resonant.",
  "tamil": "Roman Tamil. Speak with the warmth of Tamil culture, use simple Tamil-English expressions in Roman script.",
  "telugu": `Telugu (తెలుగు script). Write like a native Telugu poet...`,
  "bengali": "Roman Bengali. Channel Bengali emotional depth, use Bengali-English mix in Roman script.",
  "punjabi": "Roman Punjabi. Express with Punjabi passion and warmth, use Punjabi-English blend in Roman script.",
  "marathi": "Roman Marathi. Speak with Marathi cultural richness, use simple Marathi-English in Roman script."
};
```

With this NEW code:
```typescript
const languageContexts: Record<string, string> = {
  "hindi_urdu": "Hindi-Urdu blend. Mix Hindi and Urdu words naturally in Roman script. Use poetic Urdu words (dard, sukoon, safar, roshan) with Hindi grammar. Sound authentic and deeply poetic.",
  "roman_urdu": "Roman Urdu. Channel the poetic soul of a young Urdu poet. Use accessible Urdu words in Roman script.",
  "urdu_native": `Urdu (اُردُو script). Write like a native Urdu poet — lyrical, emotional, and rooted in Urdu poetic traditions.\n\nCRITICAL STYLE GUIDE:\n- Use NATURAL Urdu script (اُردُو). Do NOT transliterate into Roman letters when this language is selected.\n- Channel classical Urdu poetry (ghazal/ nazm) sensibilities but remain conversational and accessible.\n- Use common poetic metaphors: چاند (moon), بارش (rain), دل (heart), خاموشی (silence), سفر (journey)\n- Keep verses concise (2-3 short lines) and emotionally resonant.`,
  "tamil": "Roman Tamil. Speak with the warmth of Tamil culture, use simple Tamil-English expressions in Roman script.",
  "telugu_roman": "Telugu (Roman script). Write like a Telugu poet but use Roman transliteration. Use simple Telugu-English expressions in Roman script with Telugu poetic sensibility.",
  "telugu_native": `Telugu (తెలుగు script). Write like a native Telugu poet - lyrical, deeply emotional, with classical literary beauty.\n\nCRITICAL STYLE GUIDE:\n- Use PURE Telugu script (తెలుగు), NO transliteration\n- Channel classical Telugu poetry traditions (భావ కావ్యం style)\n- Use authentic Telugu poetic devices: అనుప్రాసం (alliteration), యమకం (rhyme), శ్లేషం (double meanings)\n- Employ native metaphors: చంద్రుడు (moon), నదులు (rivers), పువ్వులు (flowers), వానలు (rains), గాలి (wind)\n- Use emotional Telugu words naturally: హృదయం (heart), ప్రేమ (love), బాధ (pain), ఆనందం (joy), స్వప్నం (dream)\n- Write in conversational yet poetic Telugu - like మొలకరించే పద్యం (sprouting poetry)\n- Embrace Telugu's musical quality with flowing phrases\n- Use gentle suffixes: రా, అని, గా, లో, తో for natural rhythm\n- Include classical literary phrases: మనసు తెరచుకుంది, గాలి ముద్దాడుతోంది, హృదయం పులకరించింది\n\nPOETIC EXAMPLES (తెలుగు కవిత్వ శైలి):\nInstead of: "You are in my heart" \nWrite: "నీ నవ్వు నా హృదయంలో వెలుగుతోంది" (Your smile lights up my heart)\n\nInstead of: "I miss you"\nWrite: "నీ లేకపోవడం గాలిలో ఒక ఖాళీలా అనిపిస్తోంది" (Your absence feels like emptiness in the air)\n\nUse poetic compounds: మనోవ్యథ, హృదయవేదన, ప్రేమాతురత\nUse literary particles: ఏమో, కదా, అని, రా\nSound like you're composing spontaneous poetry in natural Telugu`,
  "bengali": "Roman Bengali. Channel Bengali emotional depth, use Bengali-English mix in Roman script.",
  "punjabi": "Roman Punjabi. Express with Punjabi passion and warmth, use Punjabi-English blend in Roman script.",
  "marathi": "Roman Marathi. Speak with Marathi cultural richness, use simple Marathi-English in Roman script."
};
```

6. Also find line ~467 and change:
```typescript
const nonEnglishLanguages = ["hindi_urdu", "roman_urdu", "urdu_native", "tamil", "telugu", "telugu_roman", "bengali", "punjabi", "marathi"];
```
To:
```typescript
const nonEnglishLanguages = ["hindi_urdu", "roman_urdu", "urdu_native", "tamil", "telugu_native", "telugu_roman", "bengali", "punjabi", "marathi"];
```

7. Click "Deploy" or "Save"

8. Test your app again with Telugu (తెలుగు - Native script)

## Option 2: Copy Entire Updated Function

If easier, you can copy the entire updated function from:
`supabase/functions/generate-verse/index.ts`

And paste it into the Supabase Dashboard editor, then deploy.

---

## What Changed:
- ❌ OLD: `"telugu"` → ✅ NEW: `"telugu_native"` 
- ✅ Added: `"telugu_roman"` for Roman transliteration
- Fixed translation detection array

This ensures when you select "Telugu (తెలుగు - Native script)" in the UI, the backend will use the correct Telugu instructions instead of defaulting to Hindi-Urdu.
