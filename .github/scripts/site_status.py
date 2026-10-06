"""Generate public timestamps from the checked-out commit, never visitor data."""
import datetime
import json
import subprocess
from pathlib import Path

updated = subprocess.check_output(['git', 'show', '-s', '--format=%cI', 'HEAD'], text=True).strip()
datetime.datetime.fromisoformat(updated)
commit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], text=True).strip()
Path('site-status.json').write_text(json.dumps({
    'startedAt': '2026-09-02T06:11:24Z',
    'startEvidence': 'First successful recorded Jekyll Pages workflow, run 2',
    'updatedAt': updated,
    'commit': commit,
}, ensure_ascii=False), encoding='utf-8')
