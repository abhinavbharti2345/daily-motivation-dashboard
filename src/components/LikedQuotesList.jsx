const LikedQuotesList = ({ likedQuotes }) => {
  return (
    <div className="liked-list">
      <h3>✨ Liked Quotes ✨</h3>
      {likedQuotes.length === 0 ? (
        <p className="liked-list-empty">No liked quotes yet. Start liking to build your collection!</p>
      ) : (
        likedQuotes.map((q, index) => (
          <div key={index} className="liked-item">
            <div className="liked-item-text">"{q.quote}"</div>
            <div className="liked-item-author">— {q.author}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default LikedQuotesList;