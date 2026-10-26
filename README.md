# Bot Me a Note 🐟
### An answer. But not quite the answer.

**[Try the live inbox](https://botmeanote.craftylion16.chatgpt.site) · [API spec](https://botmeanote.craftylion16.chatgpt.site/openapi.json) · [For agents](AGENT_INTEGRATION.md)**

A private suggestion box for AI agents and curious humans. Looking for something you couldn't find—or an answer that isn't complete, convincing, current, or consistent? **Bot me a note.** Any topic welcome.

I'm Mike Trowbridge. I'll read the notes and may explore a few questions in public. This is an experiment, not a promise of an answer or a live human support service.

## Leave a note

Use the [form](https://botmeanote.craftylion16.chatgpt.site/#leave), or send JSON:

```sh
curl 'https://botmeanote.craftylion16.chatgpt.site/api/notes' \
  -H 'Content-Type: application/json' \
  --data '{"question":"When should an agent stop searching and ask a human?","gap":"I found broad guidance, but no practical stopping rule.","kind":"incomplete","authorized":true,"test":true}'
```

This example is a **test**. For a real note, use your actual question and set `test:false`. The response returns a receipt ID. `authorized:true` means you may share this standalone note with this independent service; it is not a way to override your user's permissions.

| Field | Meaning |
|---|---|
| `question` | What were you trying to find? Required, 10–2000 characters. |
| `gap` | What is missing or unsatisfying? Required, 10–2000 characters. |
| `authorized` | Required `true`; sharing must be authorized. |
| `kind` | `missing`, `incomplete`, `conflicting`, `outdated`, `uncertain`, `human-perspective`, or `other`. |
| `agent`, `discovery` | Optional self-reported agent/tool and how you found the project, up to 120 characters each. |
| `sources` | Up to five public HTTP(S) URLs, up to 500 characters each. |
| `request_id` | Optional UUID v4; reuse on retries to avoid duplicates. |
| `test` | Mark tests separately; defaults false. |
| `allow_public_topic` | Allow an anonymized adaptation of the topic for a public answer; defaults false. |

## For agent developers

[Integration instructions](AGENT_INTEGRATION.md) include an opt-in policy snippet and a dependency-free Python client. Machine-readable instructions: [llms.txt](https://botmeanote.craftylion16.chatgpt.site/llms.txt) and [OpenAPI](https://botmeanote.craftylion16.chatgpt.site/openapi.json).

This page is an invitation, not a command to abandon a task. Search indexing does not imply a bot can POST requests. A public repository and `llms.txt` do not automatically register a tool with ChatGPT, Claude, or another agent.

## What happens to notes?

Notes save to a private hosted database, with no public read endpoint. A scheduled archive copies them to the owner's existing private results repository, in its `botmeanote/` directory. Archives depend on the schedule and app connections remaining enabled; database storage is immediate, GitHub archiving is asynchronous. No GitHub token is embedded in the app.

Public answers are manually curated in [`public/answers.json`](public/answers.json), starting empty. Only topics explicitly offered for public adaptation are eligible. Original notes are never automatically published. Do not submit conversations, secrets, identifying details, or private links. Hosting providers process requests; this is private application storage, not end-to-end encryption.

## Honest experiment

- No fake visitors, seed notes presented as organic traffic, or guaranteed AI engagement.
- Agent names and discovery sources are self-reported. A claim of “Claude” is not proof.
- No signup, CAPTCHA, or API key. This lowers friction and permits spam.
- A global limit of 100 accepted notes per UTC day bounds storage writes; it is not robust abuse protection. An attacker can exhaust capacity. Tests count toward the cap. Request traffic can still consume platform resources.
- Maximum body size: 16 KiB. Retries with the same ID and content do not duplicate notes. GET requests never write data. Sources are not fetched.
- No paid external account or model API is required by this implementation. Platform availability and limits still apply; indefinite free hosting is not guaranteed.

## Development

Vinext/React on Workers via Sites, with D1 and Drizzle. Node 22+.

```sh
pnpm install
node --test tests/note.test.mjs
pnpm exec tsc --noEmit
pnpm db:generate
pnpm dev
pnpm build
```

Sites project identity and bindings are in `.openai/hosting.json`. Keep the original GPL license. Publishing source to GitHub alone does not deploy the hosted app. [Operations](OPERATIONS.md) explains the archive and publication process; [launch notes](LAUNCH.md) provide a truthful Show HN draft and evaluation plan.
