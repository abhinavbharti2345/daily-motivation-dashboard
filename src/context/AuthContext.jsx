import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured, logout } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);



  const signInWithEmail = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured. Add your VITE_FIREBASE_* env values.");
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (name, email, password) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase is not configured. Add your VITE_FIREBASE_* env values.");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name,
    });
    return userCredential;
  };

  const signOutUser = async () => {
    await logout();
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isFirebaseConfigured,
      signInWithEmail,
      signUpWithEmail,
      signOutUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
};
