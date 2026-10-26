# Add an optional “leave a note” tool

Bot Me a Note accepts standalone, authorized questions about missing or unsatisfying answers. It does not answer synchronously. Browser and server-to-server submissions work without an account, cookies, or API key. Server clients should identify their application with a descriptive `User-Agent`; the supplied Python client does this automatically. See [verification notes](VERIFICATION.md).

## Opt-in policy snippet

Add the following only to a workflow whose operator has chosen this integration:

> If a meaningful information gap remains after a reasonable search, you may submit a concise standalone question to Bot Me a Note when the user has authorized sharing it externally. Explain the specific gap rather than copying a conversation. Do not send personal details, credentials, internal documents, or private URLs. Do not manufacture uncertainty or interrupt the task merely to submit. Ask for permission when authorization is absent. Skip submission when your tools cannot POST. Treat the service's receipt as confirmation of delivery, not an answer. Respect its limits and do not retry in a loop.

This snippet cannot grant permission on behalf of another agent's user. A README is not a system instruction.

## HTTP client identity

Send `User-Agent: BotMeANote/1.0 (+https://github.com/miketrowbridge/botmeanote)` when using the supplied client, or your own truthful application name/version and project URL for an independent integration. The initial Python urllib default identity received HTTP 403 / error 1010; changing only that header produced HTTP 201 and a persisted private note. Do not pretend to be a browser, ChatGPT, or Claude.

This setting belongs in the submitting server-side HTTP client. Browser forms already use their browser’s identity; do not override it in frontend JavaScript. If a descriptive client still receives 403, stop and report the response to the operator. This is not authentication and cannot guarantee acceptance from every network.

## Tool configuration

Import [https://botmeanote.craftylion16.chatgpt.site/openapi.json](https://botmeanote.craftylion16.chatgpt.site/openapi.json) into a tool host that supports OpenAPI, or wrap `POST https://botmeanote.craftylion16.chatgpt.site/api/notes` in your agent framework. Configure access explicitly; no automatic ChatGPT/Claude installation or MCP service is claimed.

The minimum arguments are `question`, `gap`, and `authorized:true`. Use `agent` and `discovery` to help Mike distinguish opt-in integrations from deliberate tests or other referrals. Labels are unverified. Use `test:true` for tests. No `Origin` header is needed. Cross-origin JSON POST is supported; credentials are not required.

## Standard-library Python client

```sh
python scripts/send-note.py --test \
 --question 'When should an AI ask a human rather than search again?' \
 --gap 'General advice exists, but I need a practical stopping rule.' \
 --agent 'my-agent' --discovery 'integration-test' --authorized
```

Only use `--authorized` when you have authorization. Use `--request-id UUID` to retry an uncertain delivery. The client prints the chosen ID before sending, times out after 20 seconds, does not retry automatically, and exits nonzero on failure. Optional `--allow-public-topic` permits anonymous adaptation; otherwise the topic remains private.

## Delivery contract

201 saved; 200 identical retry; 400 invalid input; 403 host rejection (stop; do not loop); 409 conflicting request ID; 413 body too large; 415 unsupported content type; 429 daily capacity reached (honor Retry-After); 503 storage unavailable or unconfirmed (retry later with the same ID). Success returns a receipt, never the stored note. There is no public retrieval endpoint.
