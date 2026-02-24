import { useState, useMemo } from "react";

const CATEGORIES = ["All", "Motivation", "Success", "Wisdom", "Perseverance", "Date Added"];

const FavoriteQuotesSection = ({ likedQuotes, onRemove, onQuoteOfDay }) => {
    const [activeTag, setActiveTag] = useState("All");
    const [showQuotes, setShowQuotes] = useState(false);

    const filtered = useMemo(() => {
        if (activeTag === "Date Added") return [...likedQuotes].reverse();
        if (activeTag !== "All") return likedQuotes.filter((q) => q.category === activeTag);
        return likedQuotes;
    }, [likedQuotes, activeTag]);

    return (
        <div id="fav-bottom" className="fav-bar">
            <div className="fav-bar-title-row">
                <h2 className="fav-bar-title">✨ Your Favorite Quotes ✨</h2>
            </div>

            {showQuotes && filtered.length > 0 && (
                <div className="fav-bar-quotes">
                    {filtered.map((q, i) => (
                        <div key={i} className="fav-bar-card">
                            <span className="fav-bar-num">{i + 1}</span>
                            <div className="fav-bar-body">
                                <p className="fav-bar-qtext">"{q.quote}"</p>
                                <p className="fav-bar-author">— {q.author}</p>
                                {q.category && <span className="fav-bar-tag-chip">{q.category}</span>}
                            </div>
                            <button className="fav-bar-remove" onClick={() => onRemove(q)} title="Remove">🗑️</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="fav-bar-chips-row">
                <div className="fav-chips">
                    {CATEGORIES.map((tag) => (
                        <button
                            key={tag}
                            className={`fav-chip ${activeTag === tag ? "active" : ""}`}
                            onClick={() => { setActiveTag(tag); setShowQuotes(true); }}
                        >{tag}</button>
                    ))}
                </div>
                <button className="qotd-btn" onClick={onQuoteOfDay}>
                    Quote of the Day! ➜
                </button>
            </div>

            <p className="fav-bar-total">Total: {likedQuotes.length} quotes</p>
        </div>
    );
};

export default FavoriteQuotesSection;
