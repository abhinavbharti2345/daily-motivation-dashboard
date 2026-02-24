import LikeButton from "./LikeButton";

const QuoteCard = ({ quote, author, category, isLiked, onLikeToggle, onNextQuote, loading }) => {
  return (
    <div className="card">
      <div className="card-deco top-left">❝</div>

      <h2 className="card-quote">"{quote}"</h2>
      <p className="card-author">- {author}</p>

      <div className="card-actions">
        <LikeButton isLiked={isLiked} onClick={onLikeToggle} />
      </div>

      {category && (
        <div className="card-category">Category: {category}</div>
      )}

      {/* Next quote button */}
      <button
        id="get-inspired-btn"
        className="inspire-btn"
        onClick={onNextQuote}
        disabled={loading}
      >
        {loading ? "Loading..." : "➜ GET INSPIRED ✨"}
      </button>

      <div className="card-deco bottom-right">❞</div>
    </div>
  );
};

export default QuoteCard;