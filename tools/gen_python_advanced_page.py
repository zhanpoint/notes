"""Regenerate page/Python/Python进阶.html from D:\\PKB\\2.Interview\\1.Python (*.md) as rendered HTML."""
from __future__ import annotations

import os
import re

import markdown

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "page", "Python", "Python进阶.html")
PKB_DIR = r"D:\PKB\2.Interview\1.Python"


def ordered_md_files() -> list[str]:
    names = [f for f in os.listdir(PKB_DIR) if f.endswith(".md")]
    return sorted(names, key=lambda x: int(x.split(".")[0]))


def deepen_two_space_nested_list_items(raw: str) -> str:
    """Promote `  - item` to `    - item` so CommonMark / Python-Markdown nests under parent `-` items."""
    chunks = re.split(r"(^```[\s\S]*?^```)", raw, flags=re.MULTILINE)
    out: list[str] = []
    for chunk in chunks:
        if chunk.startswith("```"):
            out.append(chunk)
        else:
            out.append(re.sub(r"^  - ", "    - ", chunk, flags=re.MULTILINE))
    return "".join(out)


def normalize_bold_heading_lines(raw: str) -> str:
    """Close `**title：` only when the title is the entire list item / line (PKB typos)."""

    def fix_line(line: str) -> str:
        m = re.match(r"^(\s*-\s+)(\*\*)([^*\n]+)：\s*$", line)
        if m:
            return f"{m.group(1)}{m.group(2)}{m.group(3)}**："
        m = re.match(r"^(\*\*)([^*\n]+)：\s*$", line)
        if m:
            return f"{m.group(1)}{m.group(2)}**："
        return line

    return "\n".join(fix_line(line) for line in raw.split("\n"))


def md_to_html_fragment(raw: str) -> str:
    raw = normalize_bold_heading_lines(raw)
    raw = deepen_two_space_nested_list_items(raw)
    md = markdown.Markdown(
        extensions=[
            "markdown.extensions.extra",
            "markdown.extensions.sane_lists",
        ],
    )
    inner = md.convert(raw)
    # Match Python基础.html emphasis tags
    inner = inner.replace("<strong>", "<b>").replace("</strong>", "</b>")
    inner = inner.replace("<em>", "<i>").replace("</em>", "</i>")
    inner = re.sub(
        r"(<table>\s*[\s\S]*?</table>)",
        r'<div class="tw-scroll-x">\1</div>',
        inner,
    )
    inner = inner.strip()
    return inner


def build_page(fragments: list[tuple[str, str]]) -> str:
    blocks: list[str] = []
    for summary, html_inner in fragments:
        blocks.append("      <details>\n")
        blocks.append(f"        <summary>{summary}</summary>\n")
        blocks.append('        <div class="content">\n')
        blocks.append("          ")
        blocks.append(html_inner.replace("\n", "\n          "))
        blocks.append("\n        </div>\n")
        blocks.append("      </details>\n")

    head = """<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Python 进阶</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="../../assets/page-tailwind.css" />
  <link rel="stylesheet" href="../../assets/svg-diagrams.css" />
  <script defer src="../../assets/page-shell.js"></script>
</head>
<body>
  <div class="container">
    <header class="page-head">
      <h1>Python 进阶</h1>
    </header>

    <section class="qa-list">
"""

    foot = """    </section>
  </div>
</body>
</html>
"""
    return head + "".join(blocks) + foot


def main() -> None:
    fragments: list[tuple[str, str]] = []
    for name in ordered_md_files():
        path = os.path.join(PKB_DIR, name)
        with open(path, encoding="utf-8") as f:
            raw = f.read()
        summary = name[:-3] if name.endswith(".md") else name
        body = md_to_html_fragment(raw)
        fragments.append((summary, body))

    text = build_page(fragments)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print(f"Wrote {OUT} ({len(fragments)} sections)")


if __name__ == "__main__":
    main()
