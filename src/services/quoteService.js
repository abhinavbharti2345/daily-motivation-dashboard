const CACHE_SIZE = 20;
const RECENT_QUOTES_KEY = "RECENT_QUOTES";
const REQUEST_TIMEOUT_MS = 4200;
const API_BATCH_SIZE = 2;

const HARDCODED_FALLBACK_QUOTES = [
  {
    text: "The harder you work for something, the greater you will feel when you achieve it.",
    author: "Unknown",
    category: "Motivation",
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
    category: "Success",
  },
  {
    text: "Success does not just find you. You have to go out and get it.",
    author: "Unknown",
    category: "Success",
  },
  {
    text: "Do not stop when you are tired. Stop when you are done.",
    author: "Unknown",
    category: "Perseverance",
  },
  {
    text: "It always seems impossible until it is done.",
    author: "Nelson Mandela",
    category: "Wisdom",
  },
];

const DEFAULT_QUOTE = {
  text: "Keep going. Small progress each day adds up to big results.",
  author: "Unknown",
  category: "Motivation",
};

let typeFitCache = [];
let preloadedQuoteByMood = {};
let preloadingPromiseByMood = {};
let recentQuotesCache = null;

const toMoodKey = (mood) => String(mood || "random").trim().toLowerCase();

const safeParseJson = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();

const normalizeQuote = (rawQuote, defaults = {}) => {
  if (!rawQuote || typeof rawQuote !== "object") {
    throw new Error("Invalid quote payload");
  }

  const text = normalizeText(
    rawQuote.text ?? rawQuote.content ?? rawQuote.quote ?? rawQuote.q ?? rawQuote.body,
  );
  const author = normalizeText(rawQuote.author ?? rawQuote.a ?? rawQuote.quoteAuthor ?? defaults.author);
  const category = normalizeText(
    rawQuote.category ?? rawQuote.genre ?? rawQuote.quoteGenre ?? defaults.category,
  );

  if (!text || text.length < 8) {
    throw new Error("Quote text is missing or too short");
  }

  return {
    text,
    author: author || "Unknown",
    category: category || "General",
  };
};

const getRecentQuotes = () => {
  if (Array.isArray(recentQuotesCache)) {
    return recentQuotesCache;
  }

  const parsed = safeParseJson(localStorage.getItem(RECENT_QUOTES_KEY) || "[]", []);
  if (!Array.isArray(parsed)) {
    recentQuotesCache = [];
    return recentQuotesCache;
  }

  recentQuotesCache = parsed.map((item) => normalizeText(item)).filter(Boolean);
  return recentQuotesCache;
};

const isQuoteRecent = (text) => getRecentQuotes().includes(normalizeText(text));

const addQuoteToRecent = (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return;

  try {
    const recents = getRecentQuotes();
    if (recents.includes(normalized)) return;

    const updated = [...recents, normalized].slice(-CACHE_SIZE);
    recentQuotesCache = updated;
    localStorage.setItem(RECENT_QUOTES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Recent quote cache error:", error);
  }
};

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

const fetchJson = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
};

export const getZenQuote = async () => {
  const data = await fetchJson("https://zenquotes.io/api/random");
  const item = Array.isArray(data) ? data[0] : null;
  return normalizeQuote(item, { category: "Motivation" });
};

export const getQuotableQuote = async () => {
  const data = await fetchJson("https://api.quotable.io/random");
  return normalizeQuote(data, { category: data?.tags?.[0] || "Wisdom" });
};

export const getQuoteGarden = async () => {
  const data = await fetchJson("https://quote-garden.onrender.com/api/v3/quotes/random");
  const item = data?.data?.[0];
  return normalizeQuote(item, { category: "Life" });
};

export const getStoicQuote = async () => {
  const data = await fetchJson("https://stoic-quotes.com/api/quote");
  return normalizeQuote(data, { category: "Stoicism" });
};

export const getFavQsQuote = async () => {
  const data = await fetchJson("https://favqs.com/api/qotd");
  return normalizeQuote(data?.quote, { category: "Daily" });
};

export const getTheySaidSoQuote = async () => {
  const data = await fetchJson("https://quotes.rest/quote/random");
  const item = Array.isArray(data?.contents?.quotes) ? data.contents.quotes[0] : null;
  return normalizeQuote(item, { category: "Inspiration" });
};

export const getTypeFitQuote = async () => {
  if (!typeFitCache.length) {
    const data = await fetchJson("https://type.fit/api/quotes");
    if (!Array.isArray(data) || !data.length) {
      throw new Error("Type.fit returned an invalid payload");
    }

    typeFitCache = data
      .map((item) => {
        try {
          return normalizeQuote(item, { category: "General" });
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  if (!typeFitCache.length) {
    throw new Error("Type.fit cache is empty");
  }

  const unseen = typeFitCache.filter((quote) => !isQuoteRecent(quote.text));
  return pickRandom(unseen.length ? unseen : typeFitCache);
};

const getHardcodedFallback = () => {
  const unseen = HARDCODED_FALLBACK_QUOTES.filter((quote) => !isQuoteRecent(quote.text));
  return pickRandom(unseen.length ? unseen : HARDCODED_FALLBACK_QUOTES);
};

const BASE_CHAIN = [getZenQuote, getQuotableQuote, getQuoteGarden, getStoicQuote, getFavQsQuote];

const uniqueFetchers = (fetchers) => {
  const unique = [];
  const seen = new Set();

  fetchers.forEach((fn) => {
    if (typeof fn !== "function") return;
    if (seen.has(fn)) return;
    seen.add(fn);
    unique.push(fn);
  });

  return unique;
};

const getMoodChain = (mood) => {
  const moodKey = toMoodKey(mood);

  if (moodKey === "deep" || moodKey === "stressed") {
    return uniqueFetchers([getStoicQuote, getQuoteGarden, ...BASE_CHAIN, getTheySaidSoQuote]);
  }

  if (moodKey === "motivated" || moodKey === "low") {
    return uniqueFetchers([getZenQuote, getQuotableQuote, getFavQsQuote, ...BASE_CHAIN, getTheySaidSoQuote]);
  }

  if (moodKey === "tired") {
    return uniqueFetchers([getQuoteGarden, getZenQuote, getQuotableQuote, ...BASE_CHAIN, getTheySaidSoQuote]);
  }

  return uniqueFetchers([...BASE_CHAIN, getTheySaidSoQuote]);
};

const getFreshQuoteFromFetcher = async (fetcher) => {
  const quote = await fetcher();
  if (!quote || !quote.text) {
    throw new Error("Invalid quote result");
  }

  if (isQuoteRecent(quote.text)) {
    throw new Error("Duplicate quote");
  }

  return quote;
};

// Run top-priority providers in small parallel batches so a slow endpoint does not block the whole chain.
const selectFromChain = async (fetchers) => {
  for (let i = 0; i < fetchers.length; i += API_BATCH_SIZE) {
    const batch = fetchers.slice(i, i + API_BATCH_SIZE);

    try {
      const quote = await Promise.any(batch.map((fetcher) => getFreshQuoteFromFetcher(fetcher)));
      if (quote) return quote;
    } catch {
      // Every provider in this batch failed; continue to the next batch.
    }
  }

  return null;
};

const preloadQuote = (mood) => {
  const moodKey = toMoodKey(mood);

  if (preloadedQuoteByMood[moodKey]) return;
  if (preloadingPromiseByMood[moodKey]) return;

  const chain = getMoodChain(moodKey);
  preloadingPromiseByMood = {
    ...preloadingPromiseByMood,
    [moodKey]: (async () => {
      try {
        const quote = await selectFromChain(chain);
        if (quote) {
          preloadedQuoteByMood = {
            ...preloadedQuoteByMood,
            [moodKey]: quote,
          };
        }

        return quote;
      } catch {
        return null;
      } finally {
        const nextPromises = { ...preloadingPromiseByMood };
        delete nextPromises[moodKey];
        preloadingPromiseByMood = nextPromises;
      }
    })(),
  };
};

export const prefetchQuote = (mood = "random") => {
  preloadQuote(mood);
};

export const getQuote = async (mood = "random") => {
  const moodKey = toMoodKey(mood);

  const preloaded = preloadedQuoteByMood[moodKey];
  if (preloaded && !isQuoteRecent(preloaded.text)) {
    addQuoteToRecent(preloaded.text);
    const next = { ...preloadedQuoteByMood };
    delete next[moodKey];
    preloadedQuoteByMood = next;
    preloadQuote(moodKey);
    return preloaded;
  }

  const inflightPreload = preloadingPromiseByMood[moodKey];
  if (inflightPreload) {
    try {
      const quoteFromInflight = await inflightPreload;
      if (quoteFromInflight && !isQuoteRecent(quoteFromInflight.text)) {
        addQuoteToRecent(quoteFromInflight.text);
        const next = { ...preloadedQuoteByMood };
        delete next[moodKey];
        preloadedQuoteByMood = next;
        preloadQuote(moodKey);
        return quoteFromInflight;
      }
    } catch {
      // Fall through to direct fetch.
    }
  }

  const chain = getMoodChain(moodKey);
  const quoteFromApis = await selectFromChain(chain);

  if (quoteFromApis) {
    addQuoteToRecent(quoteFromApis.text);
    preloadQuote(moodKey);
    return quoteFromApis;
  }

  try {
    const typeFitQuote = await getTypeFitQuote();
    addQuoteToRecent(typeFitQuote.text);
    preloadQuote(moodKey);
    return typeFitQuote;
  } catch {
    const fallback = getHardcodedFallback() || DEFAULT_QUOTE;
    addQuoteToRecent(fallback.text);
    preloadQuote(moodKey);
    return fallback;
  }
};

// Backward compatible alias for existing imports in the app.
export const fetchQuote = getQuote;