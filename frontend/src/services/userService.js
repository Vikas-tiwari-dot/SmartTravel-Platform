import { api } from "./api";

export async function getMyProfile() {
  const data = await api.get("/users/me");
  return data.user;
}

export async function updateProfile(updates) {
  const data = await api.put("/users/me", updates);
  return data.user;
}
