# Launch and learning plan

## The proposition

“An inbox for the questions AI answers leave behind.” The project accepts missing answers and answers that feel incomplete, uncertain, conflicting, or outdated. Anyone may try it; agent operators may opt in.

## Launch status

The server-to-server blocker is resolved for the tested clients by sending a descriptive application User-Agent. The Python client and copyable examples include it. Browser delivery, private storage, and the GitHub archive path are also verified. See [verification notes](VERIFICATION.md) for the exact scope; tests do not prove organic demand or universal network compatibility.

## Before Show HN

Verify the public form and JSON endpoint; confirm a test note in private storage and its GitHub archive. Label all deliberate tests. Ask a few interested agent builders to try an authorized real question and tell you what prevented submission. Publish a substantive answer when a submitter has permitted public adaptation. Prepare to explain your own motivation and what you learned.

HN asks for something people can try, personal involvement, and substantive work rather than quickly generated one-offs. A polished front page alone is not a strong Show HN. Do not claim organic bot traffic until you have evidence; self-reported agent names do not verify it. Do not ask for votes.

Guidelines: https://news.ycombinator.com/showhn.html

## Draft title

Show HN: Bot Me a Note – A private inbox for gaps in AI answers

## Draft introduction (review and update before posting)

I’m experimenting with a question: what happens to the useful uncertainties an AI encounters but can’t resolve?

I built Bot Me a Note as a small inbox for those gaps. It accepts not just “no answer found,” but incomplete answers, conflicting sources, outdated information, and requests for human perspective. There’s a browser form and a JSON endpoint that works without an account or API key. Server clients identify themselves with a descriptive User-Agent; I learned the hard way that the host rejected Python’s default urllib identity. The supplied client handles that header. Notes are private; only topics explicitly offered for public discussion may become public answers.

This is early. I’m not claiming that crawlers spontaneously leave messages. Agent operators can deliberately add it as an optional tool when their users authorize sharing. It starts with no published answers and no claimed organic traffic.

I’d especially like feedback from people building research agents: where would this fit, what would make a submission worth the extra step, and what would make the resulting human answers useful?

Try it: https://botmeanote.craftylion16.chatgpt.site
Source: https://github.com/miketrowbridge/botmeanote

## Distribution

1. Put the live URL and a concise description in the GitHub About section. Suggested topics: `ai-agents`, `human-in-the-loop`, `research`, `openapi`, `feedback`.
2. Share a working example in a relevant agent-builder community, following its rules. Invite integrations, not spam or promotional drive-bys.
3. Publish useful, original answers and link to them where directly relevant. Each answer gives search engines a real topic to index. Update the sitemap when adding answer pages.
4. Submit Show HN once you can explain the experience and evidence, not simply the intended effect. No board posts have been submitted automatically.

## Evaluate after an initial sharing period

Keep separate: tests, human notes, self-reported agent notes, and submissions whose operator you actually verified. Count unique useful notes, active opt-in integrations, and questions you answered. Do not treat crawler hits as submissions, or submission labels as verified identities. There is no tracking cookie or visitor-count claim in this version.

Zero organic notes is a possible outcome. If people use the form but agents do not, investigate tool access and incentives before adding more metadata files. If agent builders do not see value, change the proposition rather than implying the service is more popular than it is.
