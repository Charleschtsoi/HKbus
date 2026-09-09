const API = "https://data.etabus.gov.hk/v1/transport/kmb";
const WAYPOINTS_URL = "https://hkbus.github.io/route-waypoints";
const FAVORITES_KEY = "hk-arrivals-favorites";
const LANG_KEY = "hk-arrivals-lang";
const STOPS_KEY = "hk-arrivals-stops-v1";
const HK_CENTER = [22.3193, 114.1694];
const NEARBY_LIMIT = 8;
const NEARBY_RADIUS_M = 500;
const NEARBY_FALLBACK_M = 1200;

const I18N = {
  tc: {
    title: "候車",
    subtitle: "香港巴士到站 · 附近車站 · 路線搜尋",
    tabNearby: "附近",
    tabSearch: "搜尋",
    locate: "定位",
    expandMap: "放大地圖",
    collapseMap: "收起地圖",
    mapNearbyHint: "附近車站地圖",
    mapRouteHint: "全螢幕睇清楚成條路線",
    viewRouteMap: "放大睇路線",
    searchLabel: "路線編號",
    search: "搜尋",
    favorites: "常用車站",
    back: "← 返回路線",
    footer: "到站資料來自香港政府開放數據，約每分鐘更新。本頁並非任何巴士公司的官方應用程式。",
    placeholder: "例如 1A、104、B1",
    loadingRoutes: "載入路線中…",
    loadingStops: "載入車站中…",
    locating: "正在取得你的位置…",
    locatingDenied: "未有位置權限。請在瀏覽器允許定位，或按「定位」再試。",
    locatingError: "未能取得位置。請檢查系統定位設定後再試。",
    tooFar: "你而家唔喺香港附近。地圖會顯示香港，你仍然可以搜路線。",
    noNearby: "附近未找到車站。試下走近多啲，或者用搜尋。",
    loadingEtas: "載入到站時間中…",
    refreshing: "更新中…",
    nearbyTitle: "附近車站",
    noRoute: "找不到呢條路線。試下 1A、104、B1。",
    pickDirection: "選擇方向",
    toward: "往",
    special: "特別班",
    arriving: "即將到站",
    noEta: "暫時未有到站時間",
    updated: "更新於",
    minutes: "分鐘",
    clock: "到站",
    metres: "米",
    closest: "最近",
    closestHint: "最近你嘅車站",
    needLocation: "未有你的位置。按地圖「定位」之後，呢度會標示最近車站。",
    loadError: "載入失敗，請再試一次。",
    you: "你",
    stop: "車站",
  },
  en: {
    title: "Arrivals",
    subtitle: "Hong Kong bus times · nearby stops · route search",
    tabNearby: "Nearby",
    tabSearch: "Search",
    locate: "Locate me",
    expandMap: "Expand map",
    collapseMap: "Collapse map",
    mapNearbyHint: "Nearby stops map",
    mapRouteHint: "See the full route clearly",
    viewRouteMap: "Expand route map",
    searchLabel: "Route number",
    search: "Search",
    favorites: "Saved stops",
    back: "← Back to route",
    footer: "Arrival times come from Hong Kong government open data, updated about every minute. This is not an official app of any bus company.",
    placeholder: "e.g. 1A, 104, B1",
    loadingRoutes: "Loading routes…",
    loadingStops: "Loading stops…",
    locating: "Finding your location…",
    locatingDenied: "Location is off. Allow location in the browser, then tap Locate me.",
    locatingError: "Could not read your location. Check system location settings and try again.",
    tooFar: "You do not appear to be near Hong Kong. The map stays on HK; you can still search routes.",
    noNearby: "No stops nearby. Walk closer, or search a route.",
    loadingEtas: "Loading arrival times…",
    refreshing: "Updating…",
    nearbyTitle: "Nearby stops",
    noRoute: "No matching route. Try 1A, 104, or B1.",
    pickDirection: "Choose a direction",
    toward: "to",
    special: "Special",
    arriving: "Arriving",
    noEta: "No arrival time right now",
    updated: "Updated",
    minutes: "min",
    clock: "Due",
    metres: "m",
    closest: "Closest",
    closestHint: "Closest stop to you",
    needLocation: "No location yet. Tap Locate me on the map, then this list will mark the nearest stop.",
    loadError: "Could not load data. Please try again.",
    you: "You",
    stop: "Stop",
  },
};

const state = {
  lang: localStorage.getItem(LANG_KEY) === "en" ? "en" : "tc",
  tab: "nearby",
  routes: [],
  allStops: [],
  stopsById: new Map(),
  selectedRoute: "",
  variants: [],
  selectedVariant: null,
  stops: [],
  selectedStop: null,
  etaTimer: null,
  nearbyTimer: null,
  favorites: readFavorites(),
  userLat: null,
  userLng: null,
  nearbyStops: [],
  selectedNearbyStopId: null,
  watchId: null,
  nearbySeq: 0,
  nearbyUpdatedAt: null,
  nearbyEtaPending: false,
  stopsLoadPromise: null,
  mapExpanded: false,
};

const mapCtl = {
  map: null,
  userMarker: null,
  stopLayer: null,
  routeLine: null,
  routeStopsLayer: null,
  drawSeq: 0,
  gtfsMap: null,
  geoCache: null,
};

const els = {
  form: document.getElementById("search-form"),
  input: document.getElementById("route-input"),
  status: document.getElementById("status"),
  langBtn: document.getElementById("lang-btn"),
  locateBtn: document.getElementById("locate-btn"),
  expandMapBtn: document.getElementById("expand-map-btn"),
  collapseMapBtn: document.getElementById("collapse-map-btn"),
  mapShell: document.getElementById("map-shell"),
  mapCaption: document.getElementById("map-caption"),
  mapCaptionTitle: document.getElementById("map-caption-title"),
  mapCaptionSub: document.getElementById("map-caption-sub"),
  appMain: document.getElementById("app-main"),
  viewRouteMapBtn: document.getElementById("view-route-map-btn"),
  nearbyPanel: document.getElementById("nearby-panel"),
  nearbyStatus: document.getElementById("nearby-status"),
  nearbyMeta: document.getElementById("nearby-meta"),
  nearbyList: document.getElementById("nearby-list"),
  searchPanel: document.getElementById("search-panel"),
  tabNearby: document.getElementById("tab-nearby"),
  tabSearch: document.getElementById("tab-search"),
  favorites: document.getElementById("favorites"),
  favoriteList: document.getElementById("favorite-list"),
  variants: document.getElementById("variants"),
  variantsTitle: document.getElementById("variants-title"),
  variantList: document.getElementById("variant-list"),
  stops: document.getElementById("stops"),
  stopsTitle: document.getElementById("stops-title"),
  stopList: document.getElementById("stop-list"),
  backBtn: document.getElementById("back-btn"),
  eta: document.getElementById("eta"),
  etaTitle: document.getElementById("eta-title"),
  etaMeta: document.getElementById("eta-meta"),
  etaList: document.getElementById("eta-list"),
  etaUpdated: document.getElementById("eta-updated"),
  favBtn: document.getElementById("fav-btn"),
};

function t(key) {
  return I18N[state.lang][key];
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[ch]);
}

function publicText(value) {
  return String(value ?? "")
    .replace(/\[\s*[^\]]*(九巴|龍運|城巴|新巴|KMB|LWB|CTB|NWFB)[^\]]*\]/gi, "")
    .replace(/\b(KMB|LWB|CTB|NWFB)\b/gi, "")
    .replace(/九巴|龍運巴士|龍運|城巴|新巴/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function nameOf(obj, prefix = "name") {
  return publicText(state.lang === "en" ? obj[`${prefix}_en`] : obj[`${prefix}_tc`]);
}

function origDest(route) {
  return {
    orig: publicText(state.lang === "en" ? route.orig_en : route.orig_tc),
    dest: publicText(state.lang === "en" ? route.dest_en : route.dest_tc),
  };
}

function boundPath(bound) {
  return bound === "I" ? "inbound" : "outbound";
}

function readFavorites() {
  try {
    const next = localStorage.getItem(FAVORITES_KEY);
    if (next) return JSON.parse(next);
    const legacy = localStorage.getItem("kmb-arrivals-favorites");
    return legacy ? JSON.parse(legacy) : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
}

function applyLang() {
  document.documentElement.lang = state.lang === "en" ? "en" : "zh-HK";
  document.title = `${t("title")} · ${state.lang === "en" ? "Hong Kong bus arrivals" : "香港巴士到站"}`;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  els.input.placeholder = t("placeholder");
  els.langBtn.textContent = state.lang === "en" ? "中文" : "EN";
  renderFavorites();
  if (state.variants.length) renderVariants();
  if (state.stops.length) renderStops();
  if (state.selectedStop) renderEtaHeading();
  renderNearbyList();
  renderNearbyMeta();
  refreshMapLabels();
  updateMapExpandUi();
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function loadRoutes() {
  if (state.routes.length) return;
  const json = await fetchJson(`${API}/route`);
  state.routes = json.data || [];
}

function setStatus(text) {
  els.status.hidden = !text;
  els.status.textContent = text;
}

function setNearbyStatus(text, { loading = false } = {}) {
  els.nearbyStatus.hidden = !text;
  els.nearbyStatus.textContent = text;
  els.nearbyStatus.classList.toggle("is-loading", Boolean(text) && loading);
}

function renderNearbyMeta() {
  if (!els.nearbyMeta) return;
  if (!state.nearbyStops.length) {
    els.nearbyMeta.hidden = true;
    els.nearbyMeta.textContent = "";
    return;
  }
  if (state.nearbyEtaPending && !state.nearbyUpdatedAt) {
    els.nearbyMeta.hidden = false;
    els.nearbyMeta.textContent = t("loadingEtas");
    return;
  }
  if (state.nearbyEtaPending && state.nearbyUpdatedAt) {
    els.nearbyMeta.hidden = false;
    els.nearbyMeta.textContent = t("refreshing");
    return;
  }
  if (state.nearbyUpdatedAt) {
    els.nearbyMeta.hidden = false;
    els.nearbyMeta.textContent = `${t("updated")} ${formatClock(state.nearbyUpdatedAt.toISOString())}`;
    return;
  }
  els.nearbyMeta.hidden = true;
  els.nearbyMeta.textContent = "";
}

function searchRoutes(query) {
  const q = query.trim().toUpperCase();
  if (!q) return [];
  const matches = state.routes.filter((r) => r.route.toUpperCase().includes(q));
  matches.sort((a, b) => {
    const aExact = a.route.toUpperCase() === q ? 0 : a.route.toUpperCase().startsWith(q) ? 1 : 2;
    const bExact = b.route.toUpperCase() === q ? 0 : b.route.toUpperCase().startsWith(q) ? 1 : 2;
    if (aExact !== bExact) return aExact - bExact;
    if (a.route.length !== b.route.length) return a.route.length - b.route.length;
    if (a.route !== b.route) return a.route.localeCompare(b.route, "en", { numeric: true });
    if (a.bound !== b.bound) return a.bound.localeCompare(b.bound);
    return Number(a.service_type) - Number(b.service_type);
  });
  return matches;
}

function renderVariants() {
  const routeNo = state.selectedRoute;
  els.variants.hidden = false;
  els.variantsTitle.textContent = `${routeNo} · ${t("pickDirection")}`;
  els.variantList.innerHTML = "";
  state.variants.forEach((variant) => {
    const { orig, dest } = origDest(variant);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card-btn";
    if (
      state.selectedVariant &&
      state.selectedVariant.bound === variant.bound &&
      state.selectedVariant.service_type === variant.service_type
    ) {
      btn.classList.add("active");
    }
    const extra =
      String(variant.service_type) !== "1" ? ` · ${t("special")} ${variant.service_type}` : "";
    btn.innerHTML = `<div class="route-no">${escapeHtml(variant.route)}${escapeHtml(extra)}</div>
      <div>${escapeHtml(orig)} → ${escapeHtml(dest)}</div>
      <div class="muted">${escapeHtml(t("toward"))} ${escapeHtml(dest)}</div>`;
    btn.addEventListener("click", () => selectVariant(variant));
    els.variantList.appendChild(btn);
  });
}

async function selectVariant(variant) {
  state.selectedVariant = variant;
  renderVariants();
  els.stops.hidden = false;
  els.eta.hidden = true;
  state.selectedStop = null;
  clearEtaTimer();
  const { dest } = origDest(variant);
  els.stopsTitle.textContent = `${variant.route} ${t("toward")} ${dest}`;
  els.stopList.innerHTML = `<p class="muted">${t("loadingStops")}</p>`;
  ensureViewRouteMapButton();
  updateMapCaption();
  try {
    await loadAllStops();
    const json = await fetchJson(
      `${API}/route-stop/${variant.route}/${boundPath(variant.bound)}/${variant.service_type}`
    );
    const rows = json.data || [];
    state.stops = rows.map((row) => ({
      ...row,
      detail: state.stopsById.get(row.stop) || null,
    }));
    renderStops();
    await drawRouteOnMap(state.stops);
    updateMapCaption();
  } catch (error) {
    els.stopList.innerHTML = `<p class="muted">${t("loadError")}</p>`;
    console.error(error);
  }
}

function stopDistance(stop) {
  if (state.userLat == null || !stop?.detail) return null;
  const lat = Number(stop.detail.lat);
  const lng = Number(stop.detail.long);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return haversine(state.userLat, state.userLng, lat, lng);
}

function closestRouteStop() {
  let best = null;
  for (const stop of state.stops) {
    const distance = stopDistance(stop);
    if (distance == null) continue;
    if (!best || distance < best.distance) best = { stop, distance };
  }
  return best;
}

function renderStops() {
  els.stopList.innerHTML = "";
  if (!state.stops.length) return;

  const nearest = closestRouteStop();
  if (state.userLat == null) {
    const hint = document.createElement("p");
    hint.className = "muted";
    hint.textContent = t("needLocation");
    els.stopList.appendChild(hint);
  } else if (nearest) {
    const banner = document.createElement("button");
    banner.type = "button";
    banner.className = "card-btn closest-banner";
    const name = nearest.stop.detail ? nameOf(nearest.stop.detail) : nearest.stop.stop;
    banner.innerHTML = `<div class="closest-badge">${escapeHtml(t("closest"))}</div>
      <div><strong>${escapeHtml(name)}</strong></div>
      <div class="muted">${escapeHtml(t("closestHint"))} · ${Math.round(nearest.distance)} ${escapeHtml(t("metres"))}</div>`;
    banner.addEventListener("click", () => selectStop(nearest.stop));
    els.stopList.appendChild(banner);
  }

  state.stops.forEach((stop) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card-btn";
    const distance = stopDistance(stop);
    const isClosest = nearest && stop.stop === nearest.stop.stop;
    if (isClosest) btn.classList.add("closest");
    if (state.selectedStop && state.selectedStop.stop === stop.stop) btn.classList.add("active");
    const label = stop.detail ? nameOf(stop.detail) : stop.stop;
    const distLabel =
      distance == null ? "" : `<span class="distance">${Math.round(distance)} ${escapeHtml(t("metres"))}${isClosest ? ` · ${escapeHtml(t("closest"))}` : ""}</span>`;
    btn.innerHTML = `<div class="stop-row"><span><strong>${escapeHtml(stop.seq)}.</strong> ${escapeHtml(label)}</span>${distLabel}</div>`;
    btn.addEventListener("click", () => selectStop(stop));
    els.stopList.appendChild(btn);
  });
}

function favoriteKey(stop) {
  const v = state.selectedVariant;
  return `${v.route}|${v.bound}|${v.service_type}|${stop.stop}`;
}

function isFavorite(stop) {
  return state.favorites.some((item) => item.key === favoriteKey(stop));
}

function renderFavorites() {
  els.favorites.hidden = state.favorites.length === 0;
  els.favoriteList.innerHTML = "";
  state.favorites.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    const label = state.lang === "en" ? item.nameEn : item.nameTc;
    btn.textContent = `${item.route} · ${label}`;
    btn.addEventListener("click", async () => {
      setTab("search");
      els.input.value = item.route;
      await showRoute(item.route);
      const variant = state.variants.find(
        (v) => v.bound === item.bound && String(v.service_type) === String(item.serviceType)
      );
      if (variant) {
        await selectVariant(variant);
        const stop = state.stops.find((s) => s.stop === item.stopId);
        if (stop) selectStop(stop);
      }
    });
    els.favoriteList.appendChild(btn);
  });
}

function toggleFavorite() {
  if (!state.selectedStop || !state.selectedVariant) return;
  const stop = state.selectedStop;
  const key = favoriteKey(stop);
  if (isFavorite(stop)) {
    state.favorites = state.favorites.filter((item) => item.key !== key);
  } else {
    state.favorites.unshift({
      key,
      route: state.selectedVariant.route,
      bound: state.selectedVariant.bound,
      serviceType: state.selectedVariant.service_type,
      stopId: stop.stop,
      nameTc: stop.detail?.name_tc || stop.stop,
      nameEn: stop.detail?.name_en || stop.stop,
    });
  }
  saveFavorites();
  renderFavorites();
  renderEtaHeading();
}

function renderEtaHeading() {
  const stop = state.selectedStop;
  const variant = state.selectedVariant;
  if (!stop || !variant) return;
  const stopName = stop.detail ? nameOf(stop.detail) : stop.stop;
  const { dest } = origDest(variant);
  els.etaTitle.textContent = `${variant.route} · ${stopName}`;
  els.etaMeta.textContent = `${t("toward")} ${dest}`;
  els.favBtn.textContent = isFavorite(stop) ? "★" : "☆";
}

function minutesUntil(iso) {
  if (!iso) return null;
  return Math.round((new Date(iso).getTime() - Date.now()) / 60000);
}

function formatClock(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString(state.lang === "en" ? "en-HK" : "zh-HK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatWait(mins) {
  if (mins == null) return { label: t("noEta"), unit: "" };
  if (mins <= 0) return { label: t("arriving"), unit: "" };
  return { label: String(mins), unit: t("minutes") };
}

async function loadEta() {
  const stop = state.selectedStop;
  const variant = state.selectedVariant;
  if (!stop || !variant) return;
  try {
    const json = await fetchJson(
      `${API}/eta/${stop.stop}/${variant.route}/${variant.service_type}`
    );
    const rows = (json.data || []).filter((row) => row.dir === variant.bound);
    if (!rows.length) {
      els.etaList.innerHTML = `<p class="muted">${t("noEta")}</p>`;
    } else {
      els.etaList.innerHTML = "";
      rows.forEach((row) => {
        const wait = formatWait(minutesUntil(row.eta));
        const remark = state.lang === "en" ? row.rmk_en : row.rmk_tc;
        const item = document.createElement("div");
        item.className = "eta-row";
        item.innerHTML = `
          <div>
            <div><strong>${escapeHtml(t("clock"))} ${escapeHtml(formatClock(row.eta))}</strong></div>
            <div class="muted">${escapeHtml(remark || nameOf(row, "dest"))}</div>
          </div>
          <div class="minutes">${escapeHtml(wait.label)}<span>${escapeHtml(wait.unit)}</span></div>
        `;
        els.etaList.appendChild(item);
      });
    }
    els.etaUpdated.textContent = `${t("updated")} ${formatClock(json.generated_timestamp)}`;
  } catch (error) {
    els.etaList.innerHTML = `<p class="muted">${t("loadError")}</p>`;
    console.error(error);
  }
}

function clearEtaTimer() {
  if (state.etaTimer) {
    clearInterval(state.etaTimer);
    state.etaTimer = null;
  }
}

function selectStop(stop) {
  state.selectedStop = stop;
  renderStops();
  els.eta.hidden = false;
  renderEtaHeading();
  loadEta();
  clearEtaTimer();
  state.etaTimer = setInterval(loadEta, 30000);
  focusStopOnMap(stop);
  els.eta.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function showRoute(query) {
  const matches = searchRoutes(query);
  if (!matches.length) {
    setStatus(t("noRoute"));
    els.variants.hidden = true;
    els.stops.hidden = true;
    els.eta.hidden = true;
    return;
  }
  setStatus("");
  state.selectedRoute = matches[0].route;
  state.variants = state.routes.filter((r) => r.route === state.selectedRoute);
  state.selectedVariant = null;
  state.stops = [];
  state.selectedStop = null;
  els.stops.hidden = true;
  els.eta.hidden = true;
  clearEtaTimer();
  clearRouteLine();
  renderVariants();
}

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(a));
}

function inHongKong(lat, lng) {
  return lat >= 22.13 && lat <= 22.57 && lng >= 113.82 && lng <= 114.45;
}

async function loadAllStops() {
  if (state.allStops.length) return;
  if (state.stopsLoadPromise) return state.stopsLoadPromise;

  state.stopsLoadPromise = (async () => {
    try {
      const cached = JSON.parse(localStorage.getItem(STOPS_KEY) || "null");
      const age = cached?.savedAt ? Date.now() - cached.savedAt : Infinity;
      if (cached?.stops?.length && age < 20 * 60 * 60 * 1000) {
        state.allStops = cached.stops;
        state.stopsById = new Map(cached.stops.map((s) => [s.stop, s]));
        return;
      }
    } catch {
      /* ignore bad cache */
    }
    const json = await fetchJson(`${API}/stop`);
    const stops = (json.data || []).map((s) => ({
      stop: s.stop,
      name_tc: s.name_tc,
      name_en: s.name_en,
      lat: Number(s.lat),
      long: Number(s.long),
    }));
    state.allStops = stops;
    state.stopsById = new Map(stops.map((s) => [s.stop, s]));
    try {
      localStorage.setItem(STOPS_KEY, JSON.stringify({ savedAt: Date.now(), stops }));
    } catch {
      /* storage full */
    }
  })();

  try {
    await state.stopsLoadPromise;
  } finally {
    state.stopsLoadPromise = null;
  }
}

function groupStopEta(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = `${row.route}|${row.dir}|${row.dest_tc}`;
    if (!groups.has(key)) {
      groups.set(key, {
        route: row.route,
        dir: row.dir,
        service_type: row.service_type,
        dest_tc: row.dest_tc,
        dest_en: row.dest_en,
        etas: [],
      });
    }
    if (row.eta) groups.get(key).etas.push(row);
  }
  return [...groups.values()]
    .map((group) => {
      group.etas.sort((a, b) => new Date(a.eta) - new Date(b.eta));
      const mins = minutesUntil(group.etas[0]?.eta);
      group.nextMins = Number.isFinite(mins) ? mins : null;
      return group;
    })
    .sort((a, b) => (a.nextMins ?? 9999) - (b.nextMins ?? 9999));
}

async function refreshNearbyEtas(seq = state.nearbySeq) {
  if (!state.nearbyStops.length) return;
  state.nearbyEtaPending = true;
  renderNearbyMeta();

  const stopsSnapshot = state.nearbyStops.map((stop) => stop.stop);
  try {
    const results = await Promise.all(
      state.nearbyStops.map(async (stop) => {
        try {
          const json = await fetchJson(`${API}/stop-eta/${stop.stop}`);
          return { ...stop, groups: groupStopEta(json.data || []) };
        } catch {
          return { ...stop, groups: stop.groups ?? [] };
        }
      })
    );

    if (seq !== state.nearbySeq) return;
    const stillSame =
      results.length === stopsSnapshot.length &&
      results.every((stop, i) => stop.stop === stopsSnapshot[i]);
    if (!stillSame) return;

    state.nearbyStops = results;
    state.nearbyUpdatedAt = new Date();
    renderNearbyList();
    plotNearbyStops();
  } finally {
    if (seq === state.nearbySeq) {
      state.nearbyEtaPending = false;
      renderNearbyMeta();
    }
  }
}

function nearestStops(lat, lng) {
  const ranked = state.allStops
    .map((stop) => ({
      ...stop,
      distance: haversine(lat, lng, stop.lat, stop.long),
    }))
    .sort((a, b) => a.distance - b.distance);
  let picked = ranked.filter((s) => s.distance <= NEARBY_RADIUS_M).slice(0, NEARBY_LIMIT);
  if (picked.length < 3) {
    picked = ranked.filter((s) => s.distance <= NEARBY_FALLBACK_M).slice(0, NEARBY_LIMIT);
  }
  if (!picked.length) picked = ranked.slice(0, NEARBY_LIMIT);
  return picked;
}

function renderNearbyList() {
  if (!state.nearbyStops.length) {
    if (!els.nearbyStatus.textContent) els.nearbyList.innerHTML = "";
    return;
  }
  els.nearbyList.innerHTML = "";
  state.nearbyStops.forEach((stop) => {
    const card = document.createElement("article");
    card.className = "stop-card";
    card.dataset.stopId = stop.stop;
    if (state.selectedNearbyStopId === stop.stop) card.classList.add("active");
    const name = nameOf(stop);
    const metres = Math.round(stop.distance);
    const etasLoading = stop.groups == null;
    const routes = (stop.groups || [])
      .filter((group) => group.nextMins != null)
      .slice(0, 6);
    let routesHtml;
    if (etasLoading) {
      routesHtml = `<div class="eta-skeleton" aria-hidden="true">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
        </div>`;
    } else if (routes.length) {
      routesHtml = routes
        .map((group) => {
          const wait = formatWait(group.nextMins);
          const dest = state.lang === "en" ? group.dest_en : group.dest_tc;
          return `<button type="button" class="route-row" data-route="${escapeHtml(group.route)}" data-dir="${escapeHtml(group.dir)}" data-service="${escapeHtml(group.service_type)}" data-stop="${escapeHtml(stop.stop)}">
              <div>
                <div class="route-no">${escapeHtml(group.route)}</div>
                <div class="muted">${escapeHtml(t("toward"))} ${escapeHtml(dest)}</div>
              </div>
              <div class="minutes">${escapeHtml(wait.label)}<span>${escapeHtml(wait.unit)}</span></div>
            </button>`;
        })
        .join("");
    } else {
      routesHtml = `<p class="muted">${t("noEta")}</p>`;
    }
    card.innerHTML = `<header>
        <strong>${escapeHtml(name)}</strong>
        <span class="distance">${metres} ${escapeHtml(t("metres"))}</span>
      </header>
      <div class="eta-list">${routesHtml}</div>`;
    card.querySelector("header").addEventListener("click", () => {
      state.selectedNearbyStopId = stop.stop;
      renderNearbyList();
      focusNearbyStop(stop);
    });
    card.querySelectorAll(".route-row").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        event.stopPropagation();
        await openNearbyRoute(btn.dataset);
      });
    });
    els.nearbyList.appendChild(card);
  });
}

async function openNearbyRoute({ route, dir, service, stop }) {
  setTab("search");
  els.input.value = route;
  await loadRoutes();
  await showRoute(route);
  const variant = state.variants.find(
    (v) => v.bound === dir && String(v.service_type) === String(service)
  );
  if (variant) {
    await selectVariant(variant);
    const match = state.stops.find((s) => s.stop === stop);
    if (match) selectStop(match);
  }
}

function setTab(tab) {
  state.tab = tab;
  els.tabNearby.classList.toggle("active", tab === "nearby");
  els.tabSearch.classList.toggle("active", tab === "search");
  els.nearbyPanel.hidden = tab !== "nearby";
  els.searchPanel.hidden = tab !== "search";
  refreshMapAfterLayout();
  updateMapCaption();
  if (tab === "nearby") {
    startNearbyLoop();
  } else {
    stopNearbyLoop();
  }
}

function refreshMapAfterLayout() {
  requestAnimationFrame(() => {
    mapCtl.map?.invalidateSize();
    requestAnimationFrame(() => {
      mapCtl.map?.invalidateSize();
      fitMapToContext({ animate: false });
    });
  });
}

function currentRouteCaption() {
  if (state.selectedVariant) {
    const { dest } = origDest(state.selectedVariant);
    return {
      title: `${state.selectedVariant.route} ${t("toward")} ${dest}`,
      sub: t("mapRouteHint"),
    };
  }
  if (state.tab === "nearby" && state.nearbyStops.length) {
    return { title: t("nearbyTitle"), sub: t("mapNearbyHint") };
  }
  return { title: t("title"), sub: t("mapNearbyHint") };
}

function updateMapCaption() {
  if (!els.mapCaption) return;
  const { title, sub } = currentRouteCaption();
  els.mapCaptionTitle.textContent = title;
  els.mapCaptionSub.textContent = sub;
  els.mapCaption.hidden = !state.mapExpanded;
}

function updateMapExpandUi() {
  const expanded = state.mapExpanded;
  document.body.classList.toggle("map-expanded", expanded);
  if (els.expandMapBtn) {
    els.expandMapBtn.setAttribute("aria-pressed", expanded ? "true" : "false");
    const label = expanded ? t("collapseMap") : t("expandMap");
    const textNode = els.expandMapBtn.querySelector("[data-i18n]");
    if (textNode) {
      textNode.dataset.i18n = expanded ? "collapseMap" : "expandMap";
      textNode.textContent = label;
    }
    const icon = els.expandMapBtn.querySelector(".map-btn-icon");
    if (icon) icon.textContent = expanded ? "⤓" : "⛶";
  }
  if (els.collapseMapBtn) els.collapseMapBtn.textContent = t("collapseMap");
  updateMapCaption();
  ensureViewRouteMapButton();
}

function setMapExpanded(expanded) {
  if (state.mapExpanded === expanded) {
    refreshMapAfterLayout();
    return;
  }
  state.mapExpanded = expanded;
  updateMapExpandUi();
  refreshMapAfterLayout();
}

function toggleMapExpanded() {
  setMapExpanded(!state.mapExpanded);
}

function fitMapToContext({ animate = true } = {}) {
  if (!mapCtl.map) return;
  if (mapCtl.routeLine) {
    mapCtl.map.fitBounds(mapCtl.routeLine.getBounds(), {
      padding: state.mapExpanded ? [48, 48] : [30, 30],
      maxZoom: state.mapExpanded ? 15 : 16,
      animate,
    });
    return;
  }
  if (state.tab === "nearby" && state.nearbyStops.length) {
    const bounds = [];
    if (state.userLat != null) bounds.push([state.userLat, state.userLng]);
    state.nearbyStops.forEach((stop) => bounds.push([stop.lat, stop.long]));
    if (bounds.length > 1) {
      mapCtl.map.fitBounds(bounds, {
        padding: state.mapExpanded ? [40, 40] : [28, 28],
        maxZoom: 17,
        animate,
      });
    }
  }
}

function ensureViewRouteMapButton() {
  if (!els.viewRouteMapBtn) return;
  els.viewRouteMapBtn.textContent = t("viewRouteMap");
  els.viewRouteMapBtn.hidden = !state.selectedVariant || els.stops.hidden;
}

function userIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50%;background:#2f80ed;border:3px solid #fff;box-shadow:0 0 0 2px #2f80ed88"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function stopIcon(active) {
  const color = active ? "#d94f30" : "#0b4f6c";
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function initMap() {
  mapCtl.map = L.map("map", { zoomControl: true }).setView(HK_CENTER, 12);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(mapCtl.map);
  mapCtl.stopLayer = L.layerGroup().addTo(mapCtl.map);
}

function refreshMapLabels() {
  if (mapCtl.userMarker) mapCtl.userMarker.bindPopup(t("you"));
}

function updateUserMarker(lat, lng, fly = false) {
  const latlng = [lat, lng];
  if (!mapCtl.userMarker) {
    mapCtl.userMarker = L.marker(latlng, { icon: userIcon(), zIndexOffset: 600 }).addTo(mapCtl.map);
    mapCtl.userMarker.bindPopup(t("you"));
  } else {
    mapCtl.userMarker.setLatLng(latlng);
  }
  if (fly) mapCtl.map.setView(latlng, 16);
}

function plotNearbyStops() {
  if (!mapCtl.stopLayer) return;
  mapCtl.stopLayer.clearLayers();
  const bounds = [];
  if (state.userLat != null) bounds.push([state.userLat, state.userLng]);
  state.nearbyStops.forEach((stop) => {
    const active = stop.stop === state.selectedNearbyStopId;
    const marker = L.marker([stop.lat, stop.long], { icon: stopIcon(active) });
    marker.bindPopup(nameOf(stop));
    marker.on("click", () => {
      state.selectedNearbyStopId = stop.stop;
      setTab("nearby");
      renderNearbyList();
      const card = [...els.nearbyList.children].find((node) =>
        node.querySelector(`[data-stop="${stop.stop}"]`)
      );
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    marker.addTo(mapCtl.stopLayer);
    bounds.push([stop.lat, stop.long]);
  });
  if (state.tab === "nearby" && bounds.length > 1) {
    mapCtl.map.fitBounds(bounds, { padding: [28, 28], maxZoom: 17 });
  }
}

const ROUTE_LINE_STYLE = {
  color: "#d94f30",
  weight: 5,
  opacity: 0.92,
  lineJoin: "round",
  lineCap: "round",
};

function clearRouteLine() {
  if (mapCtl.routeLine) {
    mapCtl.map.removeLayer(mapCtl.routeLine);
    mapCtl.routeLine = null;
  }
  if (mapCtl.routeStopsLayer) {
    mapCtl.map.removeLayer(mapCtl.routeStopsLayer);
    mapCtl.routeStopsLayer = null;
  }
}

function stopLatLngs(stops) {
  return stops
    .map((s) => s.detail)
    .map((d) =>
      d
        ? [Number(d.lat), Number(d.long)]
        : null
    )
    .filter((p) => p && Number.isFinite(p[0]) && Number.isFinite(p[1]));
}

function fitRouteBounds(layerOrPoints) {
  const bounds = Array.isArray(layerOrPoints)
    ? L.latLngBounds(layerOrPoints)
    : layerOrPoints.getBounds();
  if (!bounds.isValid()) return;
  if (state.userLat != null) bounds.extend([state.userLat, state.userLng]);
  mapCtl.map.fitBounds(bounds, {
    padding: state.mapExpanded ? [48, 48] : [30, 30],
    maxZoom: state.mapExpanded ? 15 : 16,
  });
}

function drawRouteStopMarkers(stops) {
  if (mapCtl.routeStopsLayer) {
    mapCtl.map.removeLayer(mapCtl.routeStopsLayer);
  }
  mapCtl.routeStopsLayer = L.layerGroup().addTo(mapCtl.map);
  stops.forEach((stop) => {
    const detail = stop.detail;
    if (!detail || !Number.isFinite(detail.lat)) return;
    L.circleMarker([detail.lat, detail.long], {
      radius: 5,
      color: "#fff",
      weight: 2,
      fillColor: "#0b4f6c",
      fillOpacity: 1,
    })
      .bindPopup(nameOf(detail))
      .addTo(mapCtl.routeStopsLayer);
  });
}

function flattenGeoLatLngs(geo) {
  const out = [];
  const walk = (node) => {
    if (!node) return;
    if (Array.isArray(node) && node.length >= 2 && typeof node[0] === "number") {
      const [lng, lat] = node;
      if (Number.isFinite(lat) && Number.isFinite(lng)) out.push([lat, lng]);
      return;
    }
    if (Array.isArray(node)) node.forEach(walk);
    else if (node.coordinates) walk(node.coordinates);
    else if (node.geometry) walk(node.geometry);
    else if (Array.isArray(node.features)) node.features.forEach(walk);
  };
  walk(geo);
  return out.filter((point, i, arr) => {
    if (i === 0) return true;
    return point[0] !== arr[i - 1][0] || point[1] !== arr[i - 1][1];
  });
}

async function loadGtfsMap() {
  if (mapCtl.gtfsMap) return mapCtl.gtfsMap;
  const json = await fetchJson("gtfs-map.json");
  mapCtl.gtfsMap = json;
  return json;
}

async function fetchWaypointGeo(gtfsId, dir) {
  const file = `${gtfsId}-${dir}.json`;
  const urls = [
    `${WAYPOINTS_URL}/${file}`,
    `https://cdn.jsdelivr.net/gh/hkbus/route-waypoints@gh-pages/${file}`,
    `https://raw.githubusercontent.com/hkbus/route-waypoints/gh-pages/${file}`,
  ];
  for (const url of urls) {
    try {
      const json = await fetchJson(url);
      const points = flattenGeoLatLngs(json);
      if (points.length > 4) return points;
    } catch {
      /* try next host */
    }
  }
  return null;
}

async function officialRoutePath(variant) {
  if (!variant) return null;
  const cacheKey = `${variant.route}|${variant.bound}|${variant.service_type}`;
  if (mapCtl.geoCache?.has(cacheKey)) return mapCtl.geoCache.get(cacheKey);
  const ids = await loadGtfsMap();
  const gtfsId = ids[cacheKey] || ids[`${variant.route}|${variant.bound}|1`];
  if (!gtfsId) return null;
  const points = await fetchWaypointGeo(gtfsId, variant.bound === "I" ? "I" : "O");
  if (points) {
    if (!mapCtl.geoCache) mapCtl.geoCache = new Map();
    mapCtl.geoCache.set(cacheKey, points);
  }
  return points;
}

async function osrmChunk(points) {
  const path = points.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const radiuses = points.map(() => 120).join(";");
  const json = await fetchJson(
    `https://router.project-osrm.org/route/v1/driving/${path}?overview=full&geometries=geojson&continue_straight=true&radiuses=${radiuses}`
  );
  if (json.code !== "Ok" || !json.routes?.[0]?.geometry?.coordinates) return [];
  return json.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
}

async function osrmFollowRoads(points) {
  if (points.length < 2) return [];
  const all = [];
  const size = 10;
  for (let i = 0; i < points.length - 1; i += size - 1) {
    const chunk = points.slice(i, i + size);
    let coords = [];
    try {
      coords = await osrmChunk(chunk);
    } catch {
      coords = [];
    }
    if (coords.length < 2) {
      coords = chunk;
    }
    if (all.length) coords = coords.slice(1);
    all.push(...coords);
  }
  return all;
}

function paintPolyline(points) {
  if (points.length < 2) return;
  if (mapCtl.routeLine) {
    mapCtl.map.removeLayer(mapCtl.routeLine);
    mapCtl.routeLine = null;
  }
  mapCtl.routeLine = L.polyline(points, { ...ROUTE_LINE_STYLE, smoothFactor: 0 }).addTo(
    mapCtl.map
  );
  fitRouteBounds(points);
}

async function drawRouteOnMap(stops) {
  const seq = ++mapCtl.drawSeq;
  const fallback = stopLatLngs(stops);
  clearRouteLine();
  drawRouteStopMarkers(stops);
  let path = fallback;
  try {
    const official = await officialRoutePath(state.selectedVariant);
    if (seq !== mapCtl.drawSeq) return;
    if (official && official.length > 10) path = official;
  } catch (error) {
    console.error(error);
  }
  if (path === fallback || path.length <= fallback.length) {
    try {
      const road = await osrmFollowRoads(fallback);
      if (seq !== mapCtl.drawSeq) return;
      if (road.length > 10) path = road;
    } catch (error) {
      console.error(error);
    }
  }
  if (seq !== mapCtl.drawSeq) return;
  if (path.length >= 2) paintPolyline(path);
}

function focusStopOnMap(stop) {
  const detail = stop.detail;
  if (!detail || !Number.isFinite(detail.lat)) return;
  mapCtl.map.setView([detail.lat, detail.long], 17);
  L.popup().setLatLng([detail.lat, detail.long]).setContent(nameOf(detail)).openOn(mapCtl.map);
}

function focusNearbyStop(stop) {
  plotNearbyStops();
  mapCtl.map.setView([stop.lat, stop.long], 17);
}

function startNearbyLoop() {
  stopNearbyLoop();
  if (!state.nearbyStops.length || state.tab !== "nearby") return;
  state.nearbyTimer = setInterval(() => {
    refreshNearbyEtas(state.nearbySeq).catch((error) => console.error(error));
  }, 30000);
}

function stopNearbyLoop() {
  if (state.nearbyTimer) {
    clearInterval(state.nearbyTimer);
    state.nearbyTimer = null;
  }
}

async function applyPosition(lat, lng, fly = true) {
  const seq = ++state.nearbySeq;
  state.userLat = lat;
  state.userLng = lng;
  updateUserMarker(lat, lng, fly);

  if (!inHongKong(lat, lng)) {
    stopNearbyLoop();
    state.nearbyStops = [];
    state.nearbyUpdatedAt = null;
    state.nearbyEtaPending = false;
    els.nearbyList.innerHTML = "";
    setNearbyStatus(t("tooFar"));
    renderNearbyMeta();
    mapCtl.map.setView(HK_CENTER, 12);
    return;
  }

  const softReload = state.allStops.length > 0 && state.nearbyStops.length > 0;
  if (!softReload) setNearbyStatus(t("loadingStops"), { loading: true });
  try {
    await loadAllStops();
    if (seq !== state.nearbySeq) return;

    const previousGroups = new Map(
      state.nearbyStops.map((stop) => [stop.stop, stop.groups])
    );
    state.nearbyStops = nearestStops(lat, lng).map((stop) => ({
      ...stop,
      // Keep prior ETAs on soft relocate so the list never blanks while refetching.
      groups: previousGroups.has(stop.stop) ? previousGroups.get(stop.stop) : null,
    }));
    if (!softReload) state.nearbyUpdatedAt = null;
    state.nearbyEtaPending = true;

    if (!state.nearbyStops.length) {
      setNearbyStatus(t("noNearby"));
      renderNearbyMeta();
      stopNearbyLoop();
      return;
    }

    // Paint stops immediately so the panel never stays on a blank/loading screen
    // while arrival times are still in flight.
    setNearbyStatus("");
    renderNearbyList();
    renderNearbyMeta();
    plotNearbyStops();
    startNearbyLoop();

    await refreshNearbyEtas(seq);
    if (seq !== state.nearbySeq) return;
    if (state.stops.length) renderStops();
  } catch (error) {
    if (seq !== state.nearbySeq) return;
    console.error(error);
    state.nearbyEtaPending = false;
    if (!state.nearbyStops.length) {
      setNearbyStatus(t("loadError"));
      els.nearbyList.innerHTML = "";
    } else {
      setNearbyStatus("");
      renderNearbyList();
    }
    renderNearbyMeta();
  }
}

function handleGeoError(error) {
  if (state.userLat != null || state.nearbyStops.length) return;
  if (error?.code === 1) setNearbyStatus(t("locatingDenied"));
  else setNearbyStatus(t("locatingError"));
}

function requestLocation(fly = true) {
  if (!navigator.geolocation) {
    setNearbyStatus(t("locatingError"));
    return;
  }
  if (state.userLat == null && !state.nearbyStops.length) {
    setNearbyStatus(t("locating"), { loading: true });
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => applyPosition(pos.coords.latitude, pos.coords.longitude, fly),
    handleGeoError,
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 15000 }
  );
  if (state.watchId == null) {
    state.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (state.userLat == null) return;
        const moved = haversine(state.userLat, state.userLng, latitude, longitude);
        if (moved > 40) applyPosition(latitude, longitude, false);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000 }
    );
  }
}

function setTabFromButton(tab) {
  setTab(tab);
  if (tab === "nearby" && state.userLat == null) requestLocation();
}

els.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await loadRoutes();
    await showRoute(els.input.value);
  } catch (error) {
    setStatus(t("loadError"));
    console.error(error);
  }
});

els.langBtn.addEventListener("click", () => {
  state.lang = state.lang === "en" ? "tc" : "en";
  localStorage.setItem(LANG_KEY, state.lang);
  applyLang();
});

els.backBtn.addEventListener("click", () => {
  els.stops.hidden = true;
  els.eta.hidden = true;
  state.selectedStop = null;
  clearEtaTimer();
  ensureViewRouteMapButton();
  updateMapCaption();
});

els.favBtn.addEventListener("click", toggleFavorite);
els.locateBtn.addEventListener("click", () => requestLocation(true));
els.expandMapBtn?.addEventListener("click", () => toggleMapExpanded());
els.collapseMapBtn?.addEventListener("click", () => setMapExpanded(false));
els.viewRouteMapBtn?.addEventListener("click", () => {
  setMapExpanded(true);
});
els.tabNearby.addEventListener("click", () => setTabFromButton("nearby"));
els.tabSearch.addEventListener("click", () => setTabFromButton("search"));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.mapExpanded) setMapExpanded(false);
});

window.addEventListener("resize", () => {
  if (!mapCtl.map) return;
  mapCtl.map.invalidateSize();
});

initMap();
applyLang();
updateMapExpandUi();
renderFavorites();
loadRoutes().catch((error) => {
  setNearbyStatus(t("loadError"));
  console.error(error);
});
requestLocation(true);
