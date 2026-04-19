const LikeButton = ({ isLiked, onClick }) => {
  return (
    <button
      id="like-btn"
      onClick={onClick}
      aria-label={isLiked ? "Unlike quote" : "Like quote"}
      className={`inline-flex items-center justify-center gap-1.5 h-[38px] px-5 rounded-full border text-[0.75rem] font-bold tracking-[1px] cursor-pointer uppercase transition-all duration-300
        ${isLiked
          ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_3px_12px_var(--accent-glow)] hover:bg-transparent hover:text-[var(--accent)]"
          : "bg-transparent border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-dim)] hover:shadow-[0_0_10px_var(--accent-glow)] hover:scale-[1.02]"
        }`}
    >
      <span className="text-[0.92rem]">{isLiked ? "❤️" : "🤍"}</span>
      {isLiked ? " LIKED" : " LIKE"}
    </button>
  );
};

export default LikeButton;