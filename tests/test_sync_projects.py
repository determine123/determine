import importlib.util
import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('sync_projects',Path(__file__).resolve().parents[1]/'scripts/sync_projects.py')
sync=importlib.util.module_from_spec(spec);spec.loader.exec_module(sync)


def repo(name,fork=False,private=False):
    return {'name':name,'owner':{'login':'determine123'},'private':private,'fork':fork,'archived':False,'description':'A public project','language':'Python'}


class DirectoryTests(unittest.TestCase):
    def test_public_only_and_fork_labels(self):
        records=sync.collect('determine123',lambda url:[repo('Fork',True),repo('Hidden',private=True),repo('Forum')])
        self.assertEqual([x['name'] for x in records],['Forum','Fork'])
        self.assertFalse(records[0]['fork']);self.assertTrue(records[1]['fork'])
        self.assertNotIn('private',json.dumps(records))

    def test_second_page_failure_preserves_previous_directory(self):
        with TemporaryDirectory() as folder:
            p=Path(folder)/'data.json';p.write_text('existing',encoding='utf-8')
            def fetch(url):
                if url.endswith('page=1'):return [repo('Project'+str(n)) for n in range(100)]
                raise OSError('network interruption')
            with self.assertRaises(OSError):sync.refresh('determine123',p,fetch)
            self.assertEqual(p.read_text(),'existing')

    def test_empty_response_cannot_erase_existing_data(self):
        with TemporaryDirectory() as folder:
            p=Path(folder)/'data.json';p.write_text('existing',encoding='utf-8')
            with self.assertRaises(ValueError):sync.refresh('determine123',p,lambda url:[])
            self.assertEqual(p.read_text(),'existing')

    def test_failed_replace_keeps_original_and_cleans_temporary_file(self):
        with TemporaryDirectory() as folder:
            p=Path(folder)/'data.json';p.write_text('existing',encoding='utf-8')
            with patch.object(Path,'replace',side_effect=PermissionError('file locked')):
                with self.assertRaises(PermissionError):sync.refresh('determine123',p,lambda url:[repo('Forum')])
            self.assertEqual(p.read_text(),'existing')
            self.assertEqual([x.name for x in Path(folder).iterdir()],['data.json'])

    def test_all_pages_are_collected(self):
        urls=[]
        def fetch(url):
            urls.append(url)
            return [repo('Project'+str(n)) for n in range(100)] if url.endswith('page=1') else [repo('Last')]
        self.assertEqual(len(sync.collect('determine123',fetch)),101)
        self.assertEqual(len(urls),2)


if __name__=='__main__':unittest.main()

