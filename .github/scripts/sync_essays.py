"""Publish only the repository owner's open [随笔] issues as blog entries."""
import html
import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
ZONE = timezone(timedelta(hours=8))

def render(issue, owner):
    if 'pull_request' in issue or issue['user']['login'] != owner or issue['state'] != 'open' or not issue['title'].startswith('[随笔]'):
        return None
    title = issue['title'][len('[随笔]'):].strip() or '未命名随笔'
    body = (issue.get('body') or '').strip()
    if body.startswith('### 正文'):
        body = body[len('### 正文'):].strip()
    if not body or body == '_No response_':
        return None
    # Preserve Markdown while rendering embedded HTML as text and disabling Liquid.
    body = html.escape(body, quote=False).replace('{%', '{&#37;')
    created = datetime.fromisoformat(issue['created_at'].replace('Z', '+00:00')).astimezone(ZONE)
    meta = dict(layout='essay',title=title,date=created.isoformat(),author='determine',issue_url=issue['html_url'],issue_number=issue['number'])
    header = '\n'.join(key + ': ' + json.dumps(value, ensure_ascii=False) for key, value in meta.items())
    return '---\n' + header + '\n---\n\n{% raw %}\n' + body + '\n{% endraw %}\n'

def fetch_issues(repo, token):
    page = 1
    while True:
        url = f'https://api.github.com/repos/{repo}/issues?state=all&per_page=100&page={page}'
        request = Request(url, headers={'Authorization': f'Bearer {token}', 'Accept': 'application/vnd.github+json', 'User-Agent': 'determine-essay-publisher'})
        with urlopen(request, timeout=30) as response:
            items = json.load(response)
        yield from items
        if len(items) < 100:
            return
        page += 1

def main():
    repo = os.environ['GITHUB_REPOSITORY']
    owner = repo.split('/')[0]
    # Fetch all pages before modifying any generated files.
    issues = list(fetch_issues(repo, os.environ['GH_TOKEN']))
    generated = {}
    for issue in issues:
        content = render(issue, owner)
        if content:
            generated[f'issue-{int(issue["number"])}.md'] = content
    directory = ROOT / '_essays'
    directory.mkdir(exist_ok=True)
    for path in directory.glob('issue-*.md'):
        if path.name not in generated:
            path.unlink()
    for name, content in generated.items():
        (directory/name).write_text(content, encoding='utf-8')
    print(f'Synced {len(generated)} public essays.')

if __name__ == '__main__':
    main()
