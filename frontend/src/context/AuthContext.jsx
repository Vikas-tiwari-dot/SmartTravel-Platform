import { createContext, useContext, useState, useCallback, useEffect } from "react";
import * as authService from "../services/authService";
import { getToken, clearToken } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socketService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "loading" here covers the initial "do we have a valid session?" check,
  // so routes don't flash a login screen before that check resolves.
  const [status, setStatus] = useState(getToken() ? "loading" : "idle");

  // On first load, if a token is saved, ask the backend who it belongs to
  // rather than trusting a locally-cached user object (which could be stale
  // or, if a token was revoked/expired, wrong).
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setStatus("idle");
      return;
    }
    authService
      .fetchCurrentUser()
      .then((freshUser) => {
        setUser(freshUser);
        connectSocket();
      })
      .catch(() => clearToken())
      .finally(() => setStatus("idle"));
  }, []);

  const signIn = useCallback(async (credentials) => {
    setStatus("loading");
    try {
      const { user } = await authService.login(credentials);
      setUser(user);
      connectSocket();
      setStatus("idle");
      return user;
    } catch (err) {
      setStatus("idle");
      throw err;
    }
  }, []);

  const signUp = useCallback(async (details) => {
    setStatus("loading");
    try {
      const { user } = await authService.signup(details);
      setUser(user);
      connectSocket();
      setStatus("idle");
      return user;
    } catch (err) {
      setStatus("idle");
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    disconnectSocket();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const freshUser = await authService.fetchCurrentUser();
    setUser(freshUser);
    return freshUser;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, status, signIn, signUp, signOut, refreshUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
