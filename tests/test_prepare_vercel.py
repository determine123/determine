import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / ".github" / "scripts"))
from prepare_vercel import prepare


class PrepareVercelTests(unittest.TestCase):
    def test_copies_rendered_site_into_v3_static_output(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            source = root / "_site"
            source.mkdir()
            (source / "index.html").write_text("<title>Rendered</title>", encoding="utf-8")
            (source / "learning").mkdir()
            (source / "learning" / "index.html").write_text("Study", encoding="utf-8")
            output = root / ".vercel" / "output"

            prepare(source, output)

            self.assertEqual(
                json.loads((output / "config.json").read_text(encoding="utf-8")),
                {"version": 3},
            )
            self.assertEqual(
                (output / "static" / "index.html").read_text(encoding="utf-8"),
                "<title>Rendered</title>",
            )
            self.assertEqual(
                (output / "static" / "learning" / "index.html").read_text(encoding="utf-8"),
                "Study",
            )

    def test_requires_a_built_jekyll_site(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            with self.assertRaises(SystemExit):
                prepare(root / "missing", root / ".vercel" / "output")


if __name__ == "__main__":
    unittest.main()
