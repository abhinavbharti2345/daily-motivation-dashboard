import LikeButton from "./LikeButton";

const QuoteCard = ({
  quote,
  author,
  category,
  isLiked,
  onLikeToggle,
  onNextQuote,
  loading,
  onSpeakQuote,
  onExplain,
  isFocusMode,
}) => {
  return (
    <div className={`glass-card glass-card-hover relative w-full max-w-[780px] px-10 pt-12 pb-10 animate-slide-up transition-all duration-300 ${isFocusMode ? "focus-card" : ""}`}>

      <span className="absolute top-2 left-3.5 text-[4rem] text-[var(--accent-gold)] opacity-[0.14] leading-none not-italic">❝</span>
      <span className="absolute bottom-2 right-3.5 text-[4rem] text-[var(--accent-gold)] opacity-[0.14] leading-none not-italic">❞</span>

      <h2 className={`font-semibold italic text-[var(--text)] leading-[1.7] tracking-[0.2px] mb-5 text-center [text-shadow:0_1px_4px_rgba(0,0,0,0.28)] ${isFocusMode ? "text-[1.7rem] md:text-[2rem]" : "text-[1.35rem]"}`}>
        "{quote}"
      </h2>

      <p className="text-[0.88rem] text-[var(--text-muted)] font-medium text-center mb-6 tracking-[0.5px]">
        - {author}
      </p>

      {!isFocusMode && (
        <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
          <LikeButton isLiked={isLiked} onClick={onLikeToggle} />
          <button onClick={onSpeakQuote} className="quote-action-btn">Listen</button>
          <button onClick={onExplain} className="quote-action-btn">Explain this</button>
        </div>
      )}

      {isFocusMode && (
        <div className="flex justify-center items-center gap-3 mb-6">
          <LikeButton isLiked={isLiked} onClick={onLikeToggle} />
        </div>
      )}

      {category && (
        <div className="text-center text-[0.78rem] text-[var(--text-muted)] tracking-[0.5px]">
          Category: {category}
        </div>
      )}

      <button
        id="get-inspired-btn"
        onClick={onNextQuote}
        disabled={loading}
        className="block w-fit mx-auto mt-8 px-12 py-[14px] bg-gradient-to-br from-[var(--accent)] to-[#c47a10] text-white border-none rounded-full text-[0.94rem] font-extrabold tracking-[1.5px] cursor-pointer uppercase transition-all duration-300 shadow-[0_6px_18px_var(--accent-glow)] hover:-translate-y-[2px] hover:scale-[1.02] hover:shadow-[0_10px_24px_var(--accent-glow)] active:translate-y-[1px] active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {loading ? "Loading..." : "➜ GET INSPIRED ✨"}
      </button>
    </div>
  );
};

export default QuoteCard;