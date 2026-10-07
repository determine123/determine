"""Publish only the repository owner's open [随笔] issues as blog entries."""
import html
import json
import os
import re
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
ZONE = timezone(timedelta(hours=8))

class ImageTag(HTMLParser):
    """Read image attributes without retaining executable HTML attributes."""

    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            self.attrs = dict(attrs)


IMAGE_TAG = re.compile(r'''<img\b(?:[^>"']|"[^"]*"|'[^']*')*>''', re.IGNORECASE)
CODE_SPAN = re.compile(r'(`+)(?!`)(.+?)(?<!`)\1(?!`)', re.DOTALL)


def render_image(match):
    original = match.group(0)
    parser = ImageTag()
    parser.feed(original)
    attrs = getattr(parser, 'attrs', {})
    src = attrs.get('src') or ''
    try:
        url = urlsplit(src)
        allowed = url.scheme == 'https' and bool(url.hostname) and not any(c.isspace() or ord(c) < 32 for c in src)
    except ValueError:
        allowed = False
    if not allowed:
        return html.escape(original, quote=False)
    # GitHub uploads use HTML images. Keep only safe display attributes.
    clean = {'src': src, 'alt': attrs.get('alt') or '', 'loading': 'lazy', 'decoding': 'async'}
    for dimension in ('width', 'height'):
        value = attrs.get(dimension) or ''
        if re.fullmatch(r'[1-9][0-9]{0,4}', value):
            clean[dimension] = value
    return '<img ' + ' '.join(key + '="' + html.escape(value, quote=True) + '"' for key, value in clean.items()) + ' />'


def escape_prose(text):
    parts = []
    end = 0
    for match in IMAGE_TAG.finditer(text):
        parts.append(html.escape(text[end:match.start()], quote=False))
        parts.append(render_image(match))
        end = match.end()
    parts.append(html.escape(text[end:], quote=False))
    return ''.join(parts)


def prepare_body(body):
    """Preserve uploaded images, but keep other HTML and code examples inert."""
    output = []
    prose = []
    fence = None

    def flush():
        text = ''.join(prose)
        end = 0
        for match in CODE_SPAN.finditer(text):
            output.append(escape_prose(text[end:match.start()]))
            output.append(html.escape(match.group(0), quote=False))
            end = match.end()
        output.append(escape_prose(text[end:]))
        prose.clear()

    for line in body.splitlines(keepends=True):
        marker = re.match(r'^ {0,3}(`{3,}|~{3,})(.*)$', line.rstrip('\r\n'))
        if fence:
            output.append(html.escape(line, quote=False))
            if marker and marker[1][0] == fence[0] and len(marker[1]) >= len(fence) and not marker[2].strip():
                fence = None
        elif marker:
            flush()
            fence = marker[1]
            output.append(html.escape(line, quote=False))
        elif line.startswith(('    ', '\t')):
            flush()
            output.append(html.escape(line, quote=False))
        else:
            prose.append(line)
    flush()
    # A user-supplied endraw must not break out of render()'s Liquid wrapper.
    return ''.join(output).replace('{%', '{&#37;')


def render(issue, owner):
    if 'pull_request' in issue or issue['user']['login'] != owner or issue['state'] != 'open' or not issue['title'].startswith('[随笔]'):
        return None
    title = issue['title'][len('[随笔]'):].strip() or '未命名随笔'
    body = (issue.get('body') or '').strip()
    if body.startswith('### 正文'):
        body = body[len('### 正文'):].strip()
    if not body or body == '_No response_':
        return None
    body = prepare_body(body)
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
