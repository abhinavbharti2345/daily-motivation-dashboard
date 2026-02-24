const DarkModeToggle = ({ darkMode, onToggle }) => {
    return (
        <div className="topbar">
            <div className="topbar-right">
                <span className="darkmode-label">Dark Mode</span>
                <button
                    id="dark-mode-toggle"
                    className={`toggle-switch ${darkMode ? "on" : ""}`}
                    onClick={onToggle}
                    aria-label="Toggle dark mode"
                >
                    <span className="toggle-thumb" />
                </button>
            </div>
        </div>
    );
};

export default DarkModeToggle;
