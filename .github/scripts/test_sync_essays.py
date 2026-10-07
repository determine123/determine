"""Regression checks for Issue-uploaded images and inert HTML/code."""
import unittest

from sync_essays import prepare_body, render


class EssayImagesTest(unittest.TestCase):
    def test_uploaded_image_and_surrounding_markdown(self):
        body = '**Before**\n<img width="1440" height="1920" alt="photo" src="https://github.com/user-attachments/assets/photo" />\nAfter'
        result = prepare_body(body)
        self.assertIn('**Before**', result)
        self.assertIn('<img src="https://github.com/user-attachments/assets/photo"', result)
        self.assertIn('width="1440" height="1920"', result)
        self.assertIn('loading="lazy"', result)
        self.assertTrue(result.endswith('After'))

    def test_only_safe_attributes_and_urls(self):
        result = prepare_body('<img src="https://example.com/p?a=1&amp;b=2" alt="a &quot;b&quot;" onerror="alert(1)" style="position:fixed" width="99%">')
        self.assertIn('src="https://example.com/p?a=1&amp;b=2"', result)
        self.assertIn('alt="a &quot;b&quot;"', result)
        self.assertNotIn('onerror', result)
        self.assertNotIn('style=', result)
        self.assertNotIn('width=', result)
        for src in ('javascript:alert(1)', 'data:image/svg+xml,test', '//example.com/p', 'https://[broken', 'https://example.com/\nphoto'):
            with self.subTest(src=src):
                self.assertNotIn('<img ', prepare_body(f'<img src="{src}">'))

    def test_other_html_and_liquid_stay_inert(self):
        result = prepare_body('<script>alert(1)</script>\n{% endraw %}{% include secret %}')
        self.assertNotIn('<script>', result)
        self.assertNotIn('{%', result)
        self.assertIn('&lt;script&gt;', result)

    def test_code_examples_are_not_images(self):
        tag = '<img src="https://example.com/photo">'
        for body in (f'`{tag}`', f'```html\n{tag}\n```', f'~~~html\n{tag}\n~~~', f'    {tag}'):
            with self.subTest(body=body):
                self.assertNotIn('<img ', prepare_body(body))
        self.assertIn('<img ', prepare_body(f'```html\n{tag}\n```\n\n{tag}'))

    def test_publication_rules_and_metadata(self):
        issue = dict(user={'login': 'owner'}, state='open', title='[随笔] A', body='### 正文\n\n<img src="https://example.com/p">', created_at='2026-10-07T12:33:14Z', html_url='https://github.com/owner/repo/issues/2', number=2)
        result = render(issue, 'owner')
        self.assertIn('date: "2026-10-07T20:33:14+08:00"', result)
        self.assertIn('<img ', result)
        self.assertNotIn('### 正文', result)
        self.assertIsNone(render(issue, 'other'))
        self.assertIsNone(render(dict(issue, state='closed'), 'owner'))
        self.assertIsNone(render(dict(issue, title='Private'), 'owner'))


if __name__ == '__main__':
    unittest.main()
