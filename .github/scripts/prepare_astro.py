"""Import the rendered, verified Jekyll content into the real ThoughtLite theme.

Jekyll remains a source adapter so historical Liquid and HTML stay lossless.
Astro owns the final HTML, native article lists, pagination, theme and sitemap.
"""
from pathlib import Path
from datetime import date, datetime, timezone, timedelta
import json
import re
import shutil
import yaml
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / '_site'
APP = ROOT / 'astro-site'
CONTENT = APP / 'src/content'
GENERATED = APP / 'src/generated'
PUBLIC = APP / 'public'


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding='utf-8')


def document(path):
    text = path.read_text(encoding='utf-8-sig')
    if not text.startswith('---'):
        return None
    return yaml.safe_load(text.split('---', 2)[1]) or {}


def timestamp(value, fallback):
    value = value or fallback
    if isinstance(value, datetime):
        parsed = value
    elif isinstance(value, date):
        parsed = datetime.combine(value, datetime.min.time())
    else:
        parsed = datetime.fromisoformat(str(value).replace('Z', '+00:00'))
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone(timedelta(hours=8)))
    return parsed


def prepare():
    if not (SITE / 'index.html').exists():
        raise SystemExit('Build Jekyll first; no content may be silently skipped.')
    for name in ['note', 'jotting', 'preface']:
        directory = CONTENT / name
        assert directory.resolve().is_relative_to(CONTENT.resolve())
        if directory.exists(): shutil.rmtree(directory)
        directory.mkdir(parents=True)
    GENERATED.mkdir(parents=True, exist_ok=True)
    aliases = {'/archive/': '/note/', '/essays/': '/jotting/'}
    counts = {}
    for source, collection, series in [('_posts', 'note', 'Writing'), ('_learning', 'note', 'Study'), ('_essays', 'jotting', None)]:
        counts[source] = 0
        for path in sorted((ROOT / source).iterdir()):
            if path.suffix not in {'.md', '.markdown', '.html'}:
                continue
            meta = document(path)
            if meta is None or meta.get('published') is False:
                continue
            match = re.match(r'(\d{4})-(\d{2})-(\d{2})-(.+)', path.stem)
            if source == '_posts':
                if not match:
                    raise ValueError(f'Unrecognized post filename: {path}')
                y, m, d, slug = match.groups()
                original = meta.get('permalink', f'/{y}/{m}/{d}/{slug}/')
            else:
                original = meta.get('permalink', f'/{source[1:]}/{path.stem}/')
            original = '/' + str(original).strip('/') + '/'
            built = SITE / original.lstrip('/') / 'index.html'
            if not built.exists():
                raise ValueError(f'Missing rendered source: {original}')
            soup = BeautifulSoup(built.read_text(encoding='utf-8'), 'html.parser')
            body = soup.select_one('.reading-content')
            if body is None:
                raise ValueError(f'Missing article body: {original}')
            identifier = (f'{series.lower()}/{path.stem}' if series else path.stem).lower()
            dest = f'/{collection}/{identifier}/'
            fallback = '-'.join(match.groups()[:3]) if match else meta.get('added', meta.get('source_date', '2026-10-02'))
            if not re.match(r'^\d{4}-\d{2}-\d{2}', str(fallback)):
                fallback = meta.get('added', '2026-10-02')
            header = {'title': str(meta.get('title', path.stem)), 'timestamp': timestamp(meta.get('date'), fallback), 'tags': meta.get('tags') or [], 'toc': False}
            header['importedWords'] = len(re.findall(r'[\u4e00-\u9fff]|[A-Za-z0-9]+', body.get_text(' ', strip=True)))
            if isinstance(header['tags'], str): header['tags'] = [header['tags']]
            if series: header['series'] = series
            if meta.get('description'): header['description'] = str(meta['description'])
            # Original comment path is retained inside the imported section.
            comments = soup.select_one('#article-comments')
            html = body.decode_contents()
            if source == '_learning':
                credits = soup.select_one('.learning-source')
                if credits: html = str(credits) + html
            if source == '_essays' and meta.get('issue_url'):
                from html import escape
                html += '<p><a rel="noopener noreferrer" href="' + escape(meta['issue_url'], quote=True) + '">原始记录 ↗</a></p>'
            if comments: html += '<div class="legacy-content">' + str(comments) + '</div>'
            write(CONTENT / collection / f'{identifier}.md', '---\n' + yaml.safe_dump(header, allow_unicode=True, sort_keys=False) + '---\n\n' + html + '\n')
            aliases[original] = dest
            counts[source] += 1

    home = BeautifulSoup((SITE / 'index.html').read_text(encoding='utf-8'), 'html.parser')
    widget_ids = ['global-music', 'music-reopen', 'search-open', 'search-dialog', 'blog-agent-config', 'blog-agent-open', 'blog-agent-dialog', 'search-index']
    widgets = []
    for identifier in widget_ids:
        widget = home.find(id=identifier)
        if widget is None: raise ValueError(f'Missing global widget: {identifier}')
        for link in widget.select('a[href]'):
            if link['href'] in aliases: link['href'] = aliases[link['href']]
        widgets.append(str(widget))
    for selector in ['.site-status', '.visit-stats']:
        if home.select_one(selector): widgets.append(str(home.select_one(selector)))
    write(GENERATED / 'widgets.html', '\n'.join(widgets))

    pages = []
    reserved = {'/', '/note/', '/jotting/', '/preface/', '/policy/', '/learning/', '/404/', '/500/', '/404.html', '/500.html', '/feed.xml/'}
    for path in SITE.rglob('*.html'):
        relative = path.relative_to(SITE).as_posix()
        route = '/' + relative[:-10] if relative.endswith('index.html') else '/' + relative
        if route in reserved or route in aliases: continue
        soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
        main = soup.select_one('#page-content')
        if main is None: continue
        for script in main.select('script'): script.decompose()
        for link in main.select('link[rel="stylesheet"]'): link.decompose()
        for style in main.select('style'):
            style.string = '@scope (.legacy-content) { ' + style.get_text() + ' }'
        pages.append({'path': route.strip('/'), 'title': soup.title.get_text().split(' · determine')[0] if soup.title else 'determine', 'html': main.decode_contents()})
    write(GENERATED / 'pages.json', json.dumps(pages, ensure_ascii=False))
    write(GENERATED / 'aliases.json', json.dumps([{'path': key.strip('/'), 'target': value} for key, value in aliases.items()], ensure_ascii=False))

    # Only publish files from the public Jekyll artifact, never the source checkout.
    for path in SITE.rglob('*'):
        if not path.is_file() or path.suffix == '.html': continue
        rel = path.relative_to(SITE)
        if rel.as_posix() in {'feed.xml', 'sitemap.xml', 'robots.txt'}: continue
        dest = PUBLIC / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, dest)
    styles = ['personal.css', 'editorial.css', 'minimal.css', 'section-pages.css', 'footprints.css', 'journey-318.css', 'about-profile.css', 'friends.css', 'record-walls.css', 'chapter-notes.css', 'guestbook-demo.css']
    scoped = '\n'.join((SITE / 'css' / name).read_text(encoding='utf-8') for name in styles if (SITE / 'css' / name).exists())
    write(PUBLIC / 'legacy-scoped.css', '@scope (.legacy-content) {\n' + scoped + '\n}\n')
    comments_script = PUBLIC / 'js/comments.js'
    write(comments_script, comments_script.read_text(encoding='utf-8').replace('html[data-theme="night"]', 'html[data-theme="dark"]'))
    # Leaflet creates its own elements and needs its original unscoped library stylesheet.
    write(GENERATED / 'migration.json', json.dumps({'counts': counts, 'legacy_pages': len(pages), 'aliases': len(aliases)}, indent=2))
    write(CONTENT / 'preface/introduction.md', '---\ntimestamp: 2026-10-22T00:00:00+08:00\n---\n\n你好，我是 **determine**。上海交通大学硕士在读，成都理工大学本科。\n\n关注 LLM Agent、AI Infra 与具身智能，记录项目实践、阅读笔记，以及骑行路上的见闻。\n\n[GitHub](https://github.com/determine123) · [Email](mailto:determine@sjtu.edu.cn) · [Bilibili](https://space.bilibili.com/1553355526) · 抖音：ltm1524001843\n')
    print(json.dumps({'imported': counts, 'legacy_pages': len(pages), 'aliases': len(aliases)}, ensure_ascii=False))


if __name__ == '__main__':
    prepare()
