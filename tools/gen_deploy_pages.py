"""Generate page/部署运维/Docker基础.html and Linux基础.html from D:\\PKB\\3.Dreamlog\\deploy (*.md)."""
from __future__ import annotations

import html as html_lib
import os
import re

import markdown

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PKB_DIR = r"D:\PKB\3.Dreamlog\deploy"
OUT_DIR = os.path.join(ROOT, "page", "部署运维")

# (source md filename stem pattern, output html file, page title)
# Map by leading number in PKB filename.
OUTPUTS: list[tuple[int, str, str]] = [
    (1, "Docker基础.html", "Docker 基础"),
    (2, "Linux基础.html", "Linux 基础"),
]


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


def find_md_by_prefix(num: int) -> str | None:
    for f in os.listdir(PKB_DIR):
        if not f.endswith(".md"):
            continue
        if f.startswith(f"{num}. "):
            return f
    return None


def build_single_page(title: str, html_inner: str) -> str:
    title_esc = html_lib.escape(title, quote=False)
    body = html_inner.replace("\n", "\n          ")
    return f"""<!doctype html>
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

    <section class="qa-list article-body">
      <div class="content">
          {body}
      </div>
    </section>
  </div>
</body>
</html>
"""


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    for num, out_name, page_title in OUTPUTS:
        md_name = find_md_by_prefix(num)
        if not md_name:
            raise SystemExit(f"Missing {num}. *.md in {PKB_DIR}")
        path = os.path.join(PKB_DIR, md_name)
        with open(path, encoding="utf-8") as f:
            raw = f.read()
        html = build_single_page(page_title, md_to_html_fragment(raw))
        out_path = os.path.join(OUT_DIR, out_name)
        with open(out_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(html)
        print(f"Wrote {out_path} from {md_name}")


if __name__ == "__main__":
    main()
