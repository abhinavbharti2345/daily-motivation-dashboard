import { useState, useMemo } from "react";

const CATEGORIES = ["All", "Motivation", "Success", "Wisdom", "Perseverance", "Date Added"];

const FavoriteQuotesSection = ({
    likedQuotes,
    onRemove,
    onQuoteOfDay,
    favoriteMeta,
    onMetaChange,
    collections,
    onAddCollection,
}) => {
    const [activeTag, setActiveTag] = useState("All");
    const [showQuotes, setShowQuotes] = useState(false);
    const [newCollection, setNewCollection] = useState("");

    const filtered = useMemo(() => {
        if (activeTag === "Date Added") return [...likedQuotes].reverse();
        if (activeTag !== "All") return likedQuotes.filter((q) => q.category === activeTag);
        return likedQuotes;
    }, [likedQuotes, activeTag]);

    const pinnedQuotes = filtered.filter((q) => favoriteMeta?.[q.quote]?.pinned);
    const normalQuotes = filtered.filter((q) => !favoriteMeta?.[q.quote]?.pinned);
    const revisitQuote = likedQuotes.length ? likedQuotes[Math.floor(Math.random() * likedQuotes.length)] : null;

    return (
        <div
            id="fav-bottom"
            className="glass-card glass-card-hover w-full max-w-[780px] px-7 pt-6 pb-5 transition-colors duration-300"
        >
            <div className="text-center mb-5">
                <h2 className="text-[1.3rem] font-extrabold text-[var(--accent-gold)] tracking-[1px]">
                    ✨ Your Favorite Quotes ✨
                </h2>
            </div>

            {revisitQuote && (
                <div className="mb-4 px-4 py-3 rounded-[12px] bg-[var(--accent-dim)] border border-[var(--border)]">
                    <p className="text-[0.72rem] uppercase tracking-[1px] text-[var(--accent)] font-bold mb-1">Revisit</p>
                    <p className="text-[0.86rem] italic text-[var(--text)]">"{revisitQuote.quote}"</p>
                    <p className="text-[0.75rem] text-[var(--text-muted)] mt-1">— {revisitQuote.author}</p>
                </div>
            )}

            {showQuotes && filtered.length > 0 && (
                <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto mb-[18px] pr-1 fav-scroll">
                    {[...pinnedQuotes, ...normalQuotes].map((q, i) => (
                        <div
                            key={i}
                            className="group flex items-start gap-3 px-4 py-3.5 bg-[var(--accent-dim)] border border-[var(--border)] rounded-[10px] transition-all duration-300 animate-slide-up-fast hover:translate-x-1 hover:border-[var(--accent)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                        >
                            <span className="min-w-[26px] h-[26px] bg-[var(--accent)] text-white rounded-full flex items-center justify-center font-extrabold text-[0.75rem] shrink-0">
                                {i + 1}
                            </span>

                            <div className="flex-1 text-left">
                                <p className="text-[0.88rem] italic text-[var(--text)] leading-[1.55] mb-1">"{q.quote}"</p>
                                <p className="text-[0.78rem] text-[var(--text-muted)] font-semibold mb-[5px]">— {q.author}</p>

                                <div className="flex gap-2 mb-2 flex-wrap">
                                    <button
                                        onClick={() => onMetaChange(q.quote, { pinned: !favoriteMeta?.[q.quote]?.pinned })}
                                        className={`smart-action-btn ${favoriteMeta?.[q.quote]?.pinned ? "is-active" : ""}`}
                                    >
                                        Pin
                                    </button>
                                    <select
                                        className="collection-select"
                                        value={favoriteMeta?.[q.quote]?.collection || ""}
                                        onChange={(e) => onMetaChange(q.quote, { collection: e.target.value })}
                                    >
                                        <option value="">Collection</option>
                                        {collections.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>

                                <input
                                    type="text"
                                    maxLength={120}
                                    className="note-input"
                                    placeholder="Why did I save this?"
                                    value={favoriteMeta?.[q.quote]?.note || ""}
                                    onChange={(e) => onMetaChange(q.quote, { note: e.target.value })}
                                />

                                {q.category && (
                                    <span className="inline-block bg-[var(--accent-dim)] text-[var(--accent)] text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full tracking-[0.5px]">
                                        {q.category}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => onRemove(q)}
                                title="Remove"
                                className="text-[1rem] cursor-pointer p-1 opacity-0 scale-[0.85] group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-[6px] text-[var(--text-muted)] bg-transparent border-none hover:bg-[rgba(220,53,69,0.15)] hover:text-[#dc3545] hover:!scale-[1.15]"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2 mb-4">
                <input
                    value={newCollection}
                    onChange={(e) => setNewCollection(e.target.value)}
                    className="note-input"
                    placeholder="Create collection"
                />
                <button
                    onClick={() => {
                        onAddCollection(newCollection);
                        setNewCollection("");
                    }}
                    className="smart-action-btn"
                >
                    Add
                </button>
            </div>

            <div className="flex items-start gap-3 flex-wrap">
                <div className="flex gap-2 flex-wrap flex-1 min-w-[320px]">
                    {CATEGORIES.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => { setActiveTag(tag); setShowQuotes(true); }}
                            className={`h-[34px] px-3.5 rounded-full border text-[0.74rem] font-semibold cursor-pointer tracking-[0.2px] transition-all duration-300
                ${activeTag === tag
                                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_3px_12px_var(--accent-glow)]"
                                    : "bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onQuoteOfDay}
                    className="h-[34px] px-4 bg-transparent text-[var(--text-muted)] border border-[var(--border)] rounded-full text-[0.74rem] font-bold cursor-pointer tracking-[0.25px] transition-all duration-300 whitespace-nowrap hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]"
                >
                    Quote of the Day
                </button>
            </div>

            <p className="mt-4 text-left text-[0.84rem] font-bold text-[var(--text-muted)] tracking-[0.35px]">
                Total: {likedQuotes.length} quotes
            </p>
        </div>
    );
};

export default FavoriteQuotesSection;
