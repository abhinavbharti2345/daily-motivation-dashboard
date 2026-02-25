import LikeButton from "./LikeButton";

const QuoteCard = ({ quote, author, category, isLiked, onLikeToggle, onNextQuote, loading }) => {
  return (
    <div className="relative w-full bg-[var(--bg-glass)] backdrop-blur-[14px] border border-[var(--border)] rounded-[16px] px-9 pt-10 pb-7 shadow-[0_12px_48px_rgba(0,0,0,0.55)] animate-slide-up transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(0,0,0,0.45),0_0_0_1px_var(--accent)]">

      <span className="absolute top-2 left-3.5 text-[4rem] text-[var(--accent-gold)] opacity-[0.14] leading-none not-italic">❝</span>
      <span className="absolute bottom-2 right-3.5 text-[4rem] text-[var(--accent-gold)] opacity-[0.14] leading-none not-italic">❞</span>

      <h2 className="text-[1.15rem] font-semibold italic text-[var(--text)] leading-[1.75] tracking-[0.3px] mb-[18px] text-center [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]">
        "{quote}"
      </h2>

      <p className="text-[0.92rem] text-[var(--text-muted)] font-medium text-center mb-[22px] tracking-[0.5px]">
        - {author}
      </p>

      <div className="flex justify-center mb-3.5">
        <LikeButton isLiked={isLiked} onClick={onLikeToggle} />
      </div>

      {category && (
        <div className="text-center text-[0.78rem] text-[var(--text-muted)] tracking-[0.5px]">
          Category: {category}
        </div>
      )}

      <button
        id="get-inspired-btn"
        onClick={onNextQuote}
        disabled={loading}
        className="block w-fit mx-auto mt-5 px-[52px] py-[15px] bg-gradient-to-br from-[var(--accent)] to-[#c47a10] text-white border-none rounded-full text-[1rem] font-extrabold tracking-[2px] cursor-pointer uppercase transition-all duration-300 shadow-[0_8px_28px_var(--accent-glow)] hover:-translate-y-[3px] hover:scale-[1.04] hover:shadow-[0_14px_40px_var(--accent-glow)] active:-translate-y-[1px] active:scale-[1.01] disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {loading ? "Loading..." : "➜ GET INSPIRED ✨"}
      </button>
    </div>
  );
};

export default QuoteCard;