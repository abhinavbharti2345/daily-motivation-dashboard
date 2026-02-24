import { useState } from "react";

const MiniCalendar = () => {
    const today = new Date();
    const [current] = useState({ year: today.getFullYear(), month: today.getMonth() });

    const firstDay = new Date(current.year, current.month, 1).getDay();
    const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
    const monthName = new Date(current.year, current.month).toLocaleString("default", { month: "long" });

    const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div className="mini-calendar">
            <div className="cal-nav">
                <span className="cal-arrow">‹</span>
                <span className="cal-title">{monthName} {current.year}</span>
                <span className="cal-arrow">›</span>
            </div>
            <div className="cal-grid">
                {dayLabels.map((d) => (
                    <div key={d} className="cal-day-label">{d}</div>
                ))}
                {cells.map((d, i) => (
                    <div
                        key={i}
                        className={`cal-cell ${d === today.getDate() ? "today" : ""} ${d && (d === 8 || d === 15 || d === 22) ? "highlighted" : ""
                            }`}
                    >
                        {d || ""}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MiniCalendar;
