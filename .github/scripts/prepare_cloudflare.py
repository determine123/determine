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
(target / '_redirects').write_text('/ /determine/ 302\n', encoding='utf-8')
(target / '_headers').write_text('''/determine/js/*
  Cache-Control: public, max-age=86400
/determine/css/*
  Cache-Control: public, max-age=86400
/determine/img/*
  Cache-Control: public, max-age=86400
''', encoding='utf-8')
print('Prepared Workers assets with the existing /determine/ links intact.')
