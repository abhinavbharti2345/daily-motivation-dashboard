import { useState, useEffect } from "react";
import useQuote from "./hooks/useQuote";
import QuoteCard from "./components/QuoteCard";
import Loader from "./components/Loader";
import FavoriteQuotesSection from "./components/FavoriteQuotesSection";
import {
  getLikedQuotes,
  saveLikedQuotes,
  getDarkMode,
  saveDarkMode,
  incrementTodayLike,
} from "./utils/localStorage";
import bgImage from "./assets/background.png";

const CATEGORIES = ["Motivation", "Success", "Wisdom", "Perseverance", "Life"];
const randomCategory = () => CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

function App() {
  const { quote, author, loading, getQuote } = useQuote();
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [category, setCategory] = useState(randomCategory());
  const [qotd, setQotd] = useState(null);

  useEffect(() => {
    setLikedQuotes(getLikedQuotes());
    setDarkMode(getDarkMode());
  }, []);

  useEffect(() => { saveLikedQuotes(likedQuotes); }, [likedQuotes]);

  useEffect(() => {
    document.body.classList.toggle("light-mode", !darkMode);
    saveDarkMode(darkMode);
  }, [darkMode]);

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

  const handleQuoteOfDay = () => {
    if (likedQuotes.length === 0) return;
    const pick = likedQuotes[Math.floor(Math.random() * likedQuotes.length)];
    setQotd(pick);
    setTimeout(() => setQotd(null), 4000);
  };

  return (
    <div className={`relative z-[1] min-h-screen flex flex-col pb-24 ${darkMode ? "dark" : "light"}`}>

      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 bg-layer"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <nav className="fixed top-0 left-0 right-0 h-[52px] flex items-center justify-between px-6 bg-[var(--bg-nav)] backdrop-blur-[16px] border-b border-[var(--border)] z-[999] transition-colors duration-300">
        <span className="text-[1.05rem] font-extrabold italic text-[var(--accent-gold)] tracking-[1px] [text-shadow:0_0_20px_var(--accent-glow)] select-none">
          🔖 Daily Motivation
        </span>

        <div className="flex items-center gap-3">
          <span className="text-[0.85rem] font-semibold text-[var(--text-muted)] tracking-[0.5px]">Dark Mode</span>
          <button
            id="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-[54px] h-[27px] rounded-full border-none cursor-pointer p-0 transition-colors duration-300 ${darkMode ? "bg-[var(--accent)]" : "bg-[var(--text-muted)]"}`}
          >
            <span
              className={`absolute top-[3px] left-[3px] w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-[27px]" : ""}`}
            />
          </button>
        </div>
      </nav>

      <h1 className="mt-[66px] text-center text-[2.5rem] font-black italic text-[var(--accent-gold)] tracking-[1.5px] [text-shadow:0_0_40px_var(--accent-glow),0_2px_8px_rgba(0,0,0,0.5)] pt-4 px-5 leading-[1.2]">
        <span className="not-italic mr-2">🔖</span> Daily Motivation Dashboard
      </h1>

      <div className="flex flex-col items-center pt-7 px-8 max-w-[1200px] mx-auto w-full">
        {loading ? <Loader /> : (
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

      <FavoriteQuotesSection
        likedQuotes={likedQuotes}
        onRemove={removeQuote}
        onQuoteOfDay={handleQuoteOfDay}
      />

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
    </div>
  );
}

export default App;