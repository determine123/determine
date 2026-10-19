"""Package the exact Pages build as a Workers static-assets mirror."""
from pathlib import Path
import shutil

source = Path('_site')
target = Path('.cloudflare-site')
if not (source / 'index.html').is_file():
    raise SystemExit('Build the Jekyll site before packaging.')
if target.exists():
    raise SystemExit('Use a fresh output directory for each build.')
shutil.copytree(source, target / 'determine')
shutil.copyfile(source / '404.html', target / '404.html')
(target / 'index.html').write_text('''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0;url=/determine/"><link rel="canonical" href="/determine/">
<title>determine</title></head><body><p><a href="/determine/">进入 determine 的个人博客</a></p></body></html>
''', encoding='utf-8')
(target / '_redirects').write_text('/ /determine/ 302\n', encoding='utf-8')
(target / '_headers').write_text('''/determine/js/*
  Cache-Control: public, max-age=86400
/determine/css/*
  Cache-Control: public, max-age=86400
/determine/img/*
  Cache-Control: public, max-age=86400
''', encoding='utf-8')
print('Prepared Workers assets with the existing /determine/ links intact.')
