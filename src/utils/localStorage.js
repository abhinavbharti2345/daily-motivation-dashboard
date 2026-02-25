export const getLikedQuotes = () => {
  const stored = localStorage.getItem("likedQuotes");
  return stored ? JSON.parse(stored) : [];
};

export const saveLikedQuotes = (quotes) => {
  localStorage.setItem("likedQuotes", JSON.stringify(quotes));
};

export const getDarkMode = () => {
  const stored = localStorage.getItem("darkMode");
  return stored === null ? true : JSON.parse(stored);
};

export const saveDarkMode = (value) => {
  localStorage.setItem("darkMode", JSON.stringify(value));
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