const KMB_API = "https://data.etabus.gov.hk/v1/transport/kmb";
const CTB_API = "https://rt.data.gov.hk/v2/transport/citybus";
const WAYPOINTS_URL = "https://hkbus.github.io/route-waypoints";
const FAVORITES_KEY = "hk-arrivals-favorites";
const LANG_KEY = "hk-arrivals-lang";
const STOPS_KEY = "hk-arrivals-stops-v3";
const HK_CENTER = [22.3193, 114.1694];
const NEARBY_LIMIT = 10;
const NEARBY_RADIUS_M = 500;
const NEARBY_FALLBACK_M = 1200;
const DISTANCE_DISPLAY_CAP_M = 400;
const CTB_ETA_CONCURRENCY = 6;

const I18N = {
  tc: {
    title: "站頭",
    subtitle: "香港巴士站頭 · 附近車站 · 路線地圖",
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
    footer: "到站資料來自香港政府開放數據（九巴／龍運／城巴），約每分鐘更新。本頁並非任何巴士公司的官方應用程式。",
    placeholder: "例如 A31、A11、1、104",
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
    noRoute: "找不到呢條路線。試下 A31、A11、1、104。",
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
    coKmb: "九巴／龍運",
    coCtb: "城巴",
    accountGuest: "訪客",
    accountTitle: "帳戶（可選）",
    accountLead: "登入後可同步常用車站。唔登入都可以用，資料會留喺呢部裝置（唔係 cookie）。",
    accountLocalMode: "而家係裝置帳戶模式：同一部裝置可以登入，跨裝置同步要設定 Firebase（見 config.example.js）。",
    accountCloudMode: "已開啟雲端同步：登入後常用車站會跟住你嘅帳戶。",
    accountSignedInLocal: "已登入（呢部裝置）",
    accountSignedInCloud: "已登入（雲端同步）",
    accountSyncGuest: "儲存於此裝置",
    accountSyncLocal: "已連結帳戶 · 此裝置",
    accountSyncCloud: "已同步到雲端帳戶",
    email: "電郵",
    password: "密碼",
    mergeGuest: "登入時合併呢部裝置已儲存嘅常用車站",
    signIn: "登入",
    register: "建立帳戶",
    signOut: "登出",
    close: "關閉",
    accountErrorEmail: "請輸入有效電郵。",
    accountErrorPassword: "密碼至少 6 個字元。",
    accountErrorExists: "呢個電郵已經註冊，試下直接登入。",
    accountErrorNotFound: "搵唔到帳戶，試下建立新帳戶。",
    accountErrorBadPass: "電郵或密碼不正確。",
    accountErrorGeneric: "帳戶操作失敗，請再試一次。",
  },
  en: {
    title: "busStop",
    subtitle: "Hong Kong bus stops · nearby · route map",
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
    footer: "Arrival times come from Hong Kong government open data (KMB / LWB / Citybus), updated about every minute. This is not an official app of any bus company.",
    placeholder: "e.g. A31, A11, 1, 104",
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
    noRoute: "No matching route. Try A31, A11, 1, or 104.",
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
    coKmb: "KMB / LWB",
    coCtb: "Citybus",
    accountGuest: "Guest",
    accountTitle: "Account (optional)",
    accountLead: "Sign in to sync saved stops. You can keep using the app as a guest — favorites stay on this device (local storage, not cookies).",
    accountLocalMode: "On-device accounts are active. Add Firebase in config.js (see config.example.js) to sync across devices.",
    accountCloudMode: "Cloud sync is on. Signed-in favorites follow your account.",
    accountSignedInLocal: "Signed in (this device)",
    accountSignedInCloud: "Signed in (cloud sync)",
    accountSyncGuest: "Saved on this device",
    accountSyncLocal: "Linked to account · this device",
    accountSyncCloud: "Synced to your cloud account",
    email: "Email",
    password: "Password",
    mergeGuest: "Merge favorites already saved on this device when signing in",
    signIn: "Sign in",
    register: "Create account",
    signOut: "Sign out",
    close: "Close",
    accountErrorEmail: "Enter a valid email.",
    accountErrorPassword: "Password must be at least 6 characters.",
    accountErrorExists: "That email is already registered. Try signing in.",
    accountErrorNotFound: "No account found. Try creating one.",
    accountErrorBadPass: "Incorrect email or password.",
    accountErrorGeneric: "Account action failed. Please try again.",
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
  routesLoadPromise: null,
  mapExpanded: true,
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
  layoutTimer: null,
  resizeObserver: null,
  sizeAnimTimer: null,
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
  accountBtn: document.getElementById("account-btn"),
  accountDialog: document.getElementById("account-dialog"),
  accountForm: document.getElementById("account-form"),
  accountLead: document.getElementById("account-dialog-lead"),
  accountModeHint: document.getElementById("account-mode-hint"),
  accountSignedOut: document.getElementById("account-signed-out"),
  accountSignedIn: document.getElementById("account-signed-in"),
  accountEmail: document.getElementById("account-email"),
  accountPassword: document.getElementById("account-password"),
  accountMergeGuest: document.getElementById("account-merge-guest"),
  accountError: document.getElementById("account-error"),
  accountLoginBtn: document.getElementById("account-login-btn"),
  accountRegisterBtn: document.getElementById("account-register-btn"),
  accountLogoutBtn: document.getElementById("account-logout-btn"),
  accountCloseBtn: document.getElementById("account-close-btn"),
  accountUserLine: document.getElementById("account-user-line"),
  accountSyncLine: document.getElementById("account-sync-line"),
  favoritesSyncNote: document.getElementById("favorites-sync-note"),
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

function companyOf(item) {
  return String(item?.co || "KMB").toUpperCase() === "CTB" ? "CTB" : "KMB";
}

function companyLabel(co) {
  return companyOf({ co }) === "CTB" ? t("coCtb") : t("coKmb");
}

function stopKey(co, stopId) {
  return `${companyOf({ co })}:${stopId}`;
}

function routeVariantKey(variant) {
  return `${companyOf(variant)}|${variant.route}|${variant.bound}|${variant.service_type}`;
}

function sameVariant(a, b) {
  if (!a || !b) return false;
  return (
    companyOf(a) === companyOf(b) &&
    a.route === b.route &&
    a.bound === b.bound &&
    String(a.service_type) === String(b.service_type)
  );
}

function boundPath(bound) {
  return bound === "I" ? "inbound" : "outbound";
}

function readFavorites() {
  if (window.HKBusAccount) return window.HKBusAccount.readGuestFavorites();
  try {
    const next = localStorage.getItem(FAVORITES_KEY);
    if (next) return JSON.parse(next);
    const legacy = localStorage.getItem("kmb-arrivals-favorites");
    return legacy ? JSON.parse(legacy) : [];
  } catch {
    return [];
  }
}

async function saveFavorites() {
  if (window.HKBusAccount) {
    try {
      state.favorites = await window.HKBusAccount.saveFavorites(state.favorites);
    } catch (error) {
      console.error(error);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
    }
    renderAccountChrome();
    return;
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
}

function accountErrorMessage(code) {
  if (code === "email") return t("accountErrorEmail");
  if (code === "password") return t("accountErrorPassword");
  if (code === "exists") return t("accountErrorExists");
  if (code === "notfound") return t("accountErrorNotFound");
  if (code === "badpass") return t("accountErrorBadPass");
  return t("accountErrorGeneric");
}

function renderAccountChrome() {
  const user = window.HKBusAccount?.getUser?.() || null;
  const cloud = Boolean(window.HKBusAccount?.cloudConfigured?.());
  if (els.accountBtn) {
    els.accountBtn.textContent = user ? user.email : t("accountGuest");
    els.accountBtn.title = user
      ? user.cloud
        ? t("accountSignedInCloud")
        : t("accountSignedInLocal")
      : t("accountGuest");
  }
  if (els.favoritesSyncNote) {
    if (user?.cloud) els.favoritesSyncNote.textContent = t("accountSyncCloud");
    else if (user) els.favoritesSyncNote.textContent = t("accountSyncLocal");
    else els.favoritesSyncNote.textContent = t("accountSyncGuest");
  }
  if (els.accountModeHint) {
    els.accountModeHint.textContent = cloud ? t("accountCloudMode") : t("accountLocalMode");
  }
  if (els.accountSignedOut && els.accountSignedIn) {
    els.accountSignedOut.hidden = Boolean(user);
    els.accountSignedIn.hidden = !user;
  }
  if (user && els.accountUserLine) {
    els.accountUserLine.textContent = user.email;
  }
  if (els.accountSyncLine) {
    els.accountSyncLine.textContent = user?.cloud
      ? t("accountSignedInCloud")
      : user
        ? t("accountSignedInLocal")
        : "";
  }
}

function openAccountDialog() {
  if (!els.accountDialog) return;
  renderAccountChrome();
  if (els.accountError) {
    els.accountError.hidden = true;
    els.accountError.textContent = "";
  }
  if (els.accountPassword) els.accountPassword.value = "";
  if (typeof els.accountDialog.showModal === "function") els.accountDialog.showModal();
  else els.accountDialog.setAttribute("open", "open");
}

function closeAccountDialog() {
  if (!els.accountDialog) return;
  if (typeof els.accountDialog.close === "function") els.accountDialog.close();
  else els.accountDialog.removeAttribute("open");
}

async function refreshFavoritesFromAccount() {
  if (!window.HKBusAccount) return;
  state.favorites = await window.HKBusAccount.loadFavorites();
  renderFavorites();
  renderEtaHeading();
  renderAccountChrome();
}

async function handleAccountAuth(mode) {
  if (!window.HKBusAccount) return;
  const email = els.accountEmail?.value || "";
  const password = els.accountPassword?.value || "";
  const mergeGuest = Boolean(els.accountMergeGuest?.checked);
  if (els.accountError) {
    els.accountError.hidden = true;
    els.accountError.textContent = "";
  }
  try {
    if (mode === "register") {
      state.favorites = await window.HKBusAccount.register(email, password, { mergeGuest });
    } else {
      state.favorites = await window.HKBusAccount.login(email, password, { mergeGuest });
    }
    renderFavorites();
    renderEtaHeading();
    renderAccountChrome();
    closeAccountDialog();
  } catch (error) {
    const code = error?.message || "generic";
    if (els.accountError) {
      els.accountError.hidden = false;
      els.accountError.textContent = accountErrorMessage(code);
    }
    console.error(error);
  }
}

async function handleAccountLogout() {
  if (!window.HKBusAccount) return;
  state.favorites = await window.HKBusAccount.logout({ keepLocalCopy: true });
  renderFavorites();
  renderEtaHeading();
  renderAccountChrome();
  closeAccountDialog();
}

function applyLang() {
  document.documentElement.lang = state.lang === "en" ? "en" : "zh-HK";
  document.title = `${t("title")} · ${state.lang === "en" ? "Hong Kong bus map" : "香港巴士地圖"}`;
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
  renderAccountChrome();
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function normalizeKmbRoutes(rows) {
  return (rows || []).map((row) => ({
    ...row,
    co: "KMB",
    service_type: String(row.service_type ?? "1"),
  }));
}

function normalizeCtbRoutes(rows) {
  const out = [];
  for (const row of rows || []) {
    out.push({
      co: "CTB",
      route: row.route,
      bound: "O",
      service_type: "1",
      orig_en: row.orig_en,
      orig_tc: row.orig_tc,
      dest_en: row.dest_en,
      dest_tc: row.dest_tc,
    });
    out.push({
      co: "CTB",
      route: row.route,
      bound: "I",
      service_type: "1",
      orig_en: row.dest_en,
      orig_tc: row.dest_tc,
      dest_en: row.orig_en,
      dest_tc: row.orig_tc,
    });
  }
  return out;
}

async function loadRoutes({ force = false } = {}) {
  if (!force && routesLookComplete(state.routes)) return;
  if (state.routesLoadPromise) return state.routesLoadPromise;

  state.routesLoadPromise = (async () => {
    const results = await Promise.allSettled([
      fetchJson(`${KMB_API}/route`),
      fetchJson(`${CTB_API}/route/CTB`),
    ]);
    const routes = [];
    if (results[0].status === "fulfilled") {
      routes.push(...normalizeKmbRoutes(results[0].value.data));
    } else {
      console.error(results[0].reason);
    }
    if (results[1].status === "fulfilled") {
      routes.push(...normalizeCtbRoutes(results[1].value.data));
    } else {
      console.error(results[1].reason);
    }
    if (!routes.length) throw new Error("No routes loaded");
    state.routes = routes;
  })();

  try {
    await state.routesLoadPromise;
  } finally {
    state.routesLoadPromise = null;
  }
}

function routesLookComplete(routes) {
  if (!Array.isArray(routes) || routes.length < 400) return false;
  let kmb = 0;
  let ctb = 0;
  for (const route of routes) {
    const co = companyOf(route);
    if (co === "KMB") kmb += 1;
    else if (co === "CTB") ctb += 1;
  }
  // Avoid locking in a CTB-only (or tiny) list that makes KMB searches look "gone".
  return kmb > 200 && ctb > 50;
}

function normalizeRouteQuery(query) {
  return String(query || "")
    .trim()
    .replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xff10 + 0x30))
    .replace(/[Ａ-Ｚａ-ｚ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xff21 + 0x41))
    .toUpperCase();
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
  const q = normalizeRouteQuery(query);
  if (!q) return [];
  const matches = state.routes.filter((r) => String(r.route || "").toUpperCase().includes(q));
  matches.sort((a, b) => {
    const aRoute = String(a.route || "").toUpperCase();
    const bRoute = String(b.route || "").toUpperCase();
    const aExact = aRoute === q ? 0 : aRoute.startsWith(q) ? 1 : 2;
    const bExact = bRoute === q ? 0 : bRoute.startsWith(q) ? 1 : 2;
    if (aExact !== bExact) return aExact - bExact;
    if (aRoute.length !== bRoute.length) return aRoute.length - bRoute.length;
    if (aRoute !== bRoute) return aRoute.localeCompare(bRoute, "en", { numeric: true });
    if (companyOf(a) !== companyOf(b)) return companyOf(a).localeCompare(companyOf(b));
    if (a.bound !== b.bound) return a.bound.localeCompare(b.bound);
    return Number(a.service_type) - Number(b.service_type);
  });
  return matches;
}

function routeHasMultipleCompanies(routeNo) {
  const cos = new Set(
    state.routes.filter((r) => r.route === routeNo).map((r) => companyOf(r))
  );
  return cos.size > 1;
}

function renderVariants() {
  const routeNo = state.selectedRoute;
  els.variants.hidden = false;
  els.variantsTitle.textContent = `${routeNo} · ${t("pickDirection")}`;
  els.variantList.innerHTML = "";
  const showCo = routeHasMultipleCompanies(routeNo) || state.variants.some((v) => companyOf(v) === "CTB");
  state.variants.forEach((variant) => {
    const { orig, dest } = origDest(variant);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card-btn";
    if (sameVariant(state.selectedVariant, variant)) btn.classList.add("active");
    const extra =
      String(variant.service_type) !== "1" ? ` · ${t("special")} ${variant.service_type}` : "";
    const coHtml = showCo
      ? `<div class="co-badge">${escapeHtml(companyLabel(variant.co))}</div>`
      : "";
    btn.innerHTML = `${coHtml}<div class="route-no">${escapeHtml(variant.route)}${escapeHtml(extra)}</div>
      <div>${escapeHtml(orig)} → ${escapeHtml(dest)}</div>
      <div class="muted">${escapeHtml(t("toward"))} ${escapeHtml(dest)}</div>`;
    btn.addEventListener("click", () => selectVariant(variant));
    els.variantList.appendChild(btn);
  });
}

async function fetchRouteStops(variant) {
  const co = companyOf(variant);
  if (co === "CTB") {
    const json = await fetchJson(
      `${CTB_API}/route-stop/CTB/${encodeURIComponent(variant.route)}/${boundPath(variant.bound)}`
    );
    return (json.data || []).map((row) => ({
      ...row,
      co: "CTB",
      service_type: "1",
      detail: state.stopsById.get(stopKey("CTB", row.stop)) || null,
    }));
  }
  const json = await fetchJson(
    `${KMB_API}/route-stop/${encodeURIComponent(variant.route)}/${boundPath(variant.bound)}/${variant.service_type}`
  );
  return (json.data || []).map((row) => ({
    ...row,
    co: "KMB",
    detail: state.stopsById.get(stopKey("KMB", row.stop)) || null,
  }));
}

async function hydrateCtbStopDetails(stops) {
  const missing = stops.filter((s) => !s.detail);
  if (!missing.length) return stops;
  const queue = [...missing];
  const workers = Array.from({ length: Math.min(CTB_ETA_CONCURRENCY, queue.length) }, async () => {
    while (queue.length) {
      const row = queue.shift();
      try {
        const json = await fetchJson(`${CTB_API}/stop/${encodeURIComponent(row.stop)}`);
        const data = json.data || {};
        if (!data.stop) continue;
        const detail = {
          co: "CTB",
          stop: data.stop,
          name_tc: data.name_tc,
          name_en: data.name_en,
          lat: Number(data.lat),
          long: Number(data.long),
          routes: [],
        };
        state.stopsById.set(stopKey("CTB", detail.stop), detail);
        row.detail = detail;
      } catch {
        /* ignore missing stop */
      }
    }
  });
  await Promise.all(workers);
  return stops;
}

async function hydrateKmbStopDetails(stops) {
  const missing = stops.filter((s) => !s.detail);
  if (!missing.length) return stops;
  const queue = [...missing];
  const workers = Array.from({ length: Math.min(CTB_ETA_CONCURRENCY, queue.length) }, async () => {
    while (queue.length) {
      const row = queue.shift();
      try {
        const json = await fetchJson(`${KMB_API}/stop/${encodeURIComponent(row.stop)}`);
        const data = json.data || {};
        if (!data.stop) continue;
        const detail = {
          co: "KMB",
          stop: data.stop,
          name_tc: data.name_tc,
          name_en: data.name_en,
          lat: Number(data.lat),
          long: Number(data.long),
          routes: null,
        };
        state.stopsById.set(stopKey("KMB", detail.stop), detail);
        row.detail = detail;
      } catch {
        /* ignore missing stop */
      }
    }
  });
  await Promise.all(workers);
  return stops;
}

async function hydrateMissingStopDetails(stops) {
  const kmb = stops.filter((s) => companyOf(s) === "KMB");
  const ctb = stops.filter((s) => companyOf(s) === "CTB");
  await Promise.all([hydrateKmbStopDetails(kmb), hydrateCtbStopDetails(ctb)]);
  return stops;
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
    let rows = await fetchRouteStops(variant);
    rows = await hydrateMissingStopDetails(rows);
    state.stops = rows;
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
      <div class="muted">${escapeHtml(t("closestHint"))} · ${escapeHtml(formatDistanceLabel(nearest.distance))}</div>`;
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
      distance == null
        ? ""
        : `<span class="distance">${escapeHtml(formatDistanceLabel(distance))}${isClosest ? ` · ${escapeHtml(t("closest"))}` : ""}</span>`;
    btn.innerHTML = `<div class="stop-row"><span><strong>${escapeHtml(stop.seq)}.</strong> ${escapeHtml(label)}</span>${distLabel}</div>`;
    btn.addEventListener("click", () => selectStop(stop));
    els.stopList.appendChild(btn);
  });
}

function favoriteKey(stop) {
  const v = state.selectedVariant;
  return `${companyOf(v)}|${v.route}|${v.bound}|${v.service_type}|${stop.stop}`;
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
    const co = item.co ? ` · ${companyLabel(item.co)}` : "";
    btn.textContent = `${item.route}${co} · ${label}`;
    btn.addEventListener("click", async () => {
      setTab("search");
      els.input.value = item.route;
      try {
        setStatus(t("loadingRoutes"));
        await loadRoutes();
        await showRoute(item.route, item.co);
      } catch (error) {
        setStatus(t("loadError"));
        console.error(error);
        return;
      }
      const variant = state.variants.find(
        (v) =>
          companyOf(v) === companyOf(item) &&
          v.bound === item.bound &&
          String(v.service_type) === String(item.serviceType)
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
      co: companyOf(state.selectedVariant),
      route: state.selectedVariant.route,
      bound: state.selectedVariant.bound,
      serviceType: state.selectedVariant.service_type,
      stopId: stop.stop,
      nameTc: stop.detail?.name_tc || stop.stop,
      nameEn: stop.detail?.name_en || stop.stop,
      updatedAt: new Date().toISOString(),
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
  els.etaMeta.textContent = `${companyLabel(variant.co)} · ${t("toward")} ${dest}`;
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

function formatDistanceLabel(metres) {
  if (!Number.isFinite(metres)) return "";
  const rounded = Math.round(metres);
  // Far-away figures like 9500m aren't useful for walking to a stop.
  if (rounded > DISTANCE_DISPLAY_CAP_M) return `>${DISTANCE_DISPLAY_CAP_M} ${t("metres")}`;
  return `${rounded} ${t("metres")}`;
}

async function loadEta() {
  const stop = state.selectedStop;
  const variant = state.selectedVariant;
  if (!stop || !variant) return;
  try {
    const co = companyOf(variant);
    const json =
      co === "CTB"
        ? await fetchJson(
            `${CTB_API}/eta/CTB/${encodeURIComponent(stop.stop)}/${encodeURIComponent(variant.route)}`
          )
        : await fetchJson(
            `${KMB_API}/eta/${encodeURIComponent(stop.stop)}/${encodeURIComponent(variant.route)}/${variant.service_type}`
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

async function showRoute(query, preferredCo = null) {
  await loadRoutes();
  const matches = searchRoutes(query);
  if (!matches.length) {
    setStatus(t("noRoute"));
    els.variants.hidden = true;
    els.stops.hidden = true;
    els.eta.hidden = true;
    return;
  }
  setStatus("");
  const preferred = preferredCo
    ? matches.find((r) => companyOf(r) === companyOf({ co: preferredCo }))
    : null;
  state.selectedRoute = (preferred || matches[0]).route;
  const routeMatches = state.routes.filter((r) => r.route === state.selectedRoute);
  if (preferredCo) {
    const filtered = routeMatches.filter((r) => companyOf(r) === companyOf({ co: preferredCo }));
    state.variants = filtered.length ? filtered : routeMatches;
  } else {
    state.variants = routeMatches;
  }
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

function cacheLooksComplete(stops) {
  if (!Array.isArray(stops) || stops.length < 1000) return false;
  let kmb = 0;
  let ctb = 0;
  for (const stop of stops) {
    const co = companyOf(stop);
    if (co === "KMB") kmb += 1;
    else if (co === "CTB") ctb += 1;
  }
  // Reject partial caches (e.g. only Citybus) that leave KMB route stops nameless.
  return kmb > 1000 && ctb > 100;
}

async function loadAllStops() {
  if (state.allStops.length && cacheLooksComplete(state.allStops)) return;
  if (state.stopsLoadPromise) return state.stopsLoadPromise;

  state.stopsLoadPromise = (async () => {
    try {
      const cached = JSON.parse(localStorage.getItem(STOPS_KEY) || "null");
      const age = cached?.savedAt ? Date.now() - cached.savedAt : Infinity;
      if (cacheLooksComplete(cached?.stops) && age < 20 * 60 * 60 * 1000) {
        state.allStops = cached.stops;
        state.stopsById = new Map(cached.stops.map((s) => [stopKey(s.co, s.stop), s]));
        return;
      }
    } catch {
      /* ignore bad cache */
    }

    const results = await Promise.allSettled([
      fetchJson(`${KMB_API}/stop`),
      fetchJson("ctb-stops.json"),
    ]);

    const stops = [];
    if (results[0].status === "fulfilled") {
      for (const s of results[0].value.data || []) {
        stops.push({
          co: "KMB",
          stop: s.stop,
          name_tc: s.name_tc,
          name_en: s.name_en,
          lat: Number(s.lat),
          long: Number(s.long),
          routes: null,
        });
      }
    } else {
      console.error(results[0].reason);
    }
    if (results[1].status === "fulfilled") {
      for (const s of results[1].value || []) {
        stops.push({
          co: "CTB",
          stop: s.stop,
          name_tc: s.name_tc,
          name_en: s.name_en,
          lat: Number(s.lat),
          long: Number(s.long),
          routes: Array.isArray(s.routes) ? s.routes : [],
        });
      }
    } else {
      console.error(results[1].reason);
    }
    if (!stops.length) throw new Error("No stops loaded");

    state.allStops = stops;
    state.stopsById = new Map(stops.map((s) => [stopKey(s.co, s.stop), s]));
    if (cacheLooksComplete(stops)) {
      try {
        localStorage.setItem(STOPS_KEY, JSON.stringify({ savedAt: Date.now(), stops }));
      } catch {
        /* storage full */
      }
    } else {
      try {
        localStorage.removeItem(STOPS_KEY);
      } catch {
        /* ignore */
      }
    }
  })();

  try {
    await state.stopsLoadPromise;
  } finally {
    state.stopsLoadPromise = null;
  }
}

function groupStopEta(rows, co = "KMB") {
  const groups = new Map();
  for (const row of rows) {
    const key = `${co}|${row.route}|${row.dir}|${row.dest_tc || row.dest_en || ""}`;
    if (!groups.has(key)) {
      groups.set(key, {
        co,
        route: row.route,
        dir: row.dir,
        service_type: row.service_type || "1",
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

async function mapPool(items, limit, worker) {
  const results = new Array(items.length);
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) || 0 }, async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  });
  await Promise.all(runners);
  return results;
}

async function fetchCtbStopEta(stop) {
  const routes = [...new Set(stop.routes || [])].slice(0, 12);
  if (!routes.length) return [];
  const batches = await mapPool(routes, CTB_ETA_CONCURRENCY, async (route) => {
    try {
      const json = await fetchJson(
        `${CTB_API}/eta/CTB/${encodeURIComponent(stop.stop)}/${encodeURIComponent(route)}`
      );
      return json.data || [];
    } catch {
      return [];
    }
  });
  return groupStopEta(batches.flat(), "CTB");
}

async function fetchKmbStopEta(stop) {
  try {
    const json = await fetchJson(`${KMB_API}/stop-eta/${encodeURIComponent(stop.stop)}`);
    return groupStopEta(json.data || [], "KMB");
  } catch {
    return [];
  }
}

async function refreshNearbyEtas(seq = state.nearbySeq) {
  if (!state.nearbyStops.length) return;
  state.nearbyEtaPending = true;
  renderNearbyMeta();

  const stopsSnapshot = state.nearbyStops.map((stop) => stopKey(stop.co, stop.stop));
  try {
    const results = await Promise.all(
      state.nearbyStops.map(async (stop) => {
        try {
          const groups =
            companyOf(stop) === "CTB" ? await fetchCtbStopEta(stop) : await fetchKmbStopEta(stop);
          return { ...stop, groups };
        } catch {
          return { ...stop, groups: stop.groups ?? [] };
        }
      })
    );

    if (seq !== state.nearbySeq) return;
    const stillSame =
      results.length === stopsSnapshot.length &&
      results.every((stop, i) => stopKey(stop.co, stop.stop) === stopsSnapshot[i]);
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
  // Never fall back to city-wide stops (e.g. 9500m away) — empty is better.
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
    const stopId = stopKey(stop.co, stop.stop);
    card.dataset.stopId = stopId;
    if (state.selectedNearbyStopId === stopId) card.classList.add("active");
    const name = nameOf(stop);
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
          return `<button type="button" class="route-row" data-co="${escapeHtml(group.co || stop.co)}" data-route="${escapeHtml(group.route)}" data-dir="${escapeHtml(group.dir)}" data-service="${escapeHtml(group.service_type || "1")}" data-stop="${escapeHtml(stop.stop)}">
              <div>
                <div class="route-no">${escapeHtml(group.route)} <span class="co-inline">${escapeHtml(companyLabel(group.co || stop.co))}</span></div>
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
        <span class="distance">${escapeHtml(formatDistanceLabel(stop.distance))} · ${escapeHtml(companyLabel(stop.co))}</span>
      </header>
      <div class="eta-list">${routesHtml}</div>`;
    card.querySelector("header").addEventListener("click", () => {
      state.selectedNearbyStopId = stopId;
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

async function openNearbyRoute({ co, route, dir, service, stop }) {
  setTab("search");
  els.input.value = route;
  await loadRoutes();
  await showRoute(route, co);
  const variant = state.variants.find(
    (v) =>
      companyOf(v) === companyOf({ co }) &&
      v.bound === dir &&
      String(v.service_type) === String(service || "1")
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
  if (!mapCtl.map) return;

  const run = () => {
    mapCtl.map.invalidateSize({ animate: false, pan: false });
  };

  // Immediate + double-rAF covers same-frame CSS class toggles.
  run();
  requestAnimationFrame(() => {
    run();
    requestAnimationFrame(() => {
      run();
      fitMapToContext({ animate: false });
    });
  });

  // Height uses a 0.28s CSS transition — Leaflet must remeasure after it ends.
  clearTimeout(mapCtl.layoutTimer);
  mapCtl.layoutTimer = setTimeout(() => {
    run();
    fitMapToContext({ animate: false });
  }, 340);
}

function bindMapShellResize() {
  if (!els.mapShell || mapCtl.resizeObserver || typeof ResizeObserver === "undefined") return;
  mapCtl.resizeObserver = new ResizeObserver(() => {
    if (!mapCtl.map) return;
    clearTimeout(mapCtl.layoutTimer);
    mapCtl.layoutTimer = setTimeout(() => {
      mapCtl.map.invalidateSize({ animate: false, pan: false });
    }, 60);
  });
  mapCtl.resizeObserver.observe(els.mapShell);
  els.mapShell.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "height" && event.propertyName !== "min-height") return;
    refreshMapAfterLayout();
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

function setMapExpanded(expanded, { animate = true } = {}) {
  if (state.mapExpanded === expanded) {
    refreshMapAfterLayout();
    return;
  }
  if (animate) {
    document.body.classList.add("map-size-animating");
    clearTimeout(mapCtl.sizeAnimTimer);
    mapCtl.sizeAnimTimer = setTimeout(() => {
      document.body.classList.remove("map-size-animating");
    }, 340);
  } else {
    document.body.classList.remove("map-size-animating");
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
    updateWhenIdle: false,
    updateWhenZooming: true,
  }).addTo(mapCtl.map);
  mapCtl.stopLayer = L.layerGroup().addTo(mapCtl.map);
  bindMapShellResize();
  refreshMapAfterLayout();
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
    const active = stopKey(stop.co, stop.stop) === state.selectedNearbyStopId;
    const marker = L.marker([stop.lat, stop.long], { icon: stopIcon(active) });
    marker.bindPopup(`${nameOf(stop)} · ${companyLabel(stop.co)}`);
    marker.on("click", () => {
      state.selectedNearbyStopId = stopKey(stop.co, stop.stop);
      setTab("nearby");
      renderNearbyList();
      const card = [...els.nearbyList.children].find((node) =>
        node.querySelector(`[data-stop="${stop.stop}"][data-co="${companyOf(stop)}"]`)
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
  const co = companyOf(variant);
  const cacheKey = routeVariantKey(variant);
  if (mapCtl.geoCache?.has(cacheKey)) return mapCtl.geoCache.get(cacheKey);
  const ids = await loadGtfsMap();
  const gtfsId =
    ids[cacheKey] ||
    ids[`${co}|${variant.route}|${variant.bound}|1`] ||
    (co === "KMB"
      ? ids[`LWB|${variant.route}|${variant.bound}|${variant.service_type}`] ||
        ids[`LWB|${variant.route}|${variant.bound}|1`] ||
        ids[`${variant.route}|${variant.bound}|${variant.service_type}`] ||
        ids[`${variant.route}|${variant.bound}|1`]
      : null);
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
  const radiuses = points.map(() => 250).join(";");
  const hosts = [
    "https://router.project-osrm.org",
    "https://routing.openstreetmap.de/routed-car",
  ];
  for (const host of hosts) {
    try {
      const json = await fetchJson(
        `${host}/route/v1/driving/${path}?overview=full&geometries=geojson&continue_straight=true&radiuses=${radiuses}`
      );
      if (json.code !== "Ok" || !json.routes?.[0]?.geometry?.coordinates) continue;
      return json.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    } catch {
      /* try next host */
    }
  }
  return [];
}

async function osrmFollowRoads(points) {
  if (points.length < 2) return [];
  const all = [];
  const size = 8;
  for (let i = 0; i < points.length - 1; i += size - 1) {
    const chunk = points.slice(i, i + size);
    let coords = [];
    try {
      coords = await osrmChunk(chunk);
    } catch {
      coords = [];
    }
    if (coords.length < 2) {
      // Try pairwise road snaps when the multi-stop chunk fails (common on long airport routes).
      coords = [];
      for (let j = 0; j < chunk.length - 1; j++) {
        let pair = [];
        try {
          pair = await osrmChunk([chunk[j], chunk[j + 1]]);
        } catch {
          pair = [];
        }
        if (pair.length < 2) pair = [chunk[j], chunk[j + 1]];
        if (coords.length) pair = pair.slice(1);
        coords.push(...pair);
      }
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

function pathLooksSparse(path, stops) {
  if (!path || path.length < 2) return true;
  if (path.length <= stops.length + 2) return true;
  return false;
}

async function drawRouteOnMap(stops) {
  const seq = ++mapCtl.drawSeq;
  const fallback = stopLatLngs(stops);
  clearRouteLine();
  drawRouteStopMarkers(stops);
  let path = fallback;
  let usedOfficial = false;
  try {
    const official = await officialRoutePath(state.selectedVariant);
    if (seq !== mapCtl.drawSeq) return;
    if (official && official.length > 10) {
      path = official;
      usedOfficial = true;
    }
  } catch (error) {
    console.error(error);
  }
  // Prefer road-network geometry whenever official shapes are missing or too sparse.
  if (!usedOfficial || pathLooksSparse(path, fallback)) {
    try {
      const road = await osrmFollowRoads(fallback);
      if (seq !== mapCtl.drawSeq) return;
      if (road.length > Math.max(10, fallback.length)) path = road;
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
    setStatus(t("loadingRoutes"));
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
els.accountBtn?.addEventListener("click", openAccountDialog);
els.accountCloseBtn?.addEventListener("click", () => closeAccountDialog());
els.accountLoginBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  handleAccountAuth("login");
});
els.accountRegisterBtn?.addEventListener("click", () => handleAccountAuth("register"));
els.accountLogoutBtn?.addEventListener("click", () => handleAccountLogout());
els.accountForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  handleAccountAuth("login");
});
els.accountDialog?.addEventListener("cancel", (event) => {
  // Allow Escape / backdrop close without native form validation.
  event.preventDefault();
  closeAccountDialog();
});
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
  refreshMapAfterLayout();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refreshMapAfterLayout();
});

initMap();
applyLang();
updateMapExpandUi();
renderAccountChrome();
renderFavorites();
refreshMapAfterLayout();

(async () => {
  if (window.HKBusAccount) {
    window.HKBusAccount.onAuthChange(async () => {
      await refreshFavoritesFromAccount();
    });
    await window.HKBusAccount.init();
    await refreshFavoritesFromAccount();
  }
})();

loadRoutes().catch((error) => {
  setNearbyStatus(t("loadError"));
  console.error(error);
});
requestLocation(true);
