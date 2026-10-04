"""Refresh a public repository directory without persisting account credentials."""
import argparse
import json
import os
import tempfile
import re
from pathlib import Path
from urllib.request import Request, urlopen


def fetch_json(url):
    headers={'Accept':'application/vnd.github+json','User-Agent':'public-project-directory'}
    if os.environ.get('GITHUB_TOKEN'):
        headers['Authorization']='Bearer '+os.environ['GITHUB_TOKEN']
    request=Request(url,headers=headers)
    with urlopen(request,timeout=30) as response:
        return json.load(response)


def collect(user,fetch=fetch_json):
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9-]{0,38}',user):
        raise ValueError('Invalid GitHub username')
    records={}
    page=1
    while True:
        rows=fetch(f'https://api.github.com/users/{user}/repos?type=owner&per_page=100&page={page}')
        if not isinstance(rows,list):
            raise ValueError('GitHub did not return a repository list')
        for row in rows:
            if row.get('private') or row['owner']['login'].lower()!=user.lower():
                continue
            name=row['name']
            # Build the known GitHub URL rather than copying an arbitrary response URL.
            records[name]={
                'name':name,'html_url':f'https://github.com/{user}/{name}',
                'description':row.get('description'),'language':row.get('language'),
                'fork':bool(row['fork']),'archived':bool(row['archived']),
            }
        if len(rows)<100:
            break
        page+=1
    if not records:
        raise ValueError('Empty public directory; existing data will not be overwritten')
    return sorted(records.values(),key=lambda r:(r['fork'],r['name'].lower()))


def refresh(user,path,fetch=fetch_json):
    records=collect(user,fetch)
    # Fetch every page successfully before replacing the published directory.
    temporary=None
    try:
        with tempfile.NamedTemporaryFile(mode='w',encoding='utf-8',dir=path.parent,prefix='.projects-',suffix='.tmp',delete=False) as handle:
            temporary=Path(handle.name)
            handle.write(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
        temporary.replace(path)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()
    return len(records)


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--user',default='determine123')
    args=parser.parse_args()
    target=Path(__file__).resolve().parents[1]/'_data/github_projects.json'
    try:
        count=refresh(args.user,target)
    except Exception as error:
        parser.exit(1,'Directory unchanged: '+str(error)+'\n')
    print(f'Refreshed {count} public repositories for {args.user}.')
