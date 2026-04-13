"""Regenerate page/计算机系统/计算机系统.html from D:\\PKB\\2.Interview\\2.CS (*.md) — same pipeline as Python进阶."""
from __future__ import annotations

import html as html_lib
import os
import re

import markdown

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "page", "计算机系统", "计算机系统.html")
PKB_DIR = r"D:\PKB\2.Interview\2.CS"
PAGE_TITLE = "计算机系统"


def ordered_md_files() -> list[str]:
    names = [f for f in os.listdir(PKB_DIR) if f.endswith(".md")]
    return sorted(names, key=lambda x: int(x.split(".")[0]))


def deepen_two_space_nested_list_items(raw: str) -> str:
    chunks = re.split(r"(^```[\s\S]*?^```)", raw, flags=re.MULTILINE)
    out: list[str] = []
    for chunk in chunks:
        if chunk.startswith("```"):
            out.append(chunk)
        else:
            out.append(re.sub(r"^  - ", "    - ", chunk, flags=re.MULTILINE))
    return "".join(out)


def normalize_bold_heading_lines(raw: str) -> str:
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
    inner = inner.replace("<strong>", "<b>").replace("</strong>", "</b>")
    inner = inner.replace("<em>", "<i>").replace("</em>", "</i>")
    inner = re.sub(
        r"(<table>\s*[\s\S]*?</table>)",
        r'<div class="tw-scroll-x">\1</div>',
        inner,
    )
    return inner.strip()


def build_page(fragments: list[tuple[str, str]]) -> str:
    blocks: list[str] = []
    title_esc = html_lib.escape(PAGE_TITLE, quote=False)
    for summary, html_inner in fragments:
        sum_esc = html_lib.escape(summary, quote=False)
        blocks.append("      <details>\n")
        blocks.append(f"        <summary>{sum_esc}</summary>\n")
        blocks.append('        <div class="content">\n')
        blocks.append("          ")
        blocks.append(html_inner.replace("\n", "\n          "))
        blocks.append("\n        </div>\n")
        blocks.append("      </details>\n")

    head = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title_esc}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="../../assets/page-tailwind.css" />
  <link rel="stylesheet" href="../../assets/svg-diagrams.css" />
  <script defer src="../../assets/page-shell.js"></script>
</head>
<body>
  <div class="container">
    <header class="page-head">
      <h1>{title_esc}</h1>
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
        fragments.append((summary, md_to_html_fragment(raw)))

    text = build_page(fragments)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print(f"Wrote {OUT} ({len(fragments)} sections)")


if __name__ == "__main__":
    main()
