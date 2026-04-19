import { useState, useEffect, useMemo, useRef } from "react";
import useQuote from "./hooks/useQuote";
import Background from "./components/Background";
import QuoteCard from "./components/QuoteCard";
import Loader from "./components/Loader";
import FavoriteQuotesSection from "./components/FavoriteQuotesSection";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";
import { mergeLocalDataIntoCloud, saveUserData } from "./services/userDataService";
import {
  getLikedQuotes,
  saveLikedQuotes,
  incrementTodayLike,
  incrementTodayView,
  getTodayLikes,
  getTodayViews,
  getFavoriteMeta,
  saveFavoriteMeta,
  getCollections,
  saveCollections,
  updateStreakWithFeedback,
  clearStreakBrokenFlag,
} from "./utils/localStorage";

const CATEGORIES = ["Motivation", "Success", "Wisdom", "Perseverance", "Life"];
const randomCategory = () => CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
const MOODS = ["Stressed", "Tired", "Motivated", "Low"];

const getExplainText = (quote, author) => {
  if (!quote) return null;
  const shortAuthor = author || "the author";
  return {
    meaning: `Core idea: ${quote.length > 95 ? `${quote.slice(0, 95)}...` : quote}`,
    realLife: `Real life: Use this as a reminder from ${shortAuthor} to make one small intentional move right now.`,
    apply: "Apply today: Pick one task you have delayed and do the first 10 focused minutes.",
  };
};

function App() {
  const { quote, author, loading, getQuote, prefetchQuote } = useQuote();
  const { user, loading: authLoading, signOutUser } = useAuth();
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [category, setCategory] = useState(randomCategory());
  const [qotd, setQotd] = useState(null);
  const [focusMode, setFocusMode] = useState(false);
  const [mood, setMood] = useState("Motivated");
  const [streakCount, setStreakCount] = useState(1);
  const [streakBroken, setStreakBroken] = useState(false);
  const [streakLastVisit, setStreakLastVisit] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [todayViews, setTodayViews] = useState(0);
  const [todayLikes, setTodayLikes] = useState(0);
  const [favoriteMeta, setFavoriteMeta] = useState({});
  const [collections, setCollections] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const speechRef = useRef(null);
  const userMenuRef = useRef(null);

  const explainText = useMemo(() => getExplainText(quote, author), [quote, author]);
  const today = useMemo(() => new Date(), []);

  const calendarGrid = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i += 1) days.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) days.push(d);

    return { year, month, days };
  }, [today]);

  const streakDaySet = useMemo(() => {
    const set = new Set();
    if (!streakLastVisit) return set;

    const anchor = new Date(streakLastVisit);
    if (Number.isNaN(anchor.getTime())) return set;

    for (let i = 0; i < streakCount; i += 1) {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() - i);
      if (d.getFullYear() === calendarGrid.year && d.getMonth() === calendarGrid.month) {
        set.add(d.getDate());
      }
    }

    return set;
  }, [calendarGrid.month, calendarGrid.year, streakCount, streakLastVisit]);

  useEffect(() => {
    setLikedQuotes(getLikedQuotes());
    setFavoriteMeta(getFavoriteMeta());
    setCollections(getCollections());

    const streak = updateStreakWithFeedback();
    setStreakCount(streak.count || 1);
    setStreakBroken(Boolean(streak.justBroken));
    setStreakLastVisit(streak.lastVisit || null);

    setTodayViews(getTodayViews());
    setTodayLikes(getTodayLikes());
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!user?.uid) return () => {};

    const hydrateFromCloud = async () => {
      try {
        const merged = await mergeLocalDataIntoCloud(user.uid);
        if (cancelled) return;

        setLikedQuotes(Array.isArray(merged.favorites) ? merged.favorites : []);
        setStreakCount(Number(merged.streak || 1));
        setStreakLastVisit(merged.lastVisit || null);
        setStreakBroken(Boolean(merged.justBroken));
        setTodayViews(Number(merged?.stats?.viewedToday || 0));
        setTodayLikes(Number(merged?.stats?.favoritesAdded || 0));
        setFavoriteMeta(merged.favoriteMeta || {});
        setCollections(Array.isArray(merged.collections) ? merged.collections : []);
      } catch (error) {
        console.error("Failed to load cloud user data", error);
      }
    };

    hydrateFromCloud();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  useEffect(() => { saveLikedQuotes(likedQuotes); }, [likedQuotes]);

  useEffect(() => { saveFavoriteMeta(favoriteMeta); }, [favoriteMeta]);

  useEffect(() => { saveCollections(collections); }, [collections]);

  useEffect(() => { setCategory(randomCategory()); }, [quote]);

  useEffect(() => {
    if (!quote) return;
    incrementTodayView();
    setTodayViews((prev) => prev + 1);
  }, [quote]);

  useEffect(() => {
    if (!user?.uid) return () => {};

    const payload = {
      favorites: likedQuotes,
      streak: streakCount,
      lastVisit: streakLastVisit,
      stats: {
        viewedToday: todayViews,
        favoritesAdded: todayLikes,
      },
      favoriteMeta,
      collections,
    };

    const timer = setTimeout(() => {
      saveUserData(user.uid, payload).catch((error) => {
        console.error("Failed to save cloud user data", error);
      });
    }, 450);

    return () => clearTimeout(timer);
  }, [user?.uid, likedQuotes, streakCount, streakLastVisit, todayViews, todayLikes, favoriteMeta, collections]);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!streakBroken) return;
    const timer = setTimeout(() => {
      setStreakBroken(false);
      clearStreakBrokenFlag();
    }, 3500);

    return () => clearTimeout(timer);
  }, [streakBroken]);

  const isLiked = likedQuotes.some((q) => q.quote === quote);

  const getNextQuote = async () => {
    await getQuote(mood);
    prefetchQuote(mood);
    if (mood === "Stressed") setCategory("Wisdom");
    else if (mood === "Tired") setCategory("Life");
    else if (mood === "Low") setCategory("Perseverance");
    else setCategory("Motivation");
  };

  const handleMoodSelect = async (nextMood) => {
    setMood(nextMood);
    prefetchQuote(nextMood);
    await getQuote(nextMood);
  };

  const toggleLike = () => {
    if (!quote) return;
    if (isLiked) {
      setLikedQuotes(likedQuotes.filter((q) => q.quote !== quote));
    } else {
      setLikedQuotes([...likedQuotes, { quote, author, category }]);
      incrementTodayLike();
      setTodayLikes((prev) => prev + 1);
    }
  };

  const removeQuote = (quoteToRemove) =>
    setLikedQuotes(likedQuotes.filter((q) => q.quote !== quoteToRemove.quote));

  const handleQuoteOfDay = () => {
    if (likedQuotes.length === 0) return;
    const pick = likedQuotes[Math.floor(Math.random() * likedQuotes.length)];
    setQotd(pick);
    setTimeout(() => setQotd(null), 4000);
  };

  const handleSpeakQuote = () => {
    if (!("speechSynthesis" in window) || !quote) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(`${quote}. By ${author}.`);
    utterance.rate = 0.94;
    utterance.pitch = 0.95;
    utterance.volume = 0.95;

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const updateFavoriteMeta = (quoteText, updates) => {
    setFavoriteMeta((prev) => ({
      ...prev,
      [quoteText]: { ...(prev[quoteText] || {}), ...updates },
    }));
  };

  const addCollection = (name) => {
    const clean = name.trim();
    if (!clean) return;
    if (collections.includes(clean)) return;
    setCollections((prev) => [...prev, clean]);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Failed to sign out", error);
    } finally {
      setIsUserMenuOpen(false);
    }
  };

  const userInitial = (user?.displayName || user?.email || "U").trim().charAt(0).toUpperCase();

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const isTyping = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (isTyping) return;

      if (event.code === "Space") {
        event.preventDefault();
        getQuote(mood);
      }

      if (event.key?.toLowerCase() === "l") {
        event.preventDefault();
        toggleLike();
      }

      if (event.key?.toLowerCase() === "f") {
        event.preventDefault();
        setFocusMode((prev) => !prev);
      }

      if (event.key === "Escape") {
        if (focusMode) setFocusMode(false);
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusMode, getQuote, mood, toggleLike]);

  useEffect(() => {
    prefetchQuote(mood);
  }, [mood, prefetchQuote]);

  return (
    <div className={`relative min-h-screen ${focusMode ? "focus-mode" : ""}`}>
      <Background />

      <nav className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 md:px-8 bg-white/10 backdrop-blur-lg border-b border-white/10 shadow-sm shadow-black/20 z-[999] transition-colors duration-300">
        <span className="text-[1.02rem] font-semibold text-white tracking-[0.4px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] select-none">
          🔖 Lumora
        </span>

        <div className="flex items-center gap-2.5 md:gap-3">
          <span className={`streak-chip ${streakBroken ? "is-broken" : ""}`}>
            🔥 {streakCount} day streak
          </span>

          {!focusMode && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="sidebar-toggle-btn xl:hidden"
            >
              Insights
            </button>
          )}

          {!user ? (
            <button
              type="button"
              className="auth-trigger-btn"
              onClick={() => setIsAuthModalOpen(true)}
              disabled={authLoading}
            >
              {authLoading ? "Loading..." : "Profile"}
            </button>
          ) : (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                className="avatar-btn"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                aria-label="Open profile menu"
              >
                {user.photoURL ? <img src={user.photoURL} alt="Profile" className="avatar-image" /> : userInitial}
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown acrylic-card">
                  <p className="user-name">{user.displayName || "Signed in user"}</p>
                  <p className="user-email">{user.email}</p>
                  <button type="button" className="user-dropdown-btn" onClick={handleSignOut}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {focusMode && (
        <button type="button" onClick={() => setFocusMode(false)} className="focus-exit-btn">
          Exit Focus
        </button>
      )}

      <main className="relative z-[2] flex min-h-screen pt-16">
        {!focusMode && (
          <div className="hidden xl:block w-[300px] pl-4 pt-6">
            <LeftSidebar
              today={today}
              calendarGrid={calendarGrid}
              streakDaySet={streakDaySet}
              streakCount={streakCount}
            />
          </div>
        )}

        <div className="flex-1 flex justify-center px-6 pb-24 pt-6">
          <div className="w-full max-w-3xl">
            <section className="mt-2 flex flex-col items-center">
              {loading ? <Loader /> : (
                <QuoteCard
                  quote={quote}
                  author={author}
                  category={category}
                  isLiked={isLiked}
                  onLikeToggle={toggleLike}
                  onNextQuote={getNextQuote}
                  loading={loading}
                  onSpeakQuote={handleSpeakQuote}
                  onExplain={() => setShowExplain((prev) => !prev)}
                  isFocusMode={focusMode}
                />
              )}

              {!focusMode && showExplain && explainText && (
                <div className="explain-box glass-card glass-card-hover">
                  <p><span>Meaning:</span> {explainText.meaning}</p>
                  <p><span>Real-life:</span> {explainText.realLife}</p>
                  <p><span>Apply:</span> {explainText.apply}</p>
                </div>
              )}
            </section>

            {!focusMode && (
              <section className="mt-14 flex flex-col gap-6">
                <div className="tools-row">
                  <div className="mood-row">
                    {MOODS.map((m) => (
                      <button
                        key={m}
                        onClick={() => { void handleMoodSelect(m); }}
                        className={`mood-pill ${mood === m ? "is-active" : ""}`}
                      >
                        {m}
                      </button>
                    ))}
                    <button onClick={() => setFocusMode((prev) => !prev)} className={`mood-pill ${focusMode ? "is-active" : ""}`}>
                      Focus Mode
                    </button>
                  </div>
                </div>
              </section>
            )}

            {!focusMode && (
              <section className="mt-14 flex justify-center">
                <FavoriteQuotesSection
                  likedQuotes={likedQuotes}
                  onRemove={removeQuote}
                  onQuoteOfDay={handleQuoteOfDay}
                  favoriteMeta={favoriteMeta}
                  onMetaChange={updateFavoriteMeta}
                  collections={collections}
                  onAddCollection={addCollection}
                />
              </section>
            )}
          </div>
        </div>

        {!focusMode && (
          <div className="hidden xl:block w-[300px] pr-4 pt-6">
            <RightSidebar
              todayViews={todayViews}
              todayLikes={todayLikes}
              category={category}
            />
          </div>
        )}
      </main>

      {!focusMode && isSidebarOpen && (
        <div className="sidebar-drawer-backdrop xl:hidden" onClick={() => setIsSidebarOpen(false)}>
          <aside className="sidebar-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <h3 className="drawer-title">Insights</h3>
              <button type="button" className="drawer-close" onClick={() => setIsSidebarOpen(false)}>Close</button>
            </div>
            <RightSidebar
              todayViews={todayViews}
              todayLikes={todayLikes}
              category={category}
              isDrawer
            />
          </aside>
        </div>
      )}

      <div className="fixed bottom-7 left-7 z-[800]">
        <a
          href="https://www.linkedin.com/in/abhinav-bharti-860507368/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[var(--bg-glass)] backdrop-blur-[14px] border border-[var(--border)] text-[var(--text-muted)] shadow-[0_6px_24px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#0a66c2] hover:text-[#0a66c2] hover:bg-[rgba(10,102,194,0.15)] hover:-translate-y-[3px] hover:scale-110 hover:shadow-[0_10px_30px_rgba(10,102,194,0.35)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </div>

      {qotd && (
        <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 bg-[var(--bg-glass2)] backdrop-blur-[14px] border border-[var(--accent)] rounded-[16px] px-7 py-5 max-w-[440px] w-[90vw] shadow-[0_12px_40px_rgba(0,0,0,0.7)] z-[10000] text-center animate-slide-up">
          <p className="text-[0.75rem] font-bold text-[var(--accent)] tracking-[1px] uppercase mb-2">✨ Quote of the Day</p>
          <p className="text-[0.95rem] italic text-[var(--text)] leading-relaxed mb-1.5">"{qotd.quote}"</p>
          <p className="text-[0.82rem] text-[var(--text-muted)] font-semibold">— {qotd.author}</p>
        </div>
      )}

      <AuthModal open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default App;