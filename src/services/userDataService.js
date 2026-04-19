import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  getCollections,
  getFavoriteMeta,
  getLikedQuotes,
  getStreak,
  getTodayLikes,
  getTodayViews,
} from "../utils/localStorage";

const DEFAULT_USER_DATA = {
  favorites: [],
  streak: 1,
  lastVisit: null,
  stats: {
    viewedToday: 0,
    favoritesAdded: 0,
  },
  favoriteMeta: {},
  collections: ["Exam Motivation", "Life Quotes", "Hard Days"],
};

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const resolveStreakForToday = (count, lastVisitRaw) => {
  const today = new Date();
  const todayText = today.toDateString();

  const lastVisitDate = parseDate(lastVisitRaw);
  if (!lastVisitDate) {
    return { streak: Math.max(1, count || 1), lastVisit: todayText, justBroken: false };
  }

  const lastVisitText = lastVisitDate.toDateString();
  if (lastVisitText === todayText) {
    return { streak: Math.max(1, count || 1), lastVisit: lastVisitText, justBroken: false };
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isContiguous = lastVisitText === yesterday.toDateString();

  return {
    streak: isContiguous ? Math.max(1, count || 1) + 1 : 1,
    lastVisit: todayText,
    justBroken: !isContiguous,
  };
};

const uniqueFavorites = (favorites) => {
  const map = new Map();
  favorites.forEach((item) => {
    if (!item?.quote) return;
    map.set(item.quote, item);
  });
  return Array.from(map.values());
};

const normalizeDocData = (data) => {
  if (!data) return { ...DEFAULT_USER_DATA };

  const timestampDate = data?.lastVisitAt?.toDate ? data.lastVisitAt.toDate() : null;

  return {
    favorites: Array.isArray(data.favorites) ? data.favorites : [],
    streak: typeof data.streak === "number" ? data.streak : 1,
    lastVisit: data.lastVisit || (timestampDate ? timestampDate.toDateString() : null),
    stats: {
      viewedToday: Number(data?.stats?.viewedToday || 0),
      favoritesAdded: Number(data?.stats?.favoritesAdded || 0),
    },
    favoriteMeta: data.favoriteMeta || {},
    collections: Array.isArray(data.collections) && data.collections.length ? data.collections : [...DEFAULT_USER_DATA.collections],
  };
};

export const getLocalUserSnapshot = () => {
  const streakState = getStreak();
  return {
    favorites: getLikedQuotes(),
    streak: Number(streakState.count || 1),
    lastVisit: streakState.lastVisit || null,
    stats: {
      viewedToday: getTodayViews(),
      favoritesAdded: getTodayLikes(),
    },
    favoriteMeta: getFavoriteMeta(),
    collections: getCollections(),
  };
};

const mergeCloudAndLocal = (cloud, local) => {
  const cloudVisit = parseDate(cloud.lastVisit);
  const localVisit = parseDate(local.lastVisit);
  const useLocalStreak = !cloudVisit || (localVisit && localVisit > cloudVisit);

  const merged = {
    favorites: uniqueFavorites([...(cloud.favorites || []), ...(local.favorites || [])]),
    streak: useLocalStreak ? local.streak : cloud.streak,
    lastVisit: useLocalStreak ? local.lastVisit : cloud.lastVisit,
    stats: {
      viewedToday: Math.max(cloud?.stats?.viewedToday || 0, local?.stats?.viewedToday || 0),
      favoritesAdded: Math.max(cloud?.stats?.favoritesAdded || 0, local?.stats?.favoritesAdded || 0),
    },
    favoriteMeta: {
      ...(cloud.favoriteMeta || {}),
      ...(local.favoriteMeta || {}),
    },
    collections: Array.from(new Set([...(cloud.collections || []), ...(local.collections || [])])),
  };

  const withDailyStreak = resolveStreakForToday(merged.streak, merged.lastVisit);

  return {
    ...merged,
    streak: withDailyStreak.streak,
    lastVisit: withDailyStreak.lastVisit,
    justBroken: withDailyStreak.justBroken,
  };
};

export const mergeLocalDataIntoCloud = async (uid) => {
  if (!db || !uid) {
    return { ...DEFAULT_USER_DATA, ...getLocalUserSnapshot(), justBroken: false };
  }

  const ref = doc(db, "users", uid);
  const snapshot = await getDoc(ref);
  const cloud = normalizeDocData(snapshot.data());
  const local = getLocalUserSnapshot();
  const merged = mergeCloudAndLocal(cloud, local);

  await setDoc(
    ref,
    {
      favorites: merged.favorites,
      streak: merged.streak,
      lastVisit: merged.lastVisit,
      lastVisitAt: merged.lastVisit ? new Date(merged.lastVisit) : null,
      stats: merged.stats,
      favoriteMeta: merged.favoriteMeta,
      collections: merged.collections,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return merged;
};

export const saveUserData = async (uid, userData) => {
  if (!db || !uid) return;

  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    {
      favorites: userData.favorites,
      streak: userData.streak,
      lastVisit: userData.lastVisit,
      lastVisitAt: userData.lastVisit ? new Date(userData.lastVisit) : null,
      stats: userData.stats,
      favoriteMeta: userData.favoriteMeta,
      collections: userData.collections,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
