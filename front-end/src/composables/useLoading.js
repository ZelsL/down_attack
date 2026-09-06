import { ref, readonly, computed } from "vue";

const activeCalls = ref(0);

const isLoading = computed(() => activeCalls.value > 0);

export function useLoading() {
  const wrapRequest = async (promise) => {
    activeCalls.value++;
    try {
      return await promise;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    } finally {
      activeCalls.value--;
    }
  };

  return {
    isLoading: readonly(isLoading),
    wrapRequest,
  };
}
