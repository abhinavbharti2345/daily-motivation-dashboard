const LikeButton = ({ isLiked, onClick }) => {
  return (
    <button
      id="like-btn"
      onClick={onClick}
      aria-label={isLiked ? "Unlike quote" : "Like quote"}
      className={`inline-flex items-center gap-1.5 px-7 py-2.5 rounded-full border-2 text-[0.88rem] font-bold tracking-[1.5px] cursor-pointer uppercase transition-all duration-300
        ${isLiked
          ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_4px_20px_var(--accent-glow)] hover:bg-transparent hover:text-[var(--accent)]"
          : "bg-transparent border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-dim)] hover:shadow-[0_0_18px_var(--accent-glow)] hover:scale-[1.04]"
        }`}
    >
      <span className="text-[1rem]">{isLiked ? "❤️" : "🤍"}</span>
      {isLiked ? " LIKED" : " LIKE"}
    </button>
  );
};

export default LikeButton;