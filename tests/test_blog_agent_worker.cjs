const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync('workers/blog-agent/src/index.js', 'utf8');
const origin = 'https://determine123.github.io';
const env = { ALLOWED_ORIGIN: origin, ZHIPU_API_KEY: 'test-secret' };

async function loadWorker() {
  const encoded = Buffer.from(source).toString('base64');
  return (await import(`data:text/javascript;base64,${encoded}`)).default;
}

test('preflight permits only the configured blog origin', async () => {
  const worker = await loadWorker();
  const ok = await worker.fetch(new Request('https://agent.example/api/agent', {
    method: 'OPTIONS', headers: { origin },
  }), env);
  assert.equal(ok.status, 204);
  assert.equal(ok.headers.get('access-control-allow-origin'), origin);

  const denied = await worker.fetch(new Request('https://agent.example/api/agent', {
    method: 'OPTIONS', headers: { origin: 'https://attacker.example' },
  }), env);
  assert.equal(denied.status, 403);
});

test('chat uses the free GLM Flash model and never returns the provider key', async (t) => {
  const worker = await loadWorker();
  const originalFetch = global.fetch;
  let upstreamRequest;
  global.fetch = async (url, options) => {
    upstreamRequest = { url, options, body: JSON.parse(options.body) };
    return Response.json({ choices: [{ message: { content: '你好，博客访客。' } }] });
  };
  t.after(() => { global.fetch = originalFetch; });

  const response = await worker.fetch(new Request('https://agent.example/api/agent', {
    method: 'POST', headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify({ message: '介绍项目', history: [{ role: 'user', content: '我在看博客' }], context: [
      { title: '项目目录', url: `${origin}/projects/` },
      { title: 'untrusted external page', url: 'https://attacker.example/fake' },
    ] }),
  }), env);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.answer, '你好，博客访客。');
  assert.equal(data.model, 'glm-4.7-flash');
  assert.equal(JSON.stringify(data).includes(env.ZHIPU_API_KEY), false);
  assert.equal(upstreamRequest.url, 'https://open.bigmodel.cn/api/paas/v4/chat/completions');
  assert.equal(upstreamRequest.options.headers.authorization, `Bearer ${env.ZHIPU_API_KEY}`);
  assert.equal(upstreamRequest.body.model, 'glm-4.7-flash');
  assert.match(upstreamRequest.body.messages[0].content, /项目目录/);
  assert.doesNotMatch(upstreamRequest.body.messages[0].content, /untrusted external page/);
  assert.deepEqual(upstreamRequest.body.messages[1], { role: 'user', content: '我在看博客' });
});

test('rejects foreign origins, malformed bodies, and oversized questions', async () => {
  const worker = await loadWorker();
  const foreign = await worker.fetch(new Request('https://agent.example/api/agent', {
    method: 'POST', headers: { origin: 'https://attacker.example', 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'hello' }),
  }), env);
  assert.equal(foreign.status, 403);

  const oversized = await worker.fetch(new Request('https://agent.example/api/agent', {
    method: 'POST', headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'x'.repeat(501) }),
  }), env);
  assert.equal(oversized.status, 400);

  const noKey = await worker.fetch(new Request('https://agent.example/api/agent', {
    method: 'POST', headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'hello' }),
  }), { ALLOWED_ORIGIN: origin });
  assert.equal(noKey.status, 503);

  const tooLarge = await worker.fetch(new Request('https://agent.example/api/agent', {
    method: 'POST', headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'ok', context: [{ title: 'x'.repeat(9000), url: `${origin}/` }] }),
  }), env);
  assert.equal(tooLarge.status, 413);
});

test('limits requests within a worker isolate', async () => {
  const worker = await loadWorker();
  const originalFetch = global.fetch;
  global.fetch = async () => Response.json({ choices: [{ message: { content: 'ok' } }] });
  try {
    const request = () => worker.fetch(new Request('https://agent.example/api/agent', {
      method: 'POST', headers: { origin, 'content-type': 'application/json', 'cf-connecting-ip': '198.51.100.7' },
      body: JSON.stringify({ message: 'hello' }),
    }), env);
    for (let i = 0; i < 12; i++) assert.equal((await request()).status, 200);
    assert.equal((await request()).status, 429);
  } finally { global.fetch = originalFetch; }
});
