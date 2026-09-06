import { computed } from "vue";
import PvpCalculator from "@/utils/PvpCalculator";

export function useDamageCalculator(inputData) {
  // Esta computed property vai recalcular sempre que algo mudar no inputData
  const results = computed(() => {
    // 1. Criar a instância da classe com os dados atuais
    const calculator = new PvpCalculator(inputData);

    // 2. Chamar os métodos de cálculo
    return {
      result: calculator.hpLossCalculator(inputData.state),
    };
  });

  return {
    result: results.value.result,
  };
}
