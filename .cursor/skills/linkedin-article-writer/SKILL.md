---
name: linkedin-article-writer
description: >-
  Writes LinkedIn articles and posts for engineering experience-sharing.
  Use when the user asks for a LinkedIn article, LinkedIn post, cover image
  for LinkedIn, professional tech storytelling, or "write an article for LinkedIn".
---

# LinkedIn Article Writer

## Goal

Produce LinkedIn-ready engineering articles that read as **experience sharing**, not product docs or PR dumps.

## Voice

- Professional, clear, slightly witty — never meme-heavy or sarcastic toward employers/tools
- First person singular/plural as appropriate (`I` / `we`)
- Celebrate **architecture and judgment**, not framework fashion
- No secrets, credentials, internal hostnames, private PR links unless user asks
- Prefer dummy examples over real class names, SQL, or proprietary paths

## Hard rules

1. **No project source code** unless the user explicitly asks to include it.
2. **No dump of PR descriptions** — rewrite into story + lessons.
3. **Architecture over tooling**: emphasize workflows, constraints, trade-offs.
4. Keep paragraphs short (1–3 sentences) for LinkedIn readability.
5. Use plain-language diagrams (ASCII / simple boxes) sparingly; LinkedIn truncates heavy formatting.
6. Offer: **Title**, **Subtitle (optional)**, **Cover image** (generate when useful), **Full article body**, **3–5 hashtags**.

## Structure template

1. **Hook** (problem / tension in 2–4 lines)
2. **Context** (legacy constraint, scale, why it mattered)
3. **Wrong instinct** (what “modern rewrite” temptation looked like)
4. **What we actually did** (architecture story with dummy names)
5. **Results** (concrete numbers if provided; otherwise qualitative)
6. **Lessons** (3–5 bullets)
7. **Close** (invitation to discuss; no hard sell)

## Cover image guidance

When generating a cover:

- 16:9 editorial tech visual
- Avoid purple AI-slop gradients, stock handshakes, and readable fake UI text
- One metaphor (data lanes, calm database, browser store, etc.)

## Output format for the user

```markdown
## Title
...

## Subtitle
...

## Cover
[describe or attach generated image]

## Article
...

## Hashtags
...
```

## When refining

If the user provides a PR summary or architecture dump:

- Extract the engineering thesis
- Replace real module names with dummies (`AcmeReport`, `WeekRunner`, `SecureStore`)
- Keep production-proven numbers if the user supplied them
