import MiniCalendar from "./MiniCalendar";
import WeeklyTracker from "./WeeklyTracker";

const Sidebar = ({ mostLikedQuote }) => {
    return (
        <aside className="sidebar">
            <MiniCalendar />
            <WeeklyTracker />
            <div className="most-liked-stat">
                <span className="star-icon">☆</span>
                <span className="most-liked-label">Most Liked Quote:</span>
                <span className="most-liked-author">
                    {mostLikedQuote ? mostLikedQuote.author : "—"}
                </span>
            </div>
        </aside>
    );
};

export default Sidebar;
