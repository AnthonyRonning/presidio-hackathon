Presidio Bitcoin Hackathon — Everything You Need to Know

A deep-dive prep guide focused on the technical content, partner tooling, and how to turn all of it into a winning project.

⸻

1. Core theme & vision

The hackathon’s single mandate is “build on Bitcoin”—with Lightning, Nostr, and AI as the obvious playgrounds. Organizers want projects that demonstrate real-world utility, novel user experiences, or imaginative “vibe-coding” experiments that still run on mainnet or testnet Bitcoin.

⸻

2. How participation is structured

| Track | What it actually means for builders |
|-------|-------------------------------------|
| Development Track | Full creative freedom. Any stack or coding style is fine as long as the end product uses Bitcoin on-chain or Lightning. |
| Educational Track | A rolling series of mini-workshops (Lightning integrations, OpenAgents, Nostr Wallet Connect, etc.). You can hop in for quick demos, grab example repos, then head back to hacking. |

Tip: You can bounce between tracks—start in a workshop to grab a starter kit, then migrate to dev mode once you’ve cloned the example.

⸻

3. Deliverables, judging, and how to score points

| Requirement | Notes |
|-------------|-------|
| 1-minute demo video | Deadline Saturday 17 May 17 @ 17:00; judges watch these first. |
| Science-fair booth | One-minute live pitch while judges circulate. |
| Top-5 finals | 3-5 min stage demo; live-streamed with Lightning-powered audience voting. |
| Judging criteria | Routine Difficulty (ambition), Routine Execution (technical merit), General Effect (polish/creativity). |
| Prizes | $10 k cash plus category awards (Best Beginner, Crowd Favorite, Most Sci-Fi/Creative). Exceptional teams may get a 3-month Presidio Bitcoin membership. |

Scoring insight: Judges explicitly reward novel Lightning uses, on-chain AI payment flows, and projects that feel “production-ready.” A slick UI/UX and clear README matter.

⸻

4. Partner technology stack & where to find docs

| Partner / SDK | Why it matters | Fast-track resources |
|---------------|----------------|----------------------|
| Lightspark SDK | Enterprise-grade Lightning API. Instantly spin up nodes, decode/encode invoices, or issue LNURL withdrawals without running LND. | Dev portal & quick-start guides |
| Bitcoin Dev Kit (BDK) & Lightning Dev Kit (LDK) (Spiral / Block) | Modular Rust libs for building wallets or embedded Lightning nodes; ideal for non-custodial mobile or IoT demos. | Docs & GitHub |
| Nostr Wallet Connect (NWC) (Alby) | Open protocol (NIP-47) for letting any app control a remote Lightning wallet via Nostr events—perfect for friction-free pay-per-use APIs. | NWC docs, JS SDK, Alby API guides |
| Alby SDK & Wallet API | Browser-friendly WebLN/WebBTC helpers; OAuth-style Lightning auth; lightning-address proxy endpoints—great for web apps. | Dev guide |
| Fewsats L402 Toolkit | Implements Lightning-authenticated paywalls (macaroon-style). Comes with a Python SDK + "as_tools()" helpers for autonomous AI agents. | Awesome-L402 list, Python package docs |
| Lexe SDK | SGX-backed, always-online self-custodial wallet with a BOLT 12 "tip-box" flow—great drop-in for 24/7 inbound payments. | Product site & SDK teaser |
| OpenAgents Platform | Agentic chat & payments API; integrates Bitcoin/Lightning so your AI agents can earn or spend sats. | GitHub + docs |

Integration hint: Use at least one sponsor SDK in a differentiated way (e.g., Lightspark for instant channel-less payments plus Fewsats L402 for access control). That synergy tends to win category prizes.

⸻

5. Developer support on-site
	•	Mini-workshops: Sponsors walk through sample repos (e.g., “Integrate Lightspark in 15 min”, “NWC JS crash course”).
	•	Mentor tables: LDK & Fewsats engineers on call for design reviews and debugging.
	•	Lightning voting system tutorial: Friday night demo covers how to expose your project ID as a BOLT-11 invoice so friends can boost you during finals.

⸻

6. Strategy tips for maximizing points
	1.	Lead with novelty: Combine AI inference or autonomous agents and Lightning money flows (few teams will).
	2.	Ship something runnable: A live demo on a phone or laptop beats slides. Judges emphasize execution.
	3.	Polish counts: Custom logo, clean README, and that 1-minute video rehearsed to the second.
	4.	Use Lightning in the pitch: Show a payment or NWC handshake live. Audience and judges remember it.
	5.	Leverage audience sats: Encourage remote friends to boost you during Lightning voting—crowd-favorite is its own prize bucket.

⸻

7. Example project ideas (steal / remix as needed)

| Idea | Stack highlights |
|------|------------------|
| "Pay-As-You-Use LLM" micro-API | vLLM behind an L402 paywall (Fewsats SDK) + Lightspark invoice flow; users buy 100 tokens with sats. |
| "Nostr-Native Patreon" | Creators publish encrypted posts; fans unlock via NWC payment. Uses Alby NostrWebLNProvider + LNURLp. |
| "Lexe-Powered Offline Vending IoT" | ESP32 vending machine calls Lexe SDK; BOLT 12 offer shown as QR; dispense on payment confirmed. |
| "Agent Market Board" | OpenAgents agents that charge sats for coding help; payouts routed via Lightspark Connect. |
| "Gamified Energy Saver" | Home IoT devices report kWh saved; rewards streamed in sats via LDK Node running locally. |
| "AI-Generated Art Auction" | Mint AI images; highest Lightning bid (live order book) wins; settlement via Lightspark; metadata stored on Nostr. |


⸻

Quick prep checklist
	•	Clone starter repos for Lightspark, Fewsats, and NWC before the event.
	•	Install Rust toolchain (for BDK/LDK) and Node 18+ (for web/TS demos).
	•	Generate a Lightning testnet wallet and practice invoice decode/encode flows.
	•	Draft your 60-second pitch script now—compressing later is hard.
	•	Reserve domain / Git repo name so you can push the second you’re done.

Good luck—see you in the finals!
