/* Atlas FAB — injected on every page.
   Click  -> open the Explore page (new tab)
   Hover  -> stack of starred favorites, each opens in a new tab
   (planning doc §8) */
(() => {
  if (window.__atlasFabMounted) return;
  window.__atlasFabMounted = true;

  const FAB_SVG = `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="80" height="80" rx="40" fill="url(#atlasFabG)"/>
      <path d="M41.8 35.2L38.2 35.2L38.2 16L41.8 16L41.8 35.2Z" fill="#DAFF48"/>
      <path d="M41.8 64L38.2 64L38.2 44.8L41.8 44.8L41.8 64Z" fill="#DAFF48"/>
      <path d="M16 41.8L16 38.2L35.2 38.2L35.2 41.8L16 41.8Z" fill="#DAFF48"/>
      <path d="M44.8 41.8L44.8 38.2L64 38.2L64 41.8L44.8 41.8Z" fill="#DAFF48"/>
      <path d="M56.2 40C56.2 31.053 48.947 23.8 40 23.8C31.053 23.8 23.8 31.053 23.8 40C23.8 48.947 31.053 56.2 40 56.2V59.8C29.0648 59.8 20.2 50.9352 20.2 40C20.2 29.0648 29.0648 20.2 40 20.2C50.9352 20.2 59.8 29.0648 59.8 40C59.8 50.9352 50.9352 59.8 40 59.8V56.2C48.947 56.2 56.2 48.947 56.2 40Z" fill="#DAFF48"/>
      <defs>
        <radialGradient id="atlasFabG" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(40 40) rotate(90) scale(40)">
          <stop stop-color="#171717"/><stop offset="0.68" stop-color="#353535"/>
          <stop offset="0.91" stop-color="#6B7545"/><stop offset="1" stop-color="#578609"/>
        </radialGradient>
      </defs>
    </svg>`;

  const host = document.createElement("div");
  host.id = "atlas-fab-host";
  host.style.cssText = "position:fixed;right:0;bottom:0;z-index:2147483647;";
  const root = host.attachShadow({ mode: "open" });

  root.innerHTML = `
    <style>
      :host { all: initial; }
      * { box-sizing: border-box; font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      .dock {
        position: fixed; right: 24px; bottom: 24px;
        display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
      }
      .stack {
        display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
        opacity: 0; transform: translateY(8px); pointer-events: none;
        transition: opacity .18s ease, transform .18s ease;
      }
      .dock:hover .stack, .dock:focus-within .stack { opacity: 1; transform: none; pointer-events: auto; }
      .item {
        display: inline-flex; align-items: center; gap: 10px; max-width: 260px;
        padding: 8px 13px; border-radius: 999px;
        background: #232327; border: 1px solid #3B3B41; color: #F5F5F7;
        font-size: 12.5px; font-weight: 500; text-decoration: none; cursor: pointer;
        box-shadow: 0 8px 22px rgba(0,0,0,.45); transition: border-color .15s ease;
      }
      .item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .item .go { color: #6B6B72; flex-shrink: 0; }
      .item:hover { border-color: #DAFF48; }
      .item:hover .go { color: #DAFF48; }
      .empty {
        margin: 0; padding: 8px 13px; border-radius: 999px;
        background: #232327; border: 1px dashed #3B3B41; color: #6B6B72; font-size: 12px;
        box-shadow: 0 8px 22px rgba(0,0,0,.45);
      }
      .fab {
        position: relative; width: 56px; height: 56px; padding: 0; border: 0;
        background: transparent; border-radius: 50%; cursor: pointer; touch-action: none;
        filter: drop-shadow(0 10px 26px rgba(0,0,0,.55)); transition: transform .16s ease;
      }
      .dock.is-dragging .fab { transition: none; transform: none; }
      .fab svg { display: block; width: 56px; height: 56px; }
      .fab:hover { transform: translateY(-2px); }
      .fab:active { transform: translateY(0); }
      .badge {
        position: absolute; top: -3px; right: -3px; min-width: 18px; height: 18px; padding: 0 4px;
        display: flex; align-items: center; justify-content: center; border-radius: 999px;
        background: #DAFF48; color: #14150A; font-size: 11px; font-weight: 500;
        border: 2px solid #0d0d0f;
      }
      .badge[hidden] { display: none; }
      @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
    </style>
    <div class="dock" id="dock">
      <div class="stack" id="stack" role="menu" aria-label="Favorite sites"></div>
      <button class="fab" id="fab" type="button" aria-label="Atlas — open Explore, hover for favorites">
        ${FAB_SVG}
        <span class="badge" id="badge" hidden>0</span>
      </button>
    </div>`;

  (document.body || document.documentElement).appendChild(host);

  const stack = root.getElementById("stack");
  const badge = root.getElementById("badge");
  const dock = root.getElementById("dock");
  const fabBtn = root.getElementById("fab");

  // ----- vertical drag — stays pinned to the right edge, moves up/down only -----
  const DRAG_MARGIN = 12;
  let dragging = false, dragMoved = false, dragStartY = 0, dragStartBottom = 24, dragPointerId = null;
  let suppressClick = false;

  function clampBottom(v) {
    const h = dock.getBoundingClientRect().height || 56;
    const max = Math.max(DRAG_MARGIN, window.innerHeight - h - DRAG_MARGIN);
    return Math.min(Math.max(v, DRAG_MARGIN), max);
  }
  function currentBottom() {
    const n = parseFloat(getComputedStyle(dock).bottom);
    return isNaN(n) ? 24 : n;
  }

  fabBtn.addEventListener("pointerdown", e => {
    if (e.button !== 0) return;
    dragging = true;
    dragMoved = false;
    dragStartY = e.clientY;
    dragStartBottom = currentBottom();
    dragPointerId = e.pointerId;
    try { fabBtn.setPointerCapture(dragPointerId); } catch (err) { /* ignore */ }
    dock.classList.add("is-dragging");
  });
  fabBtn.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dy = e.clientY - dragStartY;
    if (Math.abs(dy) > 3) dragMoved = true;
    dock.style.bottom = clampBottom(dragStartBottom - dy) + "px";
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    dock.classList.remove("is-dragging");
    if (dragMoved) {
      suppressClick = true;
      try { chrome.storage.local.set({ fabBottom: parseFloat(dock.style.bottom) }); } catch (err) { /* ignore */ }
    }
  }
  fabBtn.addEventListener("pointerup", endDrag);
  fabBtn.addEventListener("pointercancel", endDrag);
  window.addEventListener("resize", () => {
    dock.style.bottom = clampBottom(currentBottom()) + "px";
  });
  try {
    chrome.storage.local.get({ fabBottom: null }, ({ fabBottom }) => {
      if (typeof fabBottom === "number") dock.style.bottom = clampBottom(fabBottom) + "px";
    });
  } catch (err) { /* ignore */ }

  fabBtn.addEventListener("click", () => {
    if (suppressClick) { suppressClick = false; return; }
    chrome.runtime.sendMessage({ type: "atlas:open-explore" });
  });

  function render(list) {
    stack.textContent = "";
    badge.hidden = !list.length;
    badge.textContent = list.length;
    if (!list.length) {
      const p = document.createElement("p");
      p.className = "empty";
      p.textContent = "Star sites on the Explore page";
      stack.appendChild(p);
      return;
    }
    list.forEach(f => {
      const a = document.createElement("a");
      a.className = "item";
      a.href = f.u;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("role", "menuitem");
      const label = document.createElement("span");
      label.textContent = f.n;
      const go = document.createElement("span");
      go.className = "go";
      go.textContent = "↗";
      a.append(label, go);
      stack.appendChild(a);
    });
  }

  function load() {
    chrome.storage.local.get({ favorites: [] }, ({ favorites }) => render(favorites || []));
  }
  load();
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.favorites) render(changes.favorites.newValue || []);
  });
})();
