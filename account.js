(() => {
  const USERS_KEY = "hk-arrivals-users-v1";
  const SESSION_KEY = "hk-arrivals-session-v1";
  const GUEST_FAV_KEY = "hk-arrivals-favorites";
  const LEGACY_FAV_KEY = "kmb-arrivals-favorites";
  const favKeyFor = (uid) => `hk-arrivals-favorites:${uid}`;

  const listeners = new Set();
  let user = null;
  let firebaseApp = null;
  let firebaseAuth = null;
  let firebaseDb = null;
  let cloudReady = false;
  let authUnsub = null;

  function config() {
    return window.HK_BUS_CONFIG?.auth || {};
  }

  function cloudConfigured() {
    const fb = config().firebase || {};
    return Boolean(config().cloudSync && fb.apiKey && fb.projectId && fb.appId);
  }

  function notify() {
    listeners.forEach((fn) => {
      try {
        fn(getUser());
      } catch (error) {
        console.error(error);
      }
    });
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function readUsers() {
    return readJson(USERS_KEY, {});
  }

  function writeUsers(users) {
    writeJson(USERS_KEY, users);
  }

  function normalizeEmail(email) {
    return String(email || "")
      .trim()
      .toLowerCase();
  }

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function hashPassword(password, salt) {
    return sha256Hex(`${salt}:${password}`);
  }

  function newId() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }

  function readGuestFavorites() {
    const next = readJson(GUEST_FAV_KEY, null);
    if (next) return Array.isArray(next) ? next : [];
    const legacy = readJson(LEGACY_FAV_KEY, []);
    return Array.isArray(legacy) ? legacy : [];
  }

  function writeGuestFavorites(list) {
    writeJson(GUEST_FAV_KEY, list);
  }

  function readLocalFavorites(uid) {
    if (!uid) return readGuestFavorites();
    const owned = readJson(favKeyFor(uid), null);
    if (owned) return Array.isArray(owned) ? owned : [];
    return [];
  }

  function writeLocalFavorites(uid, list) {
    if (!uid) {
      writeGuestFavorites(list);
      return;
    }
    writeJson(favKeyFor(uid), list);
  }

  function mergeFavorites(a = [], b = []) {
    const map = new Map();
    [...a, ...b].forEach((item) => {
      if (!item?.key) return;
      const prev = map.get(item.key);
      if (!prev) {
        map.set(item.key, item);
        return;
      }
      const prevAt = Date.parse(prev.updatedAt || 0) || 0;
      const nextAt = Date.parse(item.updatedAt || 0) || 0;
      map.set(item.key, nextAt >= prevAt ? item : prev);
    });
    return [...map.values()].sort((x, y) => {
      const ax = Date.parse(x.updatedAt || 0) || 0;
      const ay = Date.parse(y.updatedAt || 0) || 0;
      return ay - ax;
    });
  }

  function stampFavorites(list) {
    const now = new Date().toISOString();
    return (list || []).map((item) => ({
      ...item,
      updatedAt: item.updatedAt || now,
    }));
  }

  async function loadScript(src) {
    if ([...document.scripts].some((s) => s.src === src)) return;
    await new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = src;
      el.async = true;
      el.onload = resolve;
      el.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(el);
    });
  }

  async function ensureFirebase() {
    if (!cloudConfigured()) return false;
    if (cloudReady) return true;
    await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
    await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js");
    await loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js");
    if (!window.firebase) throw new Error("Firebase SDK missing");
    if (!firebaseApp) {
      firebaseApp = firebase.initializeApp(config().firebase);
      firebaseAuth = firebase.auth();
      firebaseDb = firebase.firestore();
    }
    cloudReady = true;
    return true;
  }

  function sessionUserFromLocal(record) {
    return {
      uid: record.uid,
      email: record.email,
      provider: "local",
      cloud: false,
    };
  }

  function setSession(nextUser) {
    user = nextUser;
    if (nextUser) writeJson(SESSION_KEY, nextUser);
    else localStorage.removeItem(SESSION_KEY);
    notify();
  }

  async function pullCloudFavorites(uid) {
    if (!(await ensureFirebase()) || !uid) return null;
    const snap = await firebaseDb.collection("users").doc(uid).collection("data").doc("favorites").get();
    if (!snap.exists) return null;
    const data = snap.data();
    return Array.isArray(data?.items) ? data.items : [];
  }

  async function pushCloudFavorites(uid, list) {
    if (!(await ensureFirebase()) || !uid) return;
    await firebaseDb.collection("users").doc(uid).collection("data").doc("favorites").set(
      {
        items: list,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  async function loadFavorites() {
    const current = getUser();
    if (!current) return stampFavorites(readGuestFavorites());
    let list = readLocalFavorites(current.uid);
    if (current.cloud) {
      try {
        const remote = await pullCloudFavorites(current.uid);
        if (remote) {
          list = mergeFavorites(list, remote);
          writeLocalFavorites(current.uid, list);
        }
      } catch (error) {
        console.error(error);
      }
    }
    return stampFavorites(list);
  }

  async function saveFavorites(list) {
    const stamped = stampFavorites(list);
    const current = getUser();
    if (!current) {
      writeGuestFavorites(stamped);
      return stamped;
    }
    writeLocalFavorites(current.uid, stamped);
    if (current.cloud) {
      try {
        await pushCloudFavorites(current.uid, stamped);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    return stamped;
  }

  async function adoptGuestFavorites(mergeGuest) {
    if (!mergeGuest || !user) return loadFavorites();
    const guest = readGuestFavorites();
    if (!guest.length) return loadFavorites();
    const merged = mergeFavorites(await loadFavorites(), guest);
    await saveFavorites(merged);
    writeGuestFavorites([]);
    return merged;
  }

  async function registerLocal(email, password) {
    const users = readUsers();
    if (users[email]) throw new Error("exists");
    const salt = newId();
    const passwordHash = await hashPassword(password, salt);
    const record = {
      uid: newId(),
      email,
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    users[email] = record;
    writeUsers(users);
    setSession(sessionUserFromLocal(record));
    return getUser();
  }

  async function loginLocal(email, password) {
    const record = readUsers()[email];
    if (!record) throw new Error("notfound");
    const passwordHash = await hashPassword(password, record.salt);
    if (passwordHash !== record.passwordHash) throw new Error("badpass");
    setSession(sessionUserFromLocal(record));
    return getUser();
  }

  async function registerCloud(email, password) {
    await ensureFirebase();
    const cred = await firebaseAuth.createUserWithEmailAndPassword(email, password);
    setSession({
      uid: cred.user.uid,
      email: cred.user.email,
      provider: "firebase",
      cloud: true,
    });
    return getUser();
  }

  async function loginCloud(email, password) {
    await ensureFirebase();
    const cred = await firebaseAuth.signInWithEmailAndPassword(email, password);
    setSession({
      uid: cred.user.uid,
      email: cred.user.email,
      provider: "firebase",
      cloud: true,
    });
    return getUser();
  }

  async function register(emailRaw, password, { mergeGuest = true } = {}) {
    const email = normalizeEmail(emailRaw);
    if (!validEmail(email)) throw new Error("email");
    if (String(password || "").length < 6) throw new Error("password");
    if (cloudConfigured()) await registerCloud(email, password);
    else await registerLocal(email, password);
    return adoptGuestFavorites(mergeGuest);
  }

  async function login(emailRaw, password, { mergeGuest = true } = {}) {
    const email = normalizeEmail(emailRaw);
    if (!validEmail(email)) throw new Error("email");
    if (!password) throw new Error("password");
    if (cloudConfigured()) await loginCloud(email, password);
    else await loginLocal(email, password);
    return adoptGuestFavorites(mergeGuest);
  }

  async function logout({ keepLocalCopy = true } = {}) {
    const current = getUser();
    if (current && keepLocalCopy) {
      const list = await loadFavorites();
      writeGuestFavorites(list);
    }
    if (cloudConfigured() && firebaseAuth?.currentUser) {
      try {
        await firebaseAuth.signOut();
      } catch (error) {
        console.error(error);
      }
    }
    setSession(null);
    return readGuestFavorites();
  }

  function getUser() {
    return user;
  }

  function onAuthChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  async function init() {
    const saved = readJson(SESSION_KEY, null);
    if (saved?.uid && saved?.email) {
      user = saved;
    }

    if (cloudConfigured()) {
      try {
        await ensureFirebase();
        await new Promise((resolve) => {
          authUnsub = firebaseAuth.onAuthStateChanged((fbUser) => {
            if (fbUser) {
              setSession({
                uid: fbUser.uid,
                email: fbUser.email,
                provider: "firebase",
                cloud: true,
              });
            } else if (user?.cloud) {
              setSession(null);
            }
            resolve();
          });
        });
      } catch (error) {
        console.error(error);
      }
    }

    notify();
    return getUser();
  }

  window.HKBusAccount = {
    init,
    getUser,
    cloudConfigured,
    register,
    login,
    logout,
    loadFavorites,
    saveFavorites,
    mergeFavorites,
    onAuthChange,
    readGuestFavorites,
  };
})();
