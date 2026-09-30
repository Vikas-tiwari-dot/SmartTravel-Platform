import { api, setToken, clearToken } from "./api";

export async function login({ email, password }) {
  const data = await api.post("/auth/login", { email, password });
  setToken(data.token);
  return data; // { user, token }
}

export async function signup({ name, email, password }) {
  const data = await api.post("/auth/signup", { name, email, password });
  setToken(data.token);
  return data; // { user, token }
}

export async function logout() {
  clearToken();
  try {
    await api.post("/auth/logout");
  } catch {
    // token already cleared client-side; nothing more to do
  }
  return true;
}

export async function fetchCurrentUser() {
  const data = await api.get("/auth/me");
  return data.user;
}
