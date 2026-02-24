const StreakBadge = ({ streak }) => {
    return (
        <div className="streak-badge">
            <span className="streak-icon">🔥</span>
            <span className="streak-text">Daily Streak: <strong>{streak} {streak === 1 ? "day" : "days"}</strong></span>
        </div>
    );
};

export default StreakBadge;
