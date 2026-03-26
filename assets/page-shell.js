// Shared page styling/behavior for topic pages.
// Applies Tailwind utility classes to existing HTML so we don't need per-page <style>.

(function () {
  const $ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const add = (el, cls) => el && el.classList.add(...cls.split(/\s+/).filter(Boolean));

  function applyBaseShell() {
    add(document.documentElement, "bg-slate-950");
    add(document.body, "bg-slate-950 text-slate-100 antialiased");

    // Container + hero (existing structure across pages)
    $(".container").forEach((el) =>
      add(el, "mx-auto w-[min(92vw,1100px)] py-6 md:py-8")
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

    // QA list / details cards
    $(".qa-list").forEach((el) => add(el, "grid gap-2.5"));
    $("details").forEach((el) =>
      add(el, "rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden")
    );
    $("details > summary").forEach((el) =>
      add(
        el,
        "cursor-pointer select-none px-4 py-3 text-sm font-medium text-slate-100 bg-white/[0.04] hover:bg-white/[0.06] border-b border-white/10"
      )
    );
    // Slightly dimmer body text (less bright on dark backgrounds)
    $(".content").forEach((el) => add(el, "px-4 py-3 text-[13px] leading-6 text-slate-200/90"));

    // Typography inside content (conservative: don't fight existing structure)
    $(".content h2,.content h3,.content h4").forEach((el) =>
      add(el, "mt-3 mb-1.5 text-xs font-semibold tracking-wide text-slate-100")
    );
    $(".content p").forEach((el) => add(el, "my-1.5 text-slate-200/85"));
    $(".content ul,.content ol").forEach((el) => add(el, "my-2 pl-5"));
    $(".content li").forEach((el) => add(el, "my-1 text-slate-200/85"));

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
  }

  document.addEventListener("DOMContentLoaded", applyBaseShell);
})();

