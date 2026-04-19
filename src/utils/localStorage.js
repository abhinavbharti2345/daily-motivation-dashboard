export const getLikedQuotes = () => {
  const stored = localStorage.getItem("likedQuotes");
  return stored ? JSON.parse(stored) : [];
};

export const saveLikedQuotes = (quotes) => {
  localStorage.setItem("likedQuotes", JSON.stringify(quotes));
};

export const getStreak = () => {
  const stored = localStorage.getItem("streak");
  return stored ? JSON.parse(stored) : { count: 0, lastVisit: null };
};

export const updateStreak = () => {
  const today = new Date().toDateString();
  const { count, lastVisit } = getStreak();

  if (lastVisit === today) return count;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const newCount = lastVisit === yesterday.toDateString() ? count + 1 : 1;
  localStorage.setItem("streak", JSON.stringify({ count: newCount, lastVisit: today }));
  return newCount;
};

export const getStreakMeta = () => {
  const stored = localStorage.getItem("streakMeta");
  return stored ? JSON.parse(stored) : { justBroken: false, lastBrokenAt: null };
};

export const updateStreakWithFeedback = () => {
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const streak = getStreak();
  const meta = getStreakMeta();

  if (!streak.lastVisit) {
    const next = { count: 1, lastVisit: today };
    localStorage.setItem("streak", JSON.stringify(next));
    localStorage.setItem("streakMeta", JSON.stringify({ ...meta, justBroken: false }));
    return { ...next, justBroken: false };
  }

  if (streak.lastVisit === today) {
    return { ...streak, justBroken: meta.justBroken };
  }

  const contiguous = streak.lastVisit === yesterday.toDateString();
  const next = {
    count: contiguous ? streak.count + 1 : 1,
    lastVisit: today,
  };

  const nextMeta = {
    justBroken: !contiguous,
    lastBrokenAt: !contiguous ? today : meta.lastBrokenAt,
  };

  localStorage.setItem("streak", JSON.stringify(next));
  localStorage.setItem("streakMeta", JSON.stringify(nextMeta));

  return { ...next, justBroken: nextMeta.justBroken };
};

export const clearStreakBrokenFlag = () => {
  const meta = getStreakMeta();
  if (!meta.justBroken) return;
  localStorage.setItem("streakMeta", JSON.stringify({ ...meta, justBroken: false }));
};

export const getWeeklyData = () => {
  const stored = localStorage.getItem("weeklyData");
  return stored ? JSON.parse(stored) : {};
};

export const incrementTodayLike = () => {
  const today = new Date().toDateString();
  const data = getWeeklyData();
  data[today] = (data[today] || 0) + 1;
  localStorage.setItem("weeklyData", JSON.stringify(data));
};

export const getQuoteViews = () => {
  const stored = localStorage.getItem("quoteViews");
  return stored ? JSON.parse(stored) : {};
};

export const incrementTodayView = () => {
  const today = new Date().toDateString();
  const data = getQuoteViews();
  data[today] = (data[today] || 0) + 1;
  localStorage.setItem("quoteViews", JSON.stringify(data));
};

export const getTodayViews = () => {
  const today = new Date().toDateString();
  const data = getQuoteViews();
  return data[today] || 0;
};

export const getTodayLikes = () => {
  const today = new Date().toDateString();
  const data = getWeeklyData();
  return data[today] || 0;
};

export const getFavoriteMeta = () => {
  const stored = localStorage.getItem("favoriteMeta");
  return stored ? JSON.parse(stored) : {};
};

export const saveFavoriteMeta = (meta) => {
  localStorage.setItem("favoriteMeta", JSON.stringify(meta));
};

export const getCollections = () => {
  const stored = localStorage.getItem("collections");
  return stored ? JSON.parse(stored) : ["Exam Motivation", "Life Quotes", "Hard Days"];
};

export const saveCollections = (collections) => {
  localStorage.setItem("collections", JSON.stringify(collections));
};

export const getLast7DaysData = () => {
  const data = getWeeklyData();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      count: data[d.toDateString()] || 0,
    };
  });
};

export const getMostLikedQuote = () => {
  const quotes = getLikedQuotes();
  return quotes.length ? quotes[quotes.length - 1] : null;
};