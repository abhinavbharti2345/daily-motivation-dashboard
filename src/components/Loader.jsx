const Loader = () => {
  return (
    <div className="glass-card glass-card-hover relative w-full max-w-[780px] px-9 py-[60px] text-center transition-colors duration-300">
      <div className="inline-block w-12 h-12 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin-slow mx-auto" />
      <p className="mt-5 text-[var(--text-muted)] text-base italic">
        Getting your daily dose of motivation...
      </p>
    </div>
  );
};

export default Loader;