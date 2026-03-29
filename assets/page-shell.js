// Shared page styling/behavior for topic pages.
// Applies Tailwind utility classes to existing HTML so we don't need per-page <style>.

(function () {
  const $ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const add = (el, cls) => el && el.classList.add(...cls.split(/\s+/).filter(Boolean));
  const scrollKey = `page-scroll:${location.pathname}${location.search}`;

  function ensureFavicon() {
    try {
      const head = document.head || document.getElementsByTagName("head")[0];
      if (!head) return;
      const existing = head.querySelector("link[rel~='icon']");
      if (existing) return;
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = "../assets/favicon.svg";
      head.appendChild(link);
    } catch (_) {}
  }

  function restoreScrollPosition() {
    try {
      const raw = sessionStorage.getItem(scrollKey);
      if (!raw) return;
      const y = Number(raw);
      if (!Number.isFinite(y) || y < 0) return;
      // Wait for layout/paint, then restore once.
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
    } catch (_) {
      // Ignore storage errors (private mode / denied access).
    }
  }

  function persistScrollPosition() {
    try {
      sessionStorage.setItem(scrollKey, String(window.scrollY || window.pageYOffset || 0));
    } catch (_) {
      // Ignore storage errors to keep page behavior stable.
    }
  }

  function applyBaseShell() {
    try {
    document.documentElement.style.backgroundColor = "#2f3348";
    document.body.style.backgroundColor = "#2f3348";
    add(document.body, "text-slate-100 antialiased");

    // Container + hero (existing structure across pages)
    $(".container").forEach((el) =>
      add(el, "mx-auto w-[min(96vw,1500px)] py-6 md:py-8")
    );
    $(".hero").forEach((el) =>
      add(
        el,
        "mb-3 px-1"
      )
    );
    $(".page-head").forEach((el) => add(el, "mb-3 px-1"));

    // Headings and meta
    $("h1").forEach((el) => add(el, "m-0 text-center text-lg md:text-xl font-semibold tracking-wide"));
    $(".page-updated,.subtitle,.desc,.meta").forEach((el) => add(el, "mt-1 text-xs text-slate-400"));

    // QA list / details cards（嵌套 details 同样套卡片，但排除 RAG 生命周期条 lifecycle-collapsible）
    $(".qa-list").forEach((el) => add(el, "grid gap-2.5"));
    $("details").forEach((el) => {
      if (el.classList.contains("lifecycle-collapsible")) return;
      add(el, "rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden");
    });
    $("details > summary").forEach((el) => {
      const d = el.parentElement;
      if (d && d.tagName === "DETAILS" && d.classList.contains("lifecycle-collapsible")) return;
      add(
        el,
        "cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-100 bg-white/[0.04] hover:bg-white/[0.06] border-b border-white/10"
      );
    });
    // Slightly dimmer body text (less bright on dark backgrounds)
    $(".content").forEach((el) => add(el, "px-4 py-3 text-[12px] leading-7 text-slate-200/88"));

    // Typography inside content (conservative: don't fight existing structure)
    $(".content h2,.content h3,.content h4").forEach((el) =>
      add(el, "mt-3 mb-1.5 text-xs font-semibold tracking-wide text-slate-100")
    );
    $(".content p").forEach((el) => add(el, "my-1.5 text-slate-200/82"));
    $(".content ul,.content ol").forEach((el) => add(el, "my-2 pl-5"));
    $(".content li").forEach((el) => add(el, "my-1 text-slate-200/82"));

    // Inline code + code blocks
    $(".content code").forEach((el) =>
      add(el, "rounded-md border border-white/10 bg-slate-900/60 px-1 py-[1px] text-[12px] text-slate-100")
    );
    $(".content pre").forEach((el) =>
      add(el, "tw-scroll-x my-2 rounded-xl border border-white/10 bg-slate-900/60 p-3 text-[12px] leading-5 text-slate-100")
    );
    $(".content pre code").forEach((el) => {
      // pre already styled; remove inline code chrome inside blocks
      el.classList.remove("border", "bg-slate-900/60", "px-1", "py-[1px]");
      add(el, "bg-transparent border-0 p-0");
    });

    // Tables
    $(".content table").forEach((el) => add(el, "tw-scroll-x block my-2 w-full rounded-xl border border-white/20"));
    $(".content thead").forEach((el) => add(el, "bg-white/[0.04]"));
    $(".content th,.content td").forEach((el) => add(el, "border border-white/20 px-3 py-2 align-top text-xs"));
    $(".content th").forEach((el) => add(el, "text-slate-100 font-semibold"));
    $(".content td").forEach((el) => add(el, "text-slate-200/90"));

    // Common callouts from existing pages
    $(".tip").forEach((el) => add(el, "my-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-slate-100"));
    $(".warn").forEach((el) => add(el, "my-2 rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-slate-100"));
    $(".danger").forEach((el) => add(el, "my-2 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-slate-100"));

    // Diagram wrappers previously styled via <style>
    $(".mvcc-diagram-wrap,.diagram-svg").forEach((el) =>
      add(el, "tw-scroll-x my-2 rounded-xl border border-white/10 bg-white/[0.02] p-3")
    );
    $(".mvcc-diagram-wrap svg").forEach((el) => add(el, "block min-w-[980px] h-auto"));

    // Chips (Python page)
    $(".chips").forEach((el) => add(el, "mb-2 flex flex-wrap gap-2"));
    $(".chip").forEach((el) =>
      add(el, "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] text-slate-100")
    );
    $(".chip-note-btn").forEach((el) =>
      add(el, "ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[11px] text-slate-100 hover:bg-white/15")
    );
    $(".chip-note-panel").forEach((el) =>
      add(el, "mt-2 hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[13px] leading-6")
    );

    // Lightweight "open note" behavior if present
    $(".chip-note-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("aria-controls");
        if (!id) return;
        const panel = document.getElementById(id);
        if (!panel) return;
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", expanded ? "false" : "true");
        panel.classList.toggle("hidden", expanded);
      });
    });

    // Force anchors to look consistent
    $("a").forEach((a) => add(a, "text-sky-300 hover:text-sky-200"));
    } finally {
      document.documentElement.classList.add("shell-ready");
    }
  }

  // Remember which <details> blocks inside ".qa-list" are open.
  // Keeps the visual state stable across refreshes without per-page duplication.
  function initDetailsOpenState() {
    const detailsList = Array.from(document.querySelectorAll(".qa-list > details"));
    if (!detailsList.length) return;

    // Stable ordering key for each <details> on this page.
    detailsList.forEach((el, idx) => {
      el.setAttribute("data-faq-id", String(idx + 1));
    });

    const STORAGE_KEY_PREFIX = "notes.detailsOpen.v1:";
    const storageKey = `${STORAGE_KEY_PREFIX}${location.pathname}`;

    function persist() {
      try {
        const openIds = detailsList
          .filter((el) => el.open)
          .map((el) => el.getAttribute("data-faq-id"));
        localStorage.setItem(storageKey, JSON.stringify(openIds));
      } catch (_) {
        // Ignore storage errors (private mode / quota).
      }
    }

    function restore() {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return false;
        const openIds = JSON.parse(raw);
        if (!Array.isArray(openIds)) return false;

        detailsList.forEach((el) => {
          const id = el.getAttribute("data-faq-id");
          el.open = openIds.includes(id);
        });
        return true;
      } catch (_) {
        return false;
      }
    }

    const restored = restore();
    if (!restored) {
      // Existing pages previously defaulted to the first item open.
      detailsList.forEach((el, idx) => {
        el.open = idx === 0;
      });
    }

    detailsList.forEach((el) => el.addEventListener("toggle", persist));
    window.addEventListener("beforeunload", persist);
  }

  // RAG 等页：.lifecycle-stack 内 A–D 各自折叠状态，刷新后从 localStorage 恢复。
  function initLifecycleOpenState() {
    const list = Array.from(document.querySelectorAll(".lifecycle-stack .lifecycle-collapsible"));
    if (!list.length) return;

    list.forEach((el, idx) => {
      el.setAttribute("data-lifecycle-id", String(idx + 1));
    });

    const storageKey = `notes.lifecycleOpen.v1:${location.pathname}`;

    function persist() {
      try {
        const openIds = list.filter((el) => el.open).map((el) => el.getAttribute("data-lifecycle-id"));
        localStorage.setItem(storageKey, JSON.stringify(openIds));
      } catch (_) {}
    }

    function restore() {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw === null) return false;
        const openIds = JSON.parse(raw);
        if (!Array.isArray(openIds)) return false;
        list.forEach((el) => {
          const id = el.getAttribute("data-lifecycle-id");
          el.open = openIds.includes(id);
        });
        return true;
      } catch (_) {
        return false;
      }
    }

    if (!restore()) {
      list.forEach((el) => {
        el.open = true;
      });
    }

    list.forEach((el) => el.addEventListener("toggle", persist));
    window.addEventListener("beforeunload", persist);
  }

  function initMermaidPanzoom() {
    const mermaidApi = window.mermaid;
    if (!mermaidApi) return;

    if (!window.__notesMermaidInited) {
      mermaidApi.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "loose",
        themeVariables: {
          darkMode: false,
          background: "transparent",
          fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
          primaryTextColor: "#1e293b",
          lineColor: "#94a3b8",
          clusterBkg: "rgba(30, 41, 59, 0.82)",
          clusterBorder: "#38bdf8",
          titleColor: "#e0f2fe",
          edgeLabelBackground: "#f1f5f9",
        },
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: "basis",
          padding: 12,
          nodeSpacing: 50,
          rankSpacing: 55,
        },
      });
      window.__notesMermaidInited = true;
    }

    function bindPanzoomIn(root) {
      const PanzoomGlobal = window.Panzoom;
      const PanzoomFactory =
        typeof PanzoomGlobal === "function"
          ? PanzoomGlobal
          : typeof PanzoomGlobal?.default === "function"
          ? PanzoomGlobal.default
          : null;

      function ensureLcDiagramReset(viewport) {
        const first = viewport.firstElementChild;
        if (first && first.classList.contains("lc-diagram-reset")) return;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "lc-diagram-reset";
        b.setAttribute("aria-label", "重置视图");
        b.setAttribute("title", "重置视图");
        b.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';
        viewport.insertBefore(b, viewport.firstChild);
      }

      root.querySelectorAll(".lc-diagram-viewport").forEach((viewport) => {
        ensureLcDiagramReset(viewport);
        const panEl = viewport.querySelector(".lc-diagram-panzoom");
        if (!panEl || panEl.dataset.lcPanzoomBound) return;
        const svg = panEl.querySelector("svg");
        if (!svg) return;

        panEl.dataset.lcPanzoomBound = "1";
        viewport.style.touchAction = "none";
        panEl.style.transformOrigin = "0 0";
        panEl.style.cursor = "grab";
        svg.style.pointerEvents = "none";

        let panzoomLibOk = false;

        if (PanzoomFactory) {
          try {
            const pz = PanzoomFactory(panEl, {
              maxScale: 4.5,
              minScale: 0.12,
              step: 0.12,
              animate: false,
            });

            viewport.addEventListener(
              "wheel",
              (e) => {
                if (!viewport.contains(e.target)) return;
                pz.zoomWithWheel(e);
              },
              { passive: false }
            );

            panEl.addEventListener("pointerdown", () => {
              panEl.style.cursor = "grabbing";
            });
            window.addEventListener("pointerup", () => {
              panEl.style.cursor = "grab";
            });

            panEl._lcPanzoom = {
              reset() {
                try {
                  pz.reset({ animate: false, force: true });
                } catch (_) {
                  // Backward compatibility for older Panzoom versions.
                  try {
                    pz.zoom(1, { animate: false });
                    pz.pan(0, 0, { animate: false, force: true });
                  } catch (_) {}
                }
                panEl.style.cursor = "grab";
              },
            };
            panzoomLibOk = true;
          } catch (_) {}
        }

        const resetBtn = viewport.querySelector(".lc-diagram-reset");
        if (resetBtn && !resetBtn.dataset.lcResetBound) {
          resetBtn.dataset.lcResetBound = "1";
          resetBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const api = panEl._lcPanzoom;
            if (api && typeof api.reset === "function") api.reset();
          });
        }

        if (panzoomLibOk) return;

        // Manual pan/zoom if Panzoom is missing or threw.
        let scale = 1;
        let x = 0;
        let y = 0;
        let dragging = false;
        let lastX = 0;
        let lastY = 0;

        const minScale = 0.12;
        const maxScale = 4.5;

        function applyTransform() {
          panEl.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        }

        viewport.addEventListener(
          "wheel",
          (e) => {
            if (!viewport.contains(e.target)) return;
            e.preventDefault();
            const delta = e.deltaY < 0 ? 1.12 : 0.88;
            const next = Math.min(maxScale, Math.max(minScale, scale * delta));
            if (next === scale) return;
            scale = next;
            applyTransform();
          },
          { passive: false }
        );

        panEl.addEventListener("pointerdown", (e) => {
          dragging = true;
          lastX = e.clientX;
          lastY = e.clientY;
          panEl.style.cursor = "grabbing";
          if (panEl.setPointerCapture) panEl.setPointerCapture(e.pointerId);
        });

        panEl.addEventListener("pointermove", (e) => {
          if (!dragging) return;
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          x += dx;
          y += dy;
          lastX = e.clientX;
          lastY = e.clientY;
          applyTransform();
        });

        function stopDragging(e) {
          if (!dragging) return;
          dragging = false;
          panEl.style.cursor = "grab";
          if (e && panEl.releasePointerCapture) {
            try {
              panEl.releasePointerCapture(e.pointerId);
            } catch (_) {}
          }
        }

        panEl.addEventListener("pointerup", stopDragging);
        panEl.addEventListener("pointercancel", stopDragging);
        panEl.addEventListener("pointerleave", stopDragging);

        panEl._lcPanzoom = {
          reset() {
            scale = 1;
            x = 0;
            y = 0;
            applyTransform();
          },
        };
      });
    }

    async function renderIn(root) {
      const blocks = root.querySelectorAll(".mermaid.lc-mermaid");
      const list = [];
      blocks.forEach((el) => {
        if (el.querySelector("svg")) return;
        const t = el.textContent;
        if (t) {
          el.textContent = t
            .split("\n")
            .map((line) => line.trimEnd())
            .join("\n")
            .trim();
        }
        list.push(el);
      });

      if (list.length) {
        await mermaidApi.run({ nodes: list });
      }
      bindPanzoomIn(root);
    }

    document.addEventListener(
      "toggle",
      (event) => {
        const target = event.target;
        if (!(target instanceof HTMLDetailsElement) || !target.open) return;
        if (!target.querySelector(".mermaid.lc-mermaid")) return;
        renderIn(target).catch(() => {});
      },
      true
    );

    return renderIn;
  }

  function bootShell() {
    ensureFavicon();
    applyBaseShell();
    restoreScrollPosition();
    // Mermaid first (while HTML `open` is intact), then fold <details> from localStorage.
    const renderMermaid = initMermaidPanzoom();
    if (renderMermaid) {
      void (async () => {
        try {
          await renderMermaid(document);
        } catch (_) {
          // mermaid.run may fail; still restore details UI.
        }
        initDetailsOpenState();
        initLifecycleOpenState();
        // Open-only-from-localStorage blocks never get a `toggle` event.
        try {
          await renderMermaid(document);
        } catch (_) {}
      })();
    } else {
      initDetailsOpenState();
      initLifecycleOpenState();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootShell);
  } else {
    bootShell();
  }
  window.addEventListener("scroll", persistScrollPosition, { passive: true });
  window.addEventListener("beforeunload", persistScrollPosition);
})();

