// src/stores/authStore.js
import { defineStore } from "pinia";
import apiClient from "../services/api";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);

  const isLoggedIn = computed(() => !!user.value);
  const avatarUrl = computed(() => user.value?.avatarUrl);
  const isAdmin = computed(() => user.value?.role === "admin");

  async function checkAuthStatus() {
    try {
      const response = await apiClient.get("/auth/me");
      user.value = response.data;
    } catch (error) {
      user.value = null;
      console.error("User not authenticated", error.response?.data);
    }
  }

  async function logout() {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      user.value = null;
    }
  }

  return { user, isLoggedIn, avatarUrl, checkAuthStatus, logout, isAdmin };
});
