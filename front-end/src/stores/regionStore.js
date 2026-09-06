import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useRegionStore = defineStore("region", () => {
  // State: Guarda o objeto inteiro da região.
  const selectedRegion = ref({ value: "na", label: "NA" });

  // Getter (opcional, mas útil): Um atalho para pegar só o valor para a API.
  const regionValue = computed(() => selectedRegion.value.value);

  // Action: Ação para definir a nova região.
  function setRegion(newRegionObject) {
    selectedRegion.value = newRegionObject;
  }

  return { selectedRegion, regionValue, setRegion };
});
