from __future__ import annotations

import http.server
import socketserver
from pathlib import Path


class NoCacheRequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    Dev-only server: disables caching so refresh shows latest files.
    """

    def __init__(self, *args, directory: str | None = None, **kwargs):
        directory = directory or str(Path(__file__).resolve().parent)
        super().__init__(*args, directory=directory, **kwargs)

    def end_headers(self) -> None:
        # Always revalidate / never store during local development.
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self) -> None:
        # Prevent noisy 404s in dev logs when browsers request favicon.
        if self.path == "/favicon.ico" or self.path == "favicon.ico":
            self.send_response(204)  # No Content
            self.end_headers()
            return
        super().do_GET()


def main() -> None:
    host = "127.0.0.1"
    # Avoid 3000/8000/8080/5000 等常用开发端口，减少与其它本地服务冲突。
    port = 18473
    with socketserver.TCPServer((host, port), NoCacheRequestHandler) as httpd:
        print(f"Serving (no-cache) on http://{host}:{port}/")
        print("Press Ctrl+C to stop.")
        httpd.serve_forever()


if __name__ == "__main__":
    main()

