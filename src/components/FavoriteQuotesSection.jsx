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
        <div
            id="fav-bottom"
            className="mt-8 mx-auto max-w-[1200px] w-[calc(100%-64px)] bg-[var(--bg-glass2)] backdrop-blur-[14px] border border-[var(--border)] rounded-[16px] px-6 pt-5 pb-4 shadow-[0_8px_36px_rgba(0,0,0,0.5)] transition-colors duration-300"
        >
            <div className="text-center mb-4">
                <h2 className="text-[1.3rem] font-extrabold text-[var(--accent-gold)] tracking-[1px]">
                    ✨ Your Favorite Quotes ✨
                </h2>
            </div>

            {showQuotes && filtered.length > 0 && (
                <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto mb-[18px] pr-1 fav-scroll">
                    {filtered.map((q, i) => (
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

            <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex gap-2 flex-wrap flex-1">
                    {CATEGORIES.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => { setActiveTag(tag); setShowQuotes(true); }}
                            className={`px-[18px] py-[7px] rounded-full border text-[0.8rem] font-semibold cursor-pointer tracking-[0.3px] transition-all duration-300
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
                    className="px-5 py-2 bg-[var(--accent)] text-white border-none rounded-full text-[0.82rem] font-bold cursor-pointer tracking-[0.3px] transition-all duration-300 shadow-[0_4px_14px_var(--accent-glow)] whitespace-nowrap hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--accent-glow)]"
                >
                    Quote of the Day! ➜
                </button>
            </div>

            <p className="mt-3.5 text-center text-[0.92rem] font-bold text-[var(--text-muted)] tracking-[0.5px]">
                Total: {likedQuotes.length} quotes
            </p>
        </div>
    );
};

export default FavoriteQuotesSection;
