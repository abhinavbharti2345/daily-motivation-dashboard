import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ open, onClose }) => {
  const { signInWithEmail, signUpWithEmail, isFirebaseConfigured } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;


  const onEmailSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      if (isSignUp) {
        await signUpWithEmail(name, email, password);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Unable to continue with email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal glass-card" onClick={(event) => event.stopPropagation()}>
        <p className="auth-title">Welcome Back</p>
        <p className="auth-subtitle">Sign in to sync favorites, streak, and daily stats.</p>

        {!isFirebaseConfigured && (
          <p className="auth-error">Firebase is not configured. Add VITE_FIREBASE env values to enable sign-in.</p>
        )}



        <form className="auth-form" onSubmit={onEmailSubmit}>
          {isSignUp && (
            <input
              type="text"
              className="auth-input"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={!isFirebaseConfigured || isSubmitting}
            />
          )}
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={!isFirebaseConfigured || isSubmitting}
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={!isFirebaseConfigured || isSubmitting}
          />

          <button type="submit" className="auth-email-btn" disabled={!isFirebaseConfigured || isSubmitting}>
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch-btn"
          onClick={() => setIsSignUp((prev) => !prev)}
          disabled={!isFirebaseConfigured || isSubmitting}
        >
          {isSignUp ? "Already have an account? Sign In" : "No account? Create one"}
        </button>

        {error && <p className="auth-error">{error}</p>}
      </div>
    </div>
  );
};

export default AuthModal;
