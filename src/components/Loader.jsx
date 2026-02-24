const Loader = () => {
  return (
    <div className="card" style={{ textAlign: "center", padding: "60px 36px" }}>
      <div className="loader" />
      <p style={{ marginTop: "20px", color: "var(--text-muted)", fontSize: "1rem", fontStyle: "italic" }}>
        Getting your daily dose of motivation...
      </p>
    </div>
  );
};

export default Loader;