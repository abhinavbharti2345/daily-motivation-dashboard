const Loader = () => {
  return (
    <div className="relative w-full bg-[var(--bg-glass)] backdrop-blur-[14px] border border-[var(--border)] rounded-[16px] px-9 py-[60px] text-center shadow-[0_12px_48px_rgba(0,0,0,0.55)] transition-colors duration-300">
      <div className="inline-block w-12 h-12 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin-slow mx-auto" />
      <p className="mt-5 text-[var(--text-muted)] text-base italic">
        Getting your daily dose of motivation...
      </p>
    </div>
  );
};

export default Loader;