import { computed } from "vue";

const DEFAULT_ANONYMOUS_FEATURES = [
  "read:status",
  "create:session",
  "create:user",
];

export const useAuth = () => {
  const authIsLoading = useState("auth:loading", () => true);
  const user = useState("auth:user", () => null);

  const isAuthenticated = computed(() => {
    return Boolean(user.value?.discord_id);
  });

  const avatarUrl = computed(() => {
    if (!user.value?.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.value.discord_id}/${user.value.avatar}.png`;
  });

  const features = computed(() => {
    return user.value?.features || DEFAULT_ANONYMOUS_FEATURES;
  });

  async function fetchUser() {
    try {
      const data = await $fetch("/api/v1/user");
      user.value = data;
    } catch {
      user.value = null;
    } finally {
      authIsLoading.value = false;
    }
  }

  async function logout() {
    await $fetch("/api/v1/sessions", {
      method: "DELETE",
    });

    user.value = null;
  }

  async function login() {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/v1/users";
    document.body.appendChild(form);
    form.submit();
  }

  return {
    user,
    isAuthenticated,
    avatarUrl,
    features,
    fetchUser,
    logout,
    login,
    authIsLoading,
  };
};
