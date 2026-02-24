import { useState, useEffect } from "react";
import useQuote from "./hooks/useQuote";
import QuoteCard from "./components/QuoteCard";
import Loader from "./components/Loader";
import Sidebar from "./components/Sidebar";
import FavoriteQuotesSection from "./components/FavoriteQuotesSection";
import {
  getLikedQuotes,
  saveLikedQuotes,
  getDarkMode,
  saveDarkMode,
  updateStreak,
  incrementTodayLike,
  getMostLikedQuote,
} from "./utils/localStorage";
import bgImage from "./assets/background.png";

const CATEGORIES = ["Motivation", "Success", "Wisdom", "Perseverance", "Life"];
const randomCategory = () => CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

function App() {
  const { quote, author, loading, getQuote } = useQuote();
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [streak, setStreak] = useState(1);
  const [category, setCategory] = useState(randomCategory());
  const [qotd, setQotd] = useState(null);

  // Load persisted data on mount
  useEffect(() => {
    setLikedQuotes(getLikedQuotes());
    setDarkMode(getDarkMode());
    setStreak(updateStreak());
  }, []);

  // Persist liked quotes whenever they change
  useEffect(() => { saveLikedQuotes(likedQuotes); }, [likedQuotes]);

  // Apply dark/light class and persist preference
  useEffect(() => {
    document.body.classList.toggle("light-mode", !darkMode);
    saveDarkMode(darkMode);
  }, [darkMode]);

  // Assign a new random category each time the quote refreshes
  useEffect(() => { setCategory(randomCategory()); }, [quote]);

  const isLiked = likedQuotes.some((q) => q.quote === quote);

  const toggleLike = () => {
    if (!quote) return;
    if (isLiked) {
      setLikedQuotes(likedQuotes.filter((q) => q.quote !== quote));
    } else {
      setLikedQuotes([...likedQuotes, { quote, author, category }]);
      incrementTodayLike();
    }
  };

  const removeQuote = (quoteToRemove) =>
    setLikedQuotes(likedQuotes.filter((q) => q.quote !== quoteToRemove.quote));

  // Pick a random quote from the saved list and show it as a toast
  const handleQuoteOfDay = () => {
    if (likedQuotes.length === 0) return;
    const pick = likedQuotes[Math.floor(Math.random() * likedQuotes.length)];
    setQotd(pick);
    setTimeout(() => setQotd(null), 4000);
  };

  const mostLiked = getMostLikedQuote();

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="bg-layer" style={{ backgroundImage: `url(${bgImage})` }} />

      {/* Navigation bar */}
      <div className="topbar">
        <div className="streak-pill">
          <span>🔥</span>
          <span>Daily Streak: <strong>{streak} {streak === 1 ? "Day" : "Days"}</strong></span>
        </div>
        <div className="topbar-right">
          <span className="darkmode-label">Dark Mode</span>
          <button
            id="dark-mode-toggle"
            className={`toggle-switch ${darkMode ? "on" : ""}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
      </div>

      <h1 className="app-title">
        <span className="title-icon">🔖</span> Daily Motivation Dashboard
      </h1>

      {/* Main layout: streak | quote | calendar+tracker */}
      <div className="main-grid">
        <div className="left-col">
          <div className="streak-card">
            <span className="streak-label">🚀 Daily Streak: {streak} {streak === 1 ? "Day" : "Days"}</span>
            <div className="streak-num">{streak}</div>
          </div>
        </div>

        <div className="center-col">
          {loading ? (
            <Loader />
          ) : (
            <QuoteCard
              quote={quote}
              author={author}
              category={category}
              isLiked={isLiked}
              onLikeToggle={toggleLike}
              onNextQuote={getQuote}
              loading={loading}
            />
          )}
        </div>

        <Sidebar mostLikedQuote={mostLiked} />
      </div>

      <FavoriteQuotesSection
        likedQuotes={likedQuotes}
        onRemove={removeQuote}
        onQuoteOfDay={handleQuoteOfDay}
      />

      {/* LinkedIn profile link */}
      <div className="bottom-footer">
        <a
          href="https://www.linkedin.com/in/abhinav-bharti-860507368/"
          target="_blank"
          rel="noreferrer"
          className="footer-linkedin"
          aria-label="LinkedIn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </div>

      {/* Quote of the Day — temporary toast overlay */}
      {qotd && (
        <div className="qotd-toast show">
          <p className="qotd-label">✨ Quote of the Day</p>
          <p className="qotd-text">"{qotd.quote}"</p>
          <p className="qotd-author">— {qotd.author}</p>
        </div>
      )}
    </div>
  );
}

export default App;