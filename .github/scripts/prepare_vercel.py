"""Package the already-built Jekyll site for Vercel's Build Output API."""
from pathlib import Path
import json
import shutil


def prepare(source: Path, output: Path) -> None:
    """Copy rendered site files to Vercel's v3 static output directory."""
    if not (source / "index.html").is_file():
        raise SystemExit("Build the Jekyll site before preparing the Vercel output.")
    if output.exists():
        raise SystemExit("Vercel output already exists; use a fresh build directory.")

    static = output / "static"
    static.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source, static)
    (output / "config.json").write_text(
        json.dumps({"version": 3}, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    prepare(Path("_site"), Path(".vercel/output"))
    print("Prepared the rendered Jekyll site as a Vercel v3 static output.")
