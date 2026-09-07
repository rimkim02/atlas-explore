/* Atlas Explore page — opened when the FAB (or the toolbar icon) is clicked.
   Favorites live in chrome.storage.local so every page's FAB stays in sync. */
(() => {
  const SITES = window.ATLAS_SITES;
  const GROUPS = window.ATLAS_GROUPS;
  const GROUP_DEFS = window.ATLAS_GROUP_DEFS;
  const GROUP_PRIORITY = window.ATLAS_GROUP_PRIORITY;
  const VIEWS = window.ATLAS_VIEWS;

  // ----- tag colour lookup -----
  const TAG_ORDER = [];
  const TAG_STYLE = {};
  GROUPS.forEach(g => g.tags.forEach(t => { TAG_ORDER.push(t); TAG_STYLE[t] = { bg: g.bg, fg: g.fg }; }));

  // ----- derive -----
  const GROUP_BY_KEY = {};
  GROUP_DEFS.forEach(g => { GROUP_BY_KEY[g.key] = g; });
  function primaryGroup(site) {
    for (const key of GROUP_PRIORITY) {
      if (site.t.some(t => GROUP_BY_KEY[key].tags.indexOf(t) !== -1)) return key;
    }
    return "Reference";
  }
  SITES.forEach(s => {
    try { s.domain = new URL(s.u).hostname.replace(/^www\./, ""); }
    catch (e) { s.domain = s.u.replace(/^https?:\/\//, "").replace(/\/.*$/, ""); }
    s.haystack = (s.n + " " + s.domain + " " + s.d + " " + s.t.join(" ")).toLowerCase();
    s.group = primaryGroup(s);
  });

  const tagCounts = {};
  TAG_ORDER.forEach(t => (tagCounts[t] = 0));
  SITES.forEach(s => s.t.forEach(t => { if (t in tagCounts) tagCounts[t]++; }));

  // ----- favorites (chrome.storage.local) -----
  const favorites = new Set();
  function persist() {
    const list = SITES.filter(s => favorites.has(s.domain)).map(s => ({ n: s.n, u: s.u, domain: s.domain }));
    chrome.storage.local.set({ favorites: list });
  }

  // ----- state -----
  const active = new Set();
  let query = "";
  let currentView = "all";
  function inView(view, s) {
    if (view.starred) return favorites.has(s.domain);
    if (view.group) return s.group === view.group;
    return true;
  }

  // ----- helpers -----
  function tagChip(name, withCount) {
    const style = TAG_STYLE[name] || { bg: "#3A3A3D", fg: "#C7C7CC" };
    const el = document.createElement("button");
    el.type = "button";
    el.className = "tag";
    el.style.background = style.bg;
    el.style.color = style.fg;
    el.dataset.tag = name;
    el.setAttribute("aria-pressed", active.has(name) ? "true" : "false");
    el.innerHTML = withCount ? name + ' <span class="n">' + tagCounts[name] + "</span>" : name;
    el.addEventListener("click", () => {
      active.has(name) ? active.delete(name) : active.add(name);
      apply();
    });
    return el;
  }

  // ----- build filter bar -----
  const tagFilter = document.getElementById("tagFilter");
  TAG_ORDER.forEach(name => tagFilter.appendChild(tagChip(name, true)));

  // ----- build view nav -----
  const viewNav = document.getElementById("viewNav");
  const viewButtons = VIEWS.map(v => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.dataset.view = v.id;
    b.setAttribute("aria-selected", v.id === currentView ? "true" : "false");
    b.innerHTML = v.label + ' <span class="vn-count" aria-hidden="true"></span>';
    b.addEventListener("click", () => {
      currentView = v.id;
      viewButtons.forEach(x => x.setAttribute("aria-selected", x.dataset.view === currentView ? "true" : "false"));
      apply();
    });
    viewNav.appendChild(b);
    return b;
  });

  // ----- build groups + cards -----
  const groupsRoot = document.getElementById("groups");
  const groupsEmpty = document.createElement("p");
  groupsEmpty.className = "groups-empty";
  groupsEmpty.hidden = true;
  const cardIndex = [];
  const groupEls = {};

  GROUP_DEFS.forEach(g => {
    const section = document.createElement("section");
    section.className = "group";
    section.dataset.group = g.key;

    const head = document.createElement("div");
    head.className = "group-head";
    head.innerHTML = '<div class="group-titles"><h3></h3><p></p></div><span class="group-count"></span>';
    head.querySelector("h3").textContent = g.title;
    head.querySelector("p").textContent = g.blurb;

    const grid = document.createElement("div");
    grid.className = "grid";

    const empty = document.createElement("p");
    empty.className = "group-empty";
    empty.hidden = true;
    empty.textContent = "Nothing in this group matches the current filters.";

    section.append(head, grid, empty);
    groupsRoot.appendChild(section);
    groupEls[g.key] = { section, grid, count: head.querySelector(".group-count"), empty };
  });
  groupsRoot.appendChild(groupsEmpty);

  SITES.forEach(s => {
    const card = document.createElement("article");
    card.className = "card";

    const top = document.createElement("div");
    top.className = "card-top";

    const name = document.createElement("h4");
    name.className = "card-name";
    name.textContent = s.n;

    const open = document.createElement("a");
    open.className = "card-open";
    open.href = s.u;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.setAttribute("aria-label", "Open " + s.n + " in a new tab");
    open.textContent = "↗";

    top.append(name, open);

    const domain = document.createElement("div");
    domain.className = "card-domain";
    domain.textContent = s.domain;

    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = s.d;

    const foot = document.createElement("div");
    foot.className = "card-foot";

    const tags = document.createElement("div");
    tags.className = "card-tags";
    s.t.forEach(t => tags.appendChild(tagChip(t, false)));

    const star = document.createElement("button");
    star.type = "button";
    star.className = "card-star";
    star.dataset.domain = s.domain;
    star.textContent = "★";
    star.setAttribute("aria-label", "Favorite " + s.n);
    star.title = "Favorite";
    star.addEventListener("click", () => {
      favorites.has(s.domain) ? favorites.delete(s.domain) : favorites.add(s.domain);
      persist();
      syncStars();
      apply();
    });

    foot.append(tags, star);
    card.append(top, domain, desc, foot);
    groupEls[s.group].grid.appendChild(card);
    cardIndex.push({ s, el: card, star });
  });

  // ----- filtering -----
  const resultCount = document.getElementById("resultCount");
  const clearBtn = document.getElementById("clearBtn");
  const searchInput = document.getElementById("search");
  const favStat = document.getElementById("favStat");

  function matches(s) {
    if (query && s.haystack.indexOf(query) === -1) return false;
    for (const t of active) if (s.t.indexOf(t) === -1) return false;
    return true;
  }

  function apply() {
    const view = VIEWS.find(v => v.id === currentView) || VIEWS[0];
    const perGroup = {};
    GROUP_DEFS.forEach(g => (perGroup[g.key] = 0));
    let shown = 0;

    cardIndex.forEach(c => {
      const visible = matches(c.s) && inView(view, c.s);
      c.el.hidden = !visible;
      if (visible) { shown++; perGroup[c.s.group]++; }
    });

    GROUP_DEFS.forEach(g => {
      const ge = groupEls[g.key];
      const n = perGroup[g.key];
      ge.count.textContent = n + (n === 1 ? " site" : " sites");
      ge.empty.hidden = true;
      ge.section.hidden = n === 0;
    });

    groupsEmpty.hidden = shown !== 0;
    groupsEmpty.textContent = view.starred && favorites.size === 0
      ? "No favorites yet — tap the ★ on a card to pin it here and to the FAB."
      : "Nothing matches this combination. Try removing a tag.";

    viewButtons.forEach(b => {
      const v = VIEWS.find(x => x.id === b.dataset.view);
      const n = cardIndex.filter(c => matches(c.s) && inView(v, c.s)).length;
      b.querySelector(".vn-count").textContent = n;
    });

    resultCount.innerHTML = "Showing <b>" + shown + "</b> of " + SITES.length;
    document.querySelectorAll(".tag[data-tag]").forEach(el => {
      el.setAttribute("aria-pressed", active.has(el.dataset.tag) ? "true" : "false");
    });
    clearBtn.hidden = !(active.size > 0 || query.length > 0 || currentView !== "all");
  }

  function syncStars() {
    cardIndex.forEach(c => c.star.setAttribute("aria-pressed", favorites.has(c.s.domain) ? "true" : "false"));
    favStat.textContent = favorites.size;
  }

  searchInput.addEventListener("input", () => {
    query = searchInput.value.trim().toLowerCase();
    apply();
  });
  clearBtn.addEventListener("click", () => {
    active.clear();
    query = "";
    searchInput.value = "";
    currentView = "all";
    viewButtons.forEach(x => x.setAttribute("aria-selected", x.dataset.view === "all" ? "true" : "false"));
    apply();
  });

  // ----- load favorites, then render -----
  chrome.storage.local.get({ favorites: [] }, ({ favorites: saved }) => {
    (saved || []).forEach(f => favorites.add(f.domain));
    syncStars();
    apply();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.favorites) return;
    favorites.clear();
    (changes.favorites.newValue || []).forEach(f => favorites.add(f.domain));
    syncStars();
    apply();
  });

  document.getElementById("siteCount").textContent = SITES.length;
  apply();
})();
