import { useState } from "react";

const LikedQuotesPanel = ({ likedQuotes, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top-right button */}
      <button className="liked-quotes-btn" onClick={() => setIsOpen(!isOpen)}>
        <span className="heart-icon">❤️</span>
        <span className="quote-count">{likedQuotes.length}</span>
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Modal panel */}
      <div className={`liked-quotes-modal ${isOpen ? "active" : ""}`}>
        <div className="modal-header">
          <h2>✨ Your Favorite Quotes ✨</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {likedQuotes.length === 0 ? (
            <p className="empty-message">
              No liked quotes yet. 💭 Start liking quotes to build your personal collection!
            </p>
          ) : (
            <div className="quotes-list">
              {likedQuotes.map((q, index) => (
                <div key={index} className="modal-quote-item">
                  <div className="quote-number">{index + 1}</div>
                  <div className="quote-content">
                    <p className="quote-text">"{q.quote}"</p>
                    <p className="quote-author">— {q.author}</p>
                  </div>
                  <button
                    className="remove-quote-btn"
                    onClick={() => onRemove(q)}
                    title="Remove from favourites"
                    aria-label="Remove quote"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <p className="total-count">Total: {likedQuotes.length} quotes</p>
        </div>
      </div>
    </>
  );
};

export default LikedQuotesPanel;
