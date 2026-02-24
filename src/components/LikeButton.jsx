const LikeButton = ({ isLiked, onClick }) => {
  return (
    <button
      id="like-btn"
      className={`like-btn ${isLiked ? "liked" : ""}`}
      onClick={onClick}
      aria-label={isLiked ? "Unlike quote" : "Like quote"}
    >
      <span className="like-heart">{isLiked ? "❤️" : "🤍"}</span>
      {isLiked ? " LIKED" : " LIKE"}
    </button>
  );
};

export default LikeButton;