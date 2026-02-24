import { getLast7DaysData } from "../utils/localStorage";

const WeeklyTracker = () => {
    const data = getLast7DaysData();
    const maxVal = Math.max(...data.map((d) => d.count), 3); // at least 3 for visual

    return (
        <div className="weekly-tracker">
            <h4 className="tracker-title">📊 Weekly Motivation Tracker</h4>
            <div className="bar-chart">
                {data.map((day, i) => (
                    <div key={i} className="bar-col">
                        <div className="bar-wrap">
                            <div
                                className="bar"
                                style={{ height: `${Math.max((day.count / maxVal) * 100, 8)}%` }}
                                title={`${day.count} liked`}
                            />
                        </div>
                        <span className="bar-label">{day.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyTracker;
