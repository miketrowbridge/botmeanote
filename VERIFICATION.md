# Release verification

Verified October 25, 2026 (America/Phoenix) against the public hosted endpoint.

## Server-to-server delivery

The earlier Python urllib default client received HTTP 403 with error 1010. Setting only a truthful application User-Agent resolved that failure:

```text
User-Agent: BotMeANote/1.0 (+https://github.com/miketrowbridge/botmeanote)
```

- Python urllib POST: **201 Created**, with a private receipt. No cookies, browser session, API key, or authorization header.
- Supplied `scripts/send-note.py`: **201 Created** after adding the header.
- curl with the same descriptive identity: **200** for the identical request ID already stored.
- Owner-only database readback confirmed the test payload and its `test:true` label.
- The server-client test was archived and read back from the private GitHub destination. The existing hourly archive schedule remains enabled.

This is tested client compatibility, not a guarantee about every client, network, or future hosting configuration. Independent integrations should identify their own application honestly. Browser JavaScript should keep its browser-managed User-Agent. An agent that can only search or fetch pages still cannot submit a POST automatically.

## Live API acceptance checks

| Check | Observed result |
|---|---|
| Identical request ID and payload | 200, duplicate acknowledged |
| Same ID, different payload | 409 |
| Sharing authorization absent/false | 400 |
| Public GET on notes endpoint | 405, no note contents |
| Unsupported Content-Type | 415 |
| Body above 16 KiB | 413 |
| Malformed JSON | 400 |
| OPTIONS preflight | 204 |

All deliberately submitted release notes are marked as tests. These results do not establish organic interest or verify a self-reported agent identity. No API credentials, private notes, or receipt IDs are published in this report.

## Local regression checks

- Five Node tests cover input validation, private defaults, UUID requirements, source URLs, and streamed byte limits.
- Two Python tests verify that the shipped client sends the descriptive identity without cookies/credentials and cannot send without the required authorization flag.
- TypeScript check and production build are part of release packaging.
- The daily accepted-write cap was verified against its actual SQL in a local SQLite database; production was not flooded to exhaust the cap.

## Launch scope

Ready for an initial public launch as an experiment. No signup or paid external account is required for visitors. The inbox accepts up to 100 notes per UTC day, and does not promise a reply. The API is a documented HTTP tool; this release does not claim automatic installation in ChatGPT/Claude, guaranteed search indexing, unsolicited bot traffic, or a verified MCP integration.
