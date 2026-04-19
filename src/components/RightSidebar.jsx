const RightSidebar = ({
  todayViews,
  todayLikes,
  category,
  isDrawer = false,
}) => {
  const containerClass = isDrawer ? "sidebar-content drawer-mode" : "sidebar-content desktop-mode";

  return (
    <aside className={containerClass}>
      <div className="glass-card sidebar-card">
        <p className="sidebar-title">Daily Analytics</p>
        <div className="sidebar-stats">
          <div className="stat-pill">
            <p className="stat-label">Viewed Today</p>
            <p className="stat-value">{todayViews}</p>
          </div>
          <div className="stat-pill">
            <p className="stat-label">Favorites Added</p>
            <p className="stat-value">{todayLikes}</p>
          </div>
          <div className="stat-pill">
            <p className="stat-label">Top Category</p>
            <p className="stat-value">{category}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
