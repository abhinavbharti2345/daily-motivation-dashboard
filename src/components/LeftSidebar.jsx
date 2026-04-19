const LeftSidebar = ({ today, calendarGrid, streakDaySet, streakCount }) => {
  return (
    <aside className="sidebar-content desktop-mode">
      <div className="glass-card sidebar-card">
        <div className="calendar-head">
          <p className="sidebar-title">Streak Calendar</p>
          <p className="calendar-count">🔥 {streakCount}</p>
        </div>
        <p className="calendar-subtitle">
          {today.toLocaleString("en-US", { month: "long" })} {calendarGrid.year}
        </p>

        <div className="calendar-weekdays">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarGrid.days.map((day, index) => {
            const isToday = day === today.getDate();
            const isStreak = day && streakDaySet.has(day);

            return (
              <span
                key={`${day ?? "blank"}-${index}`}
                className={`calendar-cell ${day ? "" : "is-empty"} ${isToday ? "is-today" : ""} ${isStreak ? "is-streak" : ""}`}
              >
                {day || ""}
                {isStreak && <span className="calendar-flame">•</span>}
              </span>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
