# determine blog Agent API

This Cloudflare Worker keeps the Zhipu credential server-side and proxies bounded chat requests to the official `glm-4.7-flash` chat-completions API. The Worker accepts requests only from `https://determine123.github.io`, sends only the visitor's current question plus matching public blog titles/URLs, and does not persist conversation data. A best-effort per-isolate IP limit allows 12 requests per minute; Cloudflare may run many isolates, so configure additional edge rate limiting before attracting significant traffic.

## Deploy

1. Create a Zhipu BigModel API key in your own account. Never paste it into chat, Git, GitHub Pages, or `_data/blog_agent.yml`.
2. Install Node.js, then run `npx wrangler login` in this directory and authorize your Cloudflare account.
3. From `workers/blog-agent`, upload the key as an encrypted Worker secret: `npx wrangler secret put ZHIPU_API_KEY --config wrangler.toml`.
4. Deploy: `npx wrangler deploy --config wrangler.toml`.
5. Check the printed `workers.dev` URL with `/health`. The chat endpoint is `/api/agent`.
6. Put the endpoint URL (ending in `/api/agent`) in `_data/blog_agent.yml` under `endpoint`, commit, and push the site. The website then discloses that messages are sent to Zhipu before a visitor chats.

The free GLM Flash offering still has provider quotas and service limits. The Worker adds basic request validation, an output-token cap, a timeout, origin checks, and an in-memory abuse limit; it is a lightweight personal-site endpoint, not a hardened public multi-tenant API. Review Zhipu's terms and privacy policy before enabling it for public visitors.

## Verify locally

From the repository root, run:

```sh
node --test tests/test_blog_agent_worker.cjs
```
