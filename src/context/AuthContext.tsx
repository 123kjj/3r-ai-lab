"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  isConfigured: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function signIn() {
    if (!isFirebaseConfigured || !auth) {
      // Demo mode: no real auth configured. Silently no-op — the UI
      // should route people to demo experiences instead of calling this.
      console.warn("Firebase is not configured; running in demo mode.");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Sign-in failed:", err);
    }
  }

  async function signOut() {
    if (!isFirebaseConfigured || !auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isConfigured: isFirebaseConfigured, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
