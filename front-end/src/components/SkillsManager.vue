<template>
  <div class="box">
    <div class="level">
      <div class="level-left">
        <h2 class="title is-5">
          Skills: <span class="has-text-primary">{{ selectedClass }}</span>
          <span v-if="skillsList.length" class="tag is-light ml-2">{{ skillsList.length }} encontradas</span>
        </h2>
      </div>
      <div class="level-right">
        <button class="button is-primary is-small" @click="$emit('create')">
          <span class="icon"><i class="fas fa-plus"></i></span>
          <span>New Skill</span>
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="has-text-centered p-5">
      <span class="icon is-large"><i class="fas fa-spinner fa-pulse fa-2x"></i></span>
      <p>Carregando skills...</p>
    </div>

    <div v-else class="table-container">
      <table class="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ícone</th>
            <th>Nome</th>
            <th>Spec</th>
            <th>Dano PvP</th>
            <th class="has-text-centered">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in skillsList" :key="item.skill.skill_id">
            <td>{{ item.skill.skill_id }}</td>
            <td>
              <figure class="image is-32x32">
                <img :src="item.skill.icon_path" alt="Icon" @error="setAltImg">
              </figure>
            </td>
            <td><strong>{{ item.skill.name }}</strong></td>
            <td>
              <span class="tag" :class="getSpecColor(item.skill.skill_spec)">
                {{ item.skill.skill_spec }}
              </span>
            </td>
            <td>{{ item.skill.pvp_damage }}%</td>
            <td class="has-text-centered">
              <div class="buttons are-small is-centered">
                <button class="button is-info is-light" @click="$emit('edit', item)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="button is-danger is-light" @click="deleteSkill(item.skill.skill_id)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="skillsList.length === 0">
            <td colspan="6" class="has-text-centered has-text-grey">
              Nenhuma skill encontrada para esta classe/spec.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import apiClient from '../services/api.js';

export default {
  name: 'SkillsManager',
  props: {
    selectedClass: {
      type: String,
      required: true
    }
  },
  emits: ['edit', 'create'], // Eventos que este componente envia para o Pai
  setup(props) {
    const skillsList = ref([]);
    const isLoading = ref(false);

    // Função auxiliar para imagem quebrada
    const setAltImg = (event) => {
      event.target.src = "/icons/default_icon.png";
    };

    // Define cor da tag baseada na spec
    const getSpecColor = (spec) => {
      if (!spec) return 'is-light';
      const s = spec.toLowerCase();
      if (s.includes('succession') || s.includes('prime')) return 'is-success';
      if (s.includes('awakening')) return 'is-danger';
      if (s.includes('absolute')) return 'is-warning';
      return 'is-info';
    };

    // Lógica principal de busca
    const fetchSkills = async () => {
      if (!props.selectedClass) return;
      
      isLoading.value = true;
      skillsList.value = []; // Limpa lista antiga

      try {
        // Lógica de split para nomes compostos (Ex: "Dark Knight Succession")
        // Pega a última palavra como Spec, e junta o resto como Nome da Classe
        const parts = props.selectedClass.split(' ');
        const spec = parts.pop(); 
        const className = parts.join(' '); 

        // Chama a API: /skills/Warrior/Succession
        const response = await apiClient.get(`/skills/${className}/${spec}`);
        
        console.log(response)
        if (response.data && response.data.skills) {
            // Se vier como objeto {"id":{...}}, converte para array
            // Se sua API já retorna array na nova rota, apenas atribua.
            const rawData = response.data.skills;
            skillsList.value = Array.isArray(rawData) ? rawData : Object.values(rawData);
        }
      } catch (error) {
        console.error("Erro ao buscar skills:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const deleteSkill = async (id) => {
        if(!confirm(`Deseja excluir a skill ID ${id}?`)) return;
        try {
            await apiClient.delete(`/skills/${id}`);
            // Remove da lista localmente
            skillsList.value = skillsList.value.filter(item => item.skill.skill_id !== id);
        } catch (error) {
            console.error("Erro ao deletar", error);
            alert("Erro ao deletar skill");
        }
    }

    // Observa mudanças na prop selectedClass para recarregar a tabela
    watch(() => props.selectedClass, () => {
      fetchSkills();
    });

    // Carrega na montagem inicial
    onMounted(() => {
      fetchSkills();
    });

    return {
      skillsList,
      isLoading,
      setAltImg,
      getSpecColor,
      deleteSkill
    };
  }
};
</script>

<style scoped>
.table-container {
  max-height: 70vh; /* Altura responsiva */
  overflow-y: auto;
}
.buttons.is-centered {
    justify-content: center;
}
</style>